<template lang="html">
  <div>
    <loader fullPage v-if="isThirdPartyEnabled === ''"/>
    <div v-if="isThirdPartyEnabled === true">
      <operation-notification />
      <router-view />
    </div>
    <third-party-cookie-check
      v-if="performTpc"
      @onResponse="onResponse"
      @reInitiateTpc="reInitiateTpc"
      :isThirdPartyEnabled="isThirdPartyEnabled"
      :reInitiateTpcCounter="reInitiateTpcCounter" />
  </div>
</template>

<script>
import mapGettersMutations from '@/store/helpers/mapGettersMutations'
import {mapGetters} from 'vuex'
import router from '@/router'
import store from '@/store'
import {changeLanguage} from '@/locales/i18n'
import _ from 'lodash'
import OperationNotification from '@/components/molecules/OperationNotification/OperationNotification'
import expirationWatcher from '@/etc/expirationWatcher'
import ThirdPartyCookieCheck from '@/components/organisms/ThirdPartyCookieCheck'
import delay from 'timeout-as-promise'

export default {
  name: 'App',
  data () {
    return {
      performTpc: true,
      isThirdPartyEnabled: '',
      reInitiateTpcCounter: 0
    }
  },
  computed: {
    ...mapGettersMutations([
      {namespace: 'browser', name: 'windowWidth'},
      {namespace: 'browser', name: 'windowHeight'}
    ]),
    ...mapGetters('user', ['userLanguage']),
    ...mapGetters('browser', ['intervalId'])
  },
  async beforeCreate () {
    const urlParams = new URLSearchParams(window.location.search)
    // if we have the accessToken as query param, use this to initialize the user
    let accessToken = router.currentRoute.query['access-token'] || urlParams.get('access-token')
    var loginViaAccessToken
    if (accessToken) {
      loginViaAccessToken = store.dispatch('user/loginViaAccessToken', {accessToken})
    }

    // if we are using a user, that was initialized through accessToken, start
    // an expirationWatcher for the token
    await loginViaAccessToken
    if (store.getters['user/isLoggedInViaAccessToken']) {
      expirationWatcher.start({
        onExpire: () => store.dispatch('user/onSilentRenewError')
      })
    } else {
      // if we don't have a user through accessToken, try to silently login
      window.onload = async () => {
        await delay(2000)
        store.dispatch('user/initialSigninSilent')
      }
    }
  },
  created () {
    // if we have a language specified as query param, use this instead of the default language
    const urlParams = new URLSearchParams(window.location.search)
    let lang = router.currentRoute.query['language'] || urlParams.get('language')
    if (lang) {
      changeLanguage(lang)
    }

    // start the interval to update user/now regularly
    this.$store.dispatch('browser/startNowInterval')

    // check, if we are coming from a switching profile command
    this.$store.dispatch('user/checkForSwitchedProfiles')
  },
  mounted () {
    this.updateWindowSizes()
    window.addEventListener('resize', _.throttle(this.updateWindowSizes, 100))
  },
  beforeDestroy () {
    clearInterval(this.intervalId)
    window.removeEventListener('resize', this.updateWindowSizes)
  },
  methods: {
    updateWindowSizes () {
      this.windowWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
      this.windowHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
      this.$store.dispatch('operationNotification/_revealPossibleNotification')
    },
    updateLanguage () {
      changeLanguage(this.userLanguage)
    },
    onResponse (isEnabled) {
      this.isThirdPartyEnabled = isEnabled
    },
    async reInitiateTpc (payload) {
      this.performTpc = false
      await delay(500)
      this.reInitiateTpcCounter++
      this.performTpc = true
    }
  },
  watch: {
    userLanguage: {
      handler: 'updateLanguage',
      immediate: true
    }
  },
  components: {
    OperationNotification,
    ThirdPartyCookieCheck
  }
}
</script>

<style lang="sass">
@import style/global/global
</style>
