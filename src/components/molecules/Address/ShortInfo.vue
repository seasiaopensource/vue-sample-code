<template lang="html">
  <div class="short-info">
    <split-grid :leftColSize="11" :rightColSize="1" :leftSmSize="11" :rightSmSize="1" narrowPadding class="wrapper">
      <div slot="left" class="address" @click="isActive = !isActive">
        <fancy-checkbox v-model="isActive" :size="'small'" />
        <stacked-text class="address__text" :upperText="address.name" :bottomText="info" fontSizeBottom="small" truncateUpper />
      </div>
      <div slot="right" class="edit-icon-box">
        <div class="edit">
          <i class="fa fa-pencil address__icon" @click="editAddress" />
        </div>
      </div>
    </split-grid>
  </div>
</template>
<script>
import _ from 'lodash'
import portalConfig from '@/config'

export default {
  props: {
    selected: {
      type: String
    },
    address: {
      required: true
    },
    addressType: {
      type: String,
      required: true,
      validator (value) {
        var possibleValues = [ 'billing', 'shipping' ]
        return possibleValues.includes(value)
      }
    }
  },
  computed: {
    countryCode () {
      let countryObject = _.find(portalConfig.commonData.countries, {value: this.address && this.address.country})
      return countryObject && countryObject.code
    },
    info () {
      let addressInfo = ''
      if (this.address.company) {
        addressInfo += `${this.address.company}, `
      }
      if (this.address.additionalAddress) {
        addressInfo += `${this.address.additionalAddress}, `
      }

      addressInfo += `${this.address.street} ${this.address.house}, ${this.address.zipCode} ${this.address.city}, ${this.countryCode ? this.$t('countries.' + this.countryCode) : ''}`

      return addressInfo
    },
    isActive: {
      get () {
        return this.selected === this.address.id
      },
      set (value) {
        var payload = {address: null, addressType: this.addressType}
        if (value) payload.address = this.address
        this.$emit('addressSelected', payload)
      }
    }
  },
  methods: {
    editAddress () {
      this.$router.app.$emit('openDialog', {component: 'address-info', payload: {'isNew': false, 'id': this.address.id, 'addressType': this.addressType}})
    }
  }
}
</script>
<style lang="sass" scoped>
  .short-info
    padding: 0
    +sm\-
      padding-right: 10px
  .wrapper
    align-items: center
  .address
    display: flex
    align-items: center
    padding: 0.75rem 0 0.75rem 0.75rem
    cursor: pointer
    &__text
      padding-left: .75rem
  .edit-icon-box
    display: flex
    align-items: center
    cursor: pointer
    &:hover
      color: $color-keycolor-1
</style>
