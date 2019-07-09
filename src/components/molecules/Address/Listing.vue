<template lang="html">
  <box class="address-listing">
    <loader fullPage v-if="isLoading" />
    <div class="header">
      <h2 class="header__title">{{ $t('address.addressBook') }}</h2>
    </div>
    <div class="content">
      <div class="sub-header">
        <div class="sub-header__text">
          {{ $t(hintForAddress) }}
        </div>
        <div class="sub-header__btn">
          <icon-text-button
          icon="plus"
          :name="$t('address.add')"
          inverted
          frontOrientation
          color="secondary"
          @click.native="openNewAddress" />
        </div>
      </div>
      <div class="listing" v-if="defaultAddress">
        <h3 class="listing__headline">{{ $t('address.defaultAddress') }}</h3>
        <ul class="listing__wrapper">
          <li class="listing__wrapper__item">
            <short-info :address="defaultAddress"
                        :addressType="addressType"
                        :selected="userAddress && userAddress.id || ''"
                        @addressSelected="changeAddress"></short-info>
          </li>
        </ul>
      </div>
      <div class="listing" v-if="allAddresses && allAddresses.length">
        <h3 class="listing__headline">{{ $t('address.additional') }}</h3>
        <ul class="listing__wrapper">
          <li class="listing__wrapper__item" v-for="(address, key) in allAddresses" :key="key">
            <short-info :address="address"
                        :addressType="addressType"
                        :selected="userAddress && userAddress.id || ''"
                        @addressSelected="changeAddress"></short-info>
          </li>
        </ul>
      </div>
      <div class="listing" v-if="emptyAddressList">
        <p>{{$t('address.emptyList')}}</p>
      </div>
    </div>
    <div class="footer">
      <text-button :disabled="emptyAddressList || !isAddressSelected"
                   :inverted="false"
                   :name="$t('address.use')"
                   color="secondary"
                   @click.native="proceed" />
    </div>
  </box>
</template>
<script>
import { mapGetters } from 'vuex'
import mapDynamicActions from '@/store/helpers/mapDynamicActions'
import mapDynamicGetters from '@/store/helpers/mapDynamicGetters'
import mapDynamicGettersMutations from '@/store/helpers/mapDynamicGettersMutations'

import ShortInfo from '@/components/molecules/Address/ShortInfo'

// const CartStoreName = 'cart'
const AddressStoreName = 'address'

