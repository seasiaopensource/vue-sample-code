<template lang="html">
  <div class="site">
    <site-navigation v-if="!isLoadingComputed" mode="external" />
    <router-view v-if="!isLoadingComputed" />
    <site-footer v-if="!isLoadingComputed" mode="external" />
    <loader v-else fullPage hideOverlay/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { SubscriptionStatusObj } from '@/etc/userClaims'
import { changeLanguage } from '@/locales/i18n'
import registration from '@/store/modules/global/registration'
import SiteNavigation from '@/components/organisms/Navigation/SiteNavigation'
import siteFooter from '@/components/organisms/Footer/SiteFooter'
import portalConfig from '@/config'

export default {
  name: 'ExternalSite',
  components: {
    SiteNavigation,
    'site-footer': siteFooter
  },
  computed: {
    ...mapGetters('user', [
      'isCompany',
      'isLoggedIn',
      'isLoggingOut',
      'isLoading',
      'isLoadingFetchSubscription',
      'subscriptionStatus',
      'userLanguage'
    ]),
    isLoadingComputed () {
      return this.isLoading || this.isLoadingFetchSubscription
    },
    hasSubscriptionFeature () {
      return portalConfig && portalConfig.addons && portalConfig.addons.hasSubscriptionService
    }
  },
  methods: {
    ...mapActions('user', [
      'makeLogoutChanges'
    ]),
    async checkLoginAndRedirect () {
      if (portalConfig.addons.dummyPortal) { return }
      if (this.isLoggedIn) {
        if (this.isCompany && this.hasSubscriptionFeature) {
          if (this.subscriptionStatus === SubscriptionStatusObj.keyByName.Initial) {
            this.$router.push({name: 'companyProfileSubscription'})
            return
          }

          if (this.subscriptionStatus === SubscriptionStatusObj.keyByName.InGracePeriod) {
            this.$router.push({name: 'companyProfilePaymentFailed'})
            return
          }

          if (this.subscriptionStatus === SubscriptionStatusObj.keyByName.Inactive) {
            this.$router.push({name: 'companyProfilePaymentExpired'})
            return
          }
        }

        if (this.$route.params.to) {
          this.$router.push(this.$route.params.to)
        } else {
          this.$router.push({name: 'internalArea'})
        }
      }
    },
    updateLanguage () {
      changeLanguage(this.userLanguage)
    }
  },
  watch: {
    async isLoggedIn () {
      if (this.isCompany && this.hasSubscriptionFeature) {
        await this.$store.dispatch('user/fetchSubscription')
      }
      this.checkLoginAndRedirect()
    },
    isLoading () {
      this.checkLoginAndRedirect()
    }
  },
  created () {
    if (this.isLoggingOut) {
      this.makeLogoutChanges()
      location.reload()
    }
    this.checkLoginAndRedirect()

    if (!this.$store.state.registration) {
      this.$store.registerModule('registration', registration)
    }
  },
  beforeDestroy () {
    this.$store.unregisterModule('registration', registration)
  }
}
</script>

<style lang="sass">
</style>
