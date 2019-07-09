<template lang="html">
  <div class="inline">
    <i class="fa fa-caret-left" aria-hidden="true"></i>
    <box class="user-popover" transition="fade">
      <h4>{{ $t(heading) }}</h4>
      <ul>
        <li v-if="isCompany"> {{ userAddress.companyName }} </li>
        <li v-if="!isCompany"> {{ userAddress.firstName }} {{ userAddress.lastName }} </li>
        <li> {{ userAddress.street }} {{ userAddress.houseNo }}</li>
        <li> {{ userAddress.zipCode }} {{ userAddress.city }} </li>
        <li> {{ userAddress.country }} </li>
        <li v-if="userAddress.mobile"> {{ $t('checkoutSummary.mobile') }}: {{ userAddress.mobile }} </li>
        <li v-if="isAddress">{{ $t('checkoutSummary.noAddress') }}</li>
      </ul>
    </box>
  </div>
</template>
<script>
export default {
  computed: {
    isAddress () {
      if (!this.userAddress.street && !this.userAddress.state && !this.userAddress.houseNo && !this.userAddress.zipCode && !this.userAddress.city && !this.userAddress.country && !this.userAddress.mobile) {
        return true
      }
      return false
    }
  },
  props: {
    heading: {
      type: String
    },
    userAddress: {
      type: Object,
      default () {
        return {}
      }
    },
    isCompany: {
      type: Boolean
    }
  }
}
</script>
<style lang="sass" scoped>
  .inline
    display: inline-block
    position: absolute
    right: -5px
    top: 25px
    .fa-caret-left
      color: $color-border
      position: absolute
      font-size: 43px
      left: -15px
      top: 1rem
    .user-popover
      position: absolute
      width: 260px
      padding: 0 0 15px 0px
      z-index: 999
      +xs\-
        width: 180px
      h4
        border-bottom: 1px solid $color-border
        padding: 0.5rem 1rem
      ul
        margin: 0px
        padding: 0px
        li
          list-style-type: none
          padding: 0 1rem
          line-height: 1.4rem
          &:first-child
            font-weight: 700
</style>