export default {
  components: {
    ShortInfo
  },
  props: {
    fetch: {
      type: Boolean,
      default: true
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
    ...mapGetters('user', ['profileId']),
    ...mapDynamicGetters([
      {namespace: AddressStoreName, slug: 'profileId', name: 'isLoadingFetchAllBillingAddresses'},
      {namespace: AddressStoreName, slug: 'profileId', name: 'billingAddressList'},
      {namespace: AddressStoreName, slug: 'profileId', name: 'fetchAllBillingAddressesError'},

      {namespace: AddressStoreName, slug: 'profileId', name: 'isLoadingFetchDefaultBillingAddress'},
      {namespace: AddressStoreName, slug: 'profileId', name: 'defaultBillingAddress'},
      {namespace: AddressStoreName, slug: 'profileId', name: 'allBillingAddressList'},
      {namespace: AddressStoreName, slug: 'profileId', name: 'fetchDefaultBillingAddressError'},
      {namespace: AddressStoreName, slug: 'profileId', name: 'hasNoDefaultBillingAddress'},

      {namespace: AddressStoreName, slug: 'profileId', name: 'isLoadingFetchAllShippingAddresses'},
      {namespace: AddressStoreName, slug: 'profileId', name: 'shippingAddressList'},
      {namespace: AddressStoreName, slug: 'profileId', name: 'fetchAllShippingAddressesError'},

      {namespace: AddressStoreName, slug: 'profileId', name: 'isLoadingFetchDefaultShippingAddress'},
      {namespace: AddressStoreName, slug: 'profileId', name: 'defaultShippingAddress'},
      {namespace: AddressStoreName, slug: 'profileId', name: 'allShippingAddressList'},
      {namespace: AddressStoreName, slug: 'profileId', name: 'fetchDefaultShippingAddressError'},
      {namespace: AddressStoreName, slug: 'profileId', name: 'hasNoDefaultShippingAddress'}
    ]),
    ...mapDynamicGettersMutations([
      {namespace: AddressStoreName, slug: 'profileId', name: 'selectedBillingAddress', emitChanges: 'changesDetected'},
      {namespace: AddressStoreName, slug: 'profileId', name: 'selectedShippingAddress', emitChanges: 'changesDetected'}
    ]),
    isAddressSelected () {
      if (this.userAddress) {
        return this.userAddress
      }
    },
    emptyAddressList () {
      return !this.defaultAddress && this.allAddresses && this.allAddresses.length === 0
    },
    isBilling () {
      return this.addressType === 'billing'
    },
    isShipping () {
      return this.addressType === 'shipping'
    },
    hintForAddress () {
      if (this.isShipping) {
        return 'address.shippingAddressHint'
      }
      if (this.isBilling) {
        return 'address.billingAddressHint'
      }
    },
    isLoading () {
      if (this.isShipping) {
        return this.isLoadingFetchAllShippingAddresses || this.isLoadingFetchDefaultShippingAddress
      }

      if (this.isBilling) {
        return this.isLoadingFetchAllBillingAddresses || this.isLoadingFetchDefaultBillingAddress
      }
    },
    defaultAddress () {
      if (this.isShipping) {
        return !this.hasNoDefaultShippingAddress && this.defaultShippingAddress
      }

      if (this.isBilling) {
        return !this.hasNoDefaultBillingAddress && this.defaultBillingAddress
      }
    },
    allAddresses () {
      if (this.isShipping) {
        return this.shippingAddressList
      }

      if (this.isBilling) {
        return this.billingAddressList
      }
    }
  },
  methods: {
    ...mapDynamicActions([
      {namespace: AddressStoreName, slug: 'profileId', name: 'fetchAllBillingAddresses'},
      {namespace: AddressStoreName, slug: 'profileId', name: 'fetchAllShippingAddresses'},
      {namespace: AddressStoreName, slug: 'profileId', name: 'fetchDefaultBillingAddress'},
      {namespace: AddressStoreName, slug: 'profileId', name: 'fetchDefaultShippingAddress'},
      {namespace: AddressStoreName, slug: 'profileId', name: 'createAddressFromProfile'}
    ]),
    openNewAddress () {
      this.$emit('close')
      // If we don't have a selected address, start the process of creating an address from User Profile
      if (!this.selectedBillingAddress || !this.selectedShippingAddress) {
        this.createAddressFromProfile()
      }
      this.openDialog({component: 'address-info', payload: {'isNew': true, 'addressType': this.addressType}})
    },
    openDialog (componentInfo) {
      this.$router.app.$emit('openDialog', componentInfo)
    },
    async fetchData () {
      if (this.isShipping) {
        await this.fetchDefaultShippingAddress()
        await this.fetchAllShippingAddresses()
        if (this.allShippingAddressList.length === 1) {
          this.userAddress = this.allShippingAddressList[0]
        }
      }

      if (this.isBilling) {
        await this.fetchDefaultBillingAddress()
        await this.fetchAllBillingAddresses()
        if (this.allBillingAddressList.length === 1) {
          this.userAddress = this.allBillingAddressList[0]
        }
      }
    },
    changeAddress (payload) {
      this.userAddress = payload.address
    },
    proceed () {
      if (this.addressType === 'billing') {
        this.selectedBillingAddress = this.userAddress
      }

      if (this.addressType === 'shipping') {
        this.selectedShippingAddress = this.userAddress
      }

      this.$router.app.$emit('closeDialog')
    },
    onChangesDetected (payload) {
      this.$emit('changesDetected', payload)
    }
  },
  data () {
    return {
      userAddress: null
    }
  },
  created () {
    if (this.fetch) {
      this.fetchData()
    }

    if (this.addressType === 'billing') {
      this.userAddress = this.selectedBillingAddress
    }

    if (this.addressType === 'shipping') {
      this.userAddress = this.selectedShippingAddress
    }
  }
}
</script>
<style lang="sass" scoped>
  .address-listing
    height: 600px
    overflow: hidden
    background-color: $color-background-secondary
    box-shadow: none !important
    +xs\-
      height: 100vh
  .header
    padding: $box-padding
    height: auto
    border-bottom: 1px solid $color-border
    +make-col(12)
    +xs\-
      padding: $box-padding-xs
    &__title
      margin: 0
      +xs\-
        font-size: $font-size-larger
  .content
    height: calc( 100% - 143px )
    overflow: auto
    +custom-scrollbar
  .sub-header
    padding: .50rem 2rem
    height: auto
    border-bottom: 1px solid $color-border
    display: flex
    align-items: center
    +sm\-
      padding: $box-padding-xs
      display: inline-block
    &__text
      padding-right: .5rem
    &__btn
      width: 45%
      float: right
      text-align: right
      +sm\-
        width: 100%
        float: left
        text-align: left
        margin-top: .75rem
  .listing
    padding: $box-padding
    padding-bottom: 0
    +sm\-
      padding: $box-padding-xs
    &__wrapper
      padding: 0
      list-style: none
      align-items: center
      &__item
        // padding: .75rem
        border-radius: 4px
        border: 1px solid $color-border
        align-items: center
        margin-bottom: 1rem
  .edit
    text-align: center
    &__icon
  .address
    &__detail
      align-items: center
    &__info
      float: left
      display: flex
      align-items: center
    &__text
      float: left
      width: 95%
      padding-right: .75rem
  .footer
    text-align: center
    border-top: 1px solid $color-border
    padding: 1rem
</style>
