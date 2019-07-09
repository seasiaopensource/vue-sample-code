<template lang="html">
  <div class="networking-request">
    <div
      v-if="timestamp"
      class="networking-request__timestamp">
      <span>{{ timestamp }}</span>
    </div>
    <div class="networking-request__user">
     <user-avatar
        :imageName="imageName"
        :categoryId="categoryId"
        size="mediumsmall"
        xsSize="mediumsmall"
        smSize="mediumsmall"
        @click="onClick"
        :profileAsLink="{ name: 'profileOverview', params: { profileId } }"
      />
      <stacked-text
        :upperText="name"
        :bottomText="bottomText(requestType, userName, groupName)"
        truncateUpper
        underlineUpperTextOnHover
        :upperTextAsLink="{ name: 'profileOverview', params: { profileId } }"
      />
    </div>
    <div class="networking-request__buttons">
      <text-button
        :name="$t('button.accept')"
        class="networking-request__button"
        size="small"
        color="secondary"
        @click="acceptNetworkRequest(requestType, groupId, profileId)"
      />
      <text-button
        :name="$t('button.decline')"
        inverted
        class="networking-request__button"
        size="small"
        color="secondary"
        @click="rejectNetworkRequest(requestType, groupId, profileId)"
      />
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import {getCategoryFromGlobalId, NetworkingRequest, JoinGroupRequest, InvitationToGroupRequest, EmployeeInvitation} from '@/etc/userClaims'

export default {
  props: {
    name: {
      type: String
    },
    imageName: {
      type: String
    },
    profileId: {
      required: true
    },
    groupId: {
      required: true
    },
    requestType: {
      required: true
    },
    groupName: {
      required: true
    },
    userName: {
      required: true
    },
    timestamp: {
    }
  },
  methods: {
    ...mapActions('navigation/navigationPendingRequests', [
      'acceptRequest',
      'rejectRequest',
      'acceptGroupInvitationRequest',
      'rejectGroupInvitationRequest',
      'acceptGroupMeberRequest',
      'rejectGroupMeberRequest',
      'rejectEmployeeGroupInvitationRequest',
      'acceptEmployeeGroupInvitationRequest'
    ]),
    onClick () {
      this.$emit('click')
    },
    acceptNetworkRequest (requestType, groupId, profileId) {
      if (requestType === NetworkingRequest) {
        this.acceptRequest({'destinationProfileId': profileId})
      } else if (requestType === JoinGroupRequest) {
        this.acceptGroupMeberRequest({ 'destinationProfileId': profileId, 'destinationGroupId': groupId })
      } else if (requestType === InvitationToGroupRequest) {
        this.acceptGroupInvitationRequest({ 'destinationGroupId': groupId })
      } else if (requestType === EmployeeInvitation) {
        this.acceptEmployeeGroupInvitationRequest({ 'groupId': groupId })
      }
    },
    rejectNetworkRequest (requestType, groupId, profileId) {
      if (requestType === NetworkingRequest) {
        this.rejectRequest({'destinationProfileId': profileId})
      } else if (requestType === JoinGroupRequest) {
        this.rejectGroupMeberRequest({ 'destinationProfileId': profileId, 'destinationGroupId': groupId })
      } else if (requestType === InvitationToGroupRequest) {
        this.rejectGroupInvitationRequest({ 'destinationGroupId': groupId })
      } else if (requestType === EmployeeInvitation) {
        this.rejectEmployeeGroupInvitationRequest({ 'groupId': groupId })
      }
    },
    bottomText (requestType, userName, groupName) {
      if (requestType === NetworkingRequest) {
        return this.$t('navbar.networkingOverview.connecting')
      } else if (requestType === JoinGroupRequest) {
        return this.$t('navbar.networkingOverview.joinGroup', {group: groupName})
      } else if (requestType === InvitationToGroupRequest) {
        return this.$t('navbar.networkingOverview.inviteGroup', {group: groupName})
      } else if (requestType === EmployeeInvitation) {
        return this.$t('navbar.networkingOverview.inviteEmployeeGroup')
      }
    }
  },
  computed: {
    categoryId () {
      return getCategoryFromGlobalId(this.profileId)
    }
  }
}
</script>
<style lang="sass" scoped>
.networking-request
  border-bottom: 1px solid $color-border
  padding: $box-padding

  &:last-of-type
    border: 0

  +sm\-
    padding: $box-padding-xs

  &__user
    display: flex
    margin-bottom: 1rem
    align-items: center
    .avatar
      margin-right: .5rem

  &__buttons
    margin-left: 53px
    display: flex
    flex-wrap: wrap
    justify-content: space-between
    +xs\-
      justify-content: flex-start

  &__button
    +xs\-
      margin-right: .5rem
    &:first-of-type
      margin-bottom: .5rem
</style>
