<template lang="html">
  <div class="info-box info-active" :class="{ 'active-status': isActive, 'disabled': disabled, 'customer-order-detail': myOrderDetailPage}">
    <div class="info-img">
      <div class="info-img-in">
        <i
          :class="'fa fa-' + iconName"
          aria-hidden="true"/>
      </div>
    </div>
    <div class="info-text">
      <div class="info-text-in">
        <h3>{{text | truncate(12)}}</h3>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'OrderStatus',
  props: {
    iconName: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    myOrderDetailPage: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style lang="sass" scoped>
    .info
      &-box
        width: 100%
        max-width: 93px
        height: 93px
        border: 2px solid $color-border
        border-radius: 4px
        margin: 0
        background: $color-background-primary
        text-align: center
        margin-right: 15px
        margin-bottom: 15px
        padding: 0px 5px
        +md\-
          max-width: 75px
          height: 75px
        +xs\-
          padding: 0px 2px
        &:hover
          cursor: pointer
      &-box.disabled
        &:hover
          cursor: default
      &-img
        display: table
        width: 100%
        text-align: center
        height: 50px
        +md\-
          height: auto
        &-in

          display: table-cell
          vertical-align: middle
          +md\-
            height: auto
            padding: 5px 0px
          i
            font-size: 40px
            color: $font-regular-color
            +md\-
              font-size: 24px
      &-text
          display: table
          width: 100%
          text-align: center
          height: 45px
          &-in
            height: 45px
            display: table-cell
            vertical-align: middle
            word-break: break-word
            +md\-
              display: initial
            h3
              font-size: $font-size-smaller
              line-height: 15px
              font-weight: $font-weight-light
              margin: 0px
    .active-status
      border: 2px solid $color-indicator-error
    .customer-order-detail
        width: 100%
        height: 90px
</style>
