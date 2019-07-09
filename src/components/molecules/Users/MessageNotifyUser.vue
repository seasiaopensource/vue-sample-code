<template lang="html">
  <div class="message" v-if="thread.threadId">
    <user-bar
      :name="thread.profile.displayName"
      truncateName
      :imageName="thread.profile.profilePictureName"
      :isOnline="isOnline"
      size="medium"
      :auxText="thread.message"
      truncateAuxText
      class="user-contact-list-item__user-bar"
      :badge="unreadMessagesCountMethod(thread.threadId)"
      :badgeRight="true"
      :categoryId="thread.categoryId"
    />
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  props: {
    thread: {
      type: Object,
      default () {
        return {}
      }
    },
    isOnline: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters('notifications/chatMessageNotification', [
      'unreadMessagesCount'
    ])
  },
  methods: {
    ...mapActions('notifications/chatMessageNotification', ['checkForUnreadMessages']),
    unreadMessagesCountMethod (threadId) {
      return this.unreadMessagesCount && this.unreadMessagesCount[threadId] || 0
    }
  }
}
</script>
<style lang="sass" scoped>
  .message
    cursor: pointer
    padding: .5rem
    +ease(.3s)
    &:hover
      background-color: $color-background-hover
      border-radius: $box-border-radius
    +xs\-
      padding: $box-padding-xs
      border-radius: 0
</style>
