<template lang="html">
  <div v-if="!isCompany">
    <div v-if="hasMultipleProfiles" class="profile-select">
      <headline-text :name="$t('button.switch_profile')" fontWeight="regular" size="h4" />
      <button
        v-for="(profile, key) in this.otherProfiles"
        :key="key"
        class="user-button"
        @click="changeCurrentProfile(profile.profileId)">
        <user-bar
          :name="profile.displayName"
          :imageName="profile.profilePictureName"
          :auxText="$t(currentProfileType(profile.profileId))"
          :categoryId="categoryId(profile.profileId)"
          size="small"
          fontSizeUpper="small"
          fontWeightBottom="light"
          fontSizeBottom="small"
          truncateName
          truncateAuxText
        />
      </button>
    </div>
    <div v-else class="profile-setup">
      <headline-text :name="$t('button.add_profile')" fontWeight="regular" size="h4" />
      <icon-button circledButton icon="plus" color="secondary" @click="redirectToSetup" />
      <user v-if="isCurrentBusinessProfile" class="profile-setup__icon" />
      <user-business v-else class="profile-setup__icon" />
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import { mapGetters, mapActions } from 'vuex'
import mapGettersMutations from '@/store/helpers/mapGettersMutations'
import profileCreation from '@/store/modules/dynamic/profile/profileCreation'
import UserBusiness from '@/assets/img/user-business.svg?inline'
import User from '@/assets/img/user.svg?inline'
import { getCategoryFromGlobalId, CompanyProfileCategoryId, PersonPersonalProfileCategoryId, PersonBusinessProfileCategoryId } from '@/etc/userClaims'

export default {
  computed: {
    ...mapGetters('user', [
      'isCompany',
      'hasMultipleProfiles',
      'isCurrentBusinessProfile',
      'profileId'
    ]),
    ...mapGetters('navigation/navigationUserBox', ['otherProfiles']),
    ...mapGettersMutations([
      {name: 'profileType', namespace: 'profileCreation'}
    ])
  },
  methods: {
    categoryId (profileId) {
      var category = profileId.split('-')[0]
      return _.toNumber(category)
    },
    currentProfileType (profileTypeId) {
      var profileType = ''
      if (parseInt(getCategoryFromGlobalId(profileTypeId)) === CompanyProfileCategoryId) { profileType = 'profile_information.profileType.company' }
      if (parseInt(getCategoryFromGlobalId(profileTypeId)) === PersonPersonalProfileCategoryId) { profileType = 'profile_information.profileType.private' }
      if (parseInt(getCategoryFromGlobalId(profileTypeId)) === PersonBusinessProfileCategoryId) { profileType = 'profile_information.profileType.business' }
      return profileType
    },
    redirectToSetup () {
      this.$store.commit('additionalProfile/updateAdditionalProfileCreated', true)
      this.$store.commit('additionalProfile/updatePreviousProfileId', this.profileId)
      this.profileType = this.isCurrentBusinessProfile
        ? 'private'
        : 'business'
      return this.$router.push({ name: 'profileProfileInformation' })
    },
    ...mapActions('navigation/navigationUserBox', ['changeCurrentProfile'])
  },
  components: {
    User,
    UserBusiness
  },
  created () {
    if (!this.hasMultipleProfiles) {
      if (!this.$store.state.profileCreation) {
        this.$store.registerModule('profileCreation', profileCreation)
        this.$store.dispatch('profileCreation/fetchBasicInfo')
      } else {
        this.$store.dispatch('profileCreation/fetchBasicInfo')
      }
    }
  }
}
</script>
<style lang="sass" scoped>
  .profile-setup
    margin-top: 1rem
    margin-bottom: 2rem
    +xs\-
      margin-top: 0
      margin-bottom: 1rem
    .title
      margin-bottom: .5rem
    button
      display: inline-block
      vertical-align: top
    &__icon
      margin: 0 0 0 0.75rem
      display: inline-block
      vertical-align: bottom
      width: 24px
  .profile-select
    margin-top: 1rem
    margin-bottom: 2rem
    +xs\-
      margin-top: 0
      margin-bottom: 1rem
    .title
      margin-bottom: .5rem

    .user-button
      border: none
      background: transparent
      cursor: pointer
      display: block
      width: 100%
      padding: 0
      margin-bottom: .5rem

      &:focus
        outline: none
</style>
