<template lang="html">
  <div class="billing-address">
    <h4 class="billing-address__heading" :class="{'billing-address__heading--bold': showAsBox}">{{heading}}</h4>
    <div v-if="!emptyAddress" class="billing-address__wrapper" :class="{'billing-address__wrapper--border': showAsBox && !emptyAddress}">
      <ul class="billing-address__content" :class="{'billing-address__content--edit': isEditable}" :title="addressTitle">
        <li v-if="details.name" class="truncate-text" :class="{'truncate-text--highlight': showAsBox}">{{details.name}}</li>
        <li v-if="details.company" class="truncate-text" :class="{'truncate-text--highlight': showAsBox}">{{details.company}}</li>
        <li v-if="details.additionalAddress" class="name">{{details.additionalAddress}}</li>
        <li v-if="details.street || details.house">{{details.street}} {{details.house}}</li>
        <li v-if="details.city || details.zipCode">{{details.zipCode}} {{details.city}}</li>
        <li v-if="details.country">{{countryCode ? $t('countries.' + countryCode) : ''}}</li>
      </ul>
      <icon-button v-if="isEditable" @click="raiseEvent('edit')" icon="pencil" class="billing-address__edit" />
    </div>
    <div class="billing-address__add" v-show="showAsBox && showAddButton && emptyAddress" @click="raiseEvent('add')">
      <i class="fa fa-plus fa-2x add__icon"></i>
    </div>
    <loader spinnerSize="small" v-if="isLoading" />
  </div>
</template>
<script>
import _ from 'lodash'
import portalConfig from '@/config'

export default {
  name: 'BillingAddress',
  props: {
    isLoading: {
      type: Boolean,
      default: false
    },
    showAsBox: {
      type: Boolean,
      default: false
    },
    showAddButton: {
      type: Boolean,
      default: false
    },
    noAddressFound: {
      type: Boolean,
      default: false
    },
    heading: {
      type: String,
      required: true
    },
    details: {
      type: [Object, Array],
      required: true
    },
    isEditable: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    emptyAddress () {
      return _.isEmpty(this.details)
    },
    addressTitle () {
      var title = ''
      if (this.details && this.details.name) title += this.details.name + '\n'
      if (this.details && this.details.company) title += this.details.company + '\n'
      if (this.details && this.details.additionalAddress) title += this.details.additionalAddress + '\n'
      if (this.details && this.details.street || this.details.house) title += this.details.street + ' ' + this.details.house + '\n'
      if (this.details && this.details.zipCode || this.details.city) title += this.details.zipCode + ' ' + this.details.city + '\n'
      if (this.details && this.details.country) title += this.details.country
      return title
    },
    countryCode () {
      let countryObject = _.find(portalConfig.commonData.countries, {value: this.details && this.details.country})
      return countryObject && countryObject.code
    }
  },
  methods: {
    raiseEvent (eventType) {
      this.$emit(eventType)
    }
  }
}
</script>
<style lang="sass" scoped>
  @mixin singleLineEllipsis($lineHeight: 1.6em, $lineCount: 1, $bgColor: white)
    overflow: hidden
    position: relative
    line-height: $lineHeight
    max-height: $lineHeight * $lineCount
    text-align: justify
    overflow: hidden
    text-overflow: ellipsis
    white-space: nowrap
  .truncate-text
    @include singleLineEllipsis
    &--highlight
      font-weight: $font-weight-regular

  .billing-address
    max-width: 170px
    width: 100%
    &__heading
      font-weight: $font-weight-regular
      &--bold
        font-weight: $font-weight-bold
    &__wrapper
      position: relative
      display: flex
      align-items: center
      justify-content: space-between

      &--border
        border: 1px solid $color-border
        border-radius: $box-border-radius * 2
        padding: .50rem .75rem
        min-height: 100px
    &__content
      list-style: none
      margin: 0px
      padding: 0px
      width: 100%
      &--edit
        width: calc(100% - 24px)
    &__edit
      padding-left: .5rem
      width: auto
    &__add
      text-align: center
      padding: 32px
      cursor: pointer
      border: 1px solid $color-border
      border-radius: $box-border-radius * 2
      +ease(.3s)
      &:hover
        color: $color-keycolor-1
</style>
