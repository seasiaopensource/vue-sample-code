<template lang="html">
  <div>
    <site-navigation mode="creation" />
    <router-view />
    <site-footer mode="creation" />
  </div>
</template>

<script>
import SiteNavigation from '@/components/organisms/Navigation/SiteNavigation'
import siteFooter from '@/components/organisms/Footer/SiteFooter'
import { mapGetters } from 'vuex'
import profileCreation from '@/store/modules/dynamic/profile/profileCreation'

export default {
  name: 'SiteForProfileCreation',
  components: {
    SiteNavigation,
    'site-footer': siteFooter
  },
  computed: {
    ...mapGetters('user', [
      'isLoggedIn',
      'isCompany',
      'hasProfile'
    ])
  },
  watch: {
    isLoggedIn () {
      this.checkLoginAndRedirect()
    }
  },
  created () {
    if (this.checkLoginAndRedirect()) { return }
    if (!this.$store.state.profileCreation) {
      this.$store.registerModule('profileCreation', profileCreation)
    }
    if (this.$store.state.profileCreation) {
      if (this.hasProfile) {
        this.$store.dispatch('profileCreation/fetchDetailInfo')
      } else {
        this.$store.dispatch('profileCreation/fetchBasicInfo')
      }
    }
  },
  destroyed () {
    // this.$store.unregisterModule('profileCreation', profileCreation)
    // commented this out, because there were side effects in the portal,
    // when destroying it. It is actually also needed in the portal itself,
    // so destroying it is not neccessary anyway.
  },
  methods: {
    checkLoginAndRedirect () {
      if (!this.isLoggedIn) {
        this.$router.push({name: 'externalArea'})
        return true
      }
    }
  }
}
</script>

<style lang="sass">
</style>
