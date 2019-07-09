<template lang="html">
  <div>
    <drop-down-button
      v-if="connectionConnected"
      :text="$t('button.networking.connected')"
      icon="check"
      color="secondary"
      :actions="connectedBtnActions"
      @actionClick="onActionClick"
    />
    <drop-down-button
      v-else-if="connectionSourceSentNetworkingRequest"
      :text="$t('button.networking.sourceSentNetworkingRequest')"
      color="secondary"
      :actions="requestSentBtnActions"
      @actionClick="onActionClick"
    />
    <text-button
      v-else-if="connectionPendingForConfirmation"
      :name="$t('button.networking.pendingForConfirmation')" color="secondary"
      @click="acceptRequest({ sourceProfileId: userProfileId, destinationProfileId: withId })" />
    <text-button
      v-else-if="connectionNotConnected || connectionUnknown || sourceUnfollowedDestination || destinationUnfollowedSource"
      :name="$t('button.networking.notConnected')" color="secondary"
      @click="initiateRequest({ sourceProfileId: userProfileId, destinationProfileId: withId })"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import connectionRequestStore from '@/store/modules/dynamic/connectionRequest'
import registerSubmodule from '@/store/helpers/registerSubmodule'
// import unregisterSubmodule from '@/store/helpers/unregisterSubmodule'
import mapDynamicGetters from '@/store/helpers/mapDynamicGetters'
import mapDynamicActions from '@/store/helpers/mapDynamicActions'

const name = 'connectionRequest'

export default {
  name: 'ConnectButton',
  watch: {
    // call again the method if the route changes
    '$route': 'createDynamicStores'
  },
  props: {
    profileId: {
      required: true,
      type: String
    },
    query: {
      required: false,
      type: Object,
      default () {
        return {}
      }
    }
  },
  computed: {
    ...mapGetters('user', {userProfileId: 'profileId'}),
    ...mapDynamicGetters([
      {namespace: name, slug: 'withId', name: 'isLoading'},
      {namespace: name, slug: 'withId', name: 'networkingStatus'},
      {namespace: name, slug: 'withId', name: 'connectionProfileOwner'},
      {namespace: name, slug: 'withId', name: 'connectionSourceBlockedDestination'},
      {namespace: name, slug: 'withId', name: 'connectionDestinationBlockedSource'},
      {namespace: name, slug: 'withId', name: 'connectionSourceSentNetworkingRequest'},
      {namespace: name, slug: 'withId', name: 'connectionPendingForConfirmation'},
      {namespace: name, slug: 'withId', name: 'connectionUnknown'},
      {namespace: name, slug: 'withId', name: 'connectionConnected'},
      {namespace: name, slug: 'withId', name: 'connectionNotConnected'},
      {namespace: name, slug: 'withId', name: 'sourceUnfollowedDestination'},
      {namespace: name, slug: 'withId', name: 'destinationUnfollowedSource'}
    ]),
    withId () {
      return this.profileId
    },
    requestSentBtnActions () {
      return [
        {id: 'cancelRequest', text: this.$t('button.actions.cancelRequest')}
      ]
    },
    connectedBtnActions () {
      return [
        {id: 'disconnect', text: this.$t('button.actions.disconnect')}
      ]
    }
  },
  methods: {
    ...mapDynamicActions([
      {namespace: name, slug: 'withId', name: 'initiateRequest'},
      {namespace: name, slug: 'withId', name: 'cancelRequest'},
      {namespace: name, slug: 'withId', name: 'acceptRequest'},
      {namespace: name, slug: 'withId', name: 'updateWithId'},
      {namespace: name, slug: 'withId', name: 'deleteRequest'},
      {namespace: name, slug: 'withId', name: 'rejectRequest'}
    ]),
    createConnectionRequestStore (profileId) {
      if (this.userProfileId !== profileId) {
        registerSubmodule({module: connectionRequestStore, namespace: name, slug: profileId})
        this.updateWithId({newValue: profileId})
      }
    },
    createDynamicStores () {
      this.createConnectionRequestStore(this.withId)
    },
    async acceptOrDeclineNetworkRequest () {
      if (this.query && this.query.connection && this.query.connection === 'accept' && this.connectionPendingForConfirmation) {
        await this.acceptRequest({ sourceProfileId: this.userProfileId, destinationProfileId: this.withId })
      }
      if (this.query && this.query.connection && this.query.connection === 'decline' && this.connectionPendingForConfirmation) {
        await this.rejectRequest({ sourceProfileId: this.userProfileId, destinationProfileId: this.withId })
      }
    },
    onActionClick (actionId) {
      if (actionId === 'cancelRequest') {
        this.cancelRequest({ sourceProfileId: this.userProfileId, destinationProfileId: this.withId })
      }

      if (actionId === 'disconnect') {
        this.$emit('openModal', {
          message: this.$t('network.deleteConfirmBox')
        })
        // this.openConfirmationModal()
      }
    }
  },
  async created () {
    await this.createDynamicStores()
    await this.acceptOrDeclineNetworkRequest()
  },
  beforeDestroy () {
    // unregisterSubmodule({namespace: name, slug: this.withId})
  }
}
</script>
<style lang="sass" scoped>
  div
    display: inline-block
</style>
