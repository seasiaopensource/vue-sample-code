<template lang="html">
  <div class="address">
    <split-grid
      :leftColSize="7"
      :rightColSize="3"
      :leftSmSize="6"
      :rightSmSize="6"
      :leftXsSize="12"
      :rightXsSize="12"
      narrowPadding
      class="wrapper__outer">
      <div class="address__container" slot="left">
        <div class="billing" v-if="isBillingAddressRequired">
          <div @mouseover="hover('billing')" @mouseout="hoverOut('billing')">
            <billing-address
              :isLoading="isLoadingFetchDefaultBillingAddress"
              showAsBox
              :heading="$t('address.billingAddress')"
              :details="selectedBillingAddress || {}"
              isEditable
              showAddButton
              @edit="openDialog({component: 'address-listing', payload: {addressType: 'billing'}})"
              @add="chooseAddress('billing')"
            />
          </div>
          <list-errors
            class="list_error"
            v-if="showBillingAddressError && !selectedBillingAddress"
            :bag="[{errorMessage: $t('address.billingAddressError')}]"/>
          <address-popup v-if="showBillingPopup && selectedBillingAddress"
                         :userAddress="selectedBillingAddress"
                         :isCompany="isCompany"
                         :heading="'address.billingAddress'" />
        </div>
        <div class="shipping" v-if="isShippingAddressRequired">
          <div @mouseover="hover('shipping')" @mouseout="hoverOut('shipping')">
            <billing-address
              :isLoading="isLoadingFetchDefaultShippingAddress"
              showAsBox
              :heading="$t('address.shippingAddress')"
              :details="selectedShippingAddress || {}"
              isEditable
              showAddButton
              @edit="openDialog({component: 'address-listing', payload: {addressType: 'shipping'}})"
              @add="chooseAddress('shipping')"
            />
          </div>
          <list-errors
            class="list_error"
            v-if="showShippingAddressError && !selectedShippingAddress"
            :bag="[{errorMessage:$t('address.shippingAddressError')}]"/>
          <address-popup v-if="showShippingPopup && selectedShippingAddress"
                         :userAddress="selectedShippingAddress"
                         :isCompany="isCompany"
                         :heading="'address.shippingAddress'" />
        </div>
      </div>
    </split-grid>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import AddressStore from '@/store/modules/dynamic/shop/address'
import registerSubmodule from '@/store/helpers/registerSubmodule'
import mapDynamicActions from '@/store/helpers/mapDynamicActions'
import mapDynamicGetters from '@/store/helpers/mapDynamicGetters'

import BillingAddress from '@/components/molecules/cart/BillingAddress'
import AddressPopup from '@/components/molecules/Address/AddressPopup'

// const CartStoreName = 'cart'
const AddressStoreName = 'address'

export default {
  props: {
    isBillingAddressRequired: {
      type: Boolean,
      default: false
    },
    isShippingAddressRequired: {
      type: Boolean,
      default: false
    },
    showBillingAddressError: {
      type: Boolean,
      default: false
    },
    showShippingAddressError: {
      type: Boolean,
      default: false
    }
  },
  components: {
    AddressPopup,
    BillingAddress
  },
  data () {
    return {
      showBillingPopup: false,
      showShippingPopup: false
    }
  },
  computed: {
    ...mapGetters('user', ['profileId', 'isCompany']),
    ...mapDynamicGetters([
      {namespace: AddressStoreName, slug: 'profileId', name: 'hasNoDefaultBillingAddress'},
      {namespace: AddressStoreName, slug: 'profileId', name: 'hasNoDefaultShippingAddress'},
      {namespace: AddressStoreName, slug: 'profileId', name: 'isLoadingFetchDefaultBillingAddress'},
      {namespace: AddressStoreName, slug: 'profileId', name: 'isLoadingFetchDefaultShippingAddress'},
      {namespace: AddressStoreName, slug: 'profileId', name: 'selectedBillingAddress'},
      {namespace: AddressStoreName, slug: 'profileId', name: 'selectedShippingAddress'},
      {namespace: AddressStoreName, slug: 'profileId', name: 'fetchAllShippingAddressesResponse'}
    ])
  },
  methods: {
    ...mapDynamicActions([
      {namespace: AddressStoreName, slug: 'profileId', name: 'fetchAllBillingAddresses'},
      {namespace: AddressStoreName, slug: 'profileId', name: 'fetchAllShippingAddresses'},
      {namespace: AddressStoreName, slug: 'profileId', name: 'fetchDefaultBillingAddress'},
      {namespace: AddressStoreName, slug: 'profileId', name: 'fetchDefaultShippingAddress'},
      {namespace: AddressStoreName, slug: 'profileId', name: 'addressLoaded'}
    ]),
    openDialog (payload) {
      this.$router.app.$emit('openDialog', payload)
    },
    hover (addressType) {
      let vm = this
      this.timer = setTimeout(function () { vm.showPopover(addressType) }, 600)
    },
    hoverOut (addressType) {
      let vm = this
      clearTimeout(vm.timer)
      this.timer = setTimeout(function () { vm.closePopover(addressType) }, 200)
    },
    showPopover (addressType) {
      if (addressType === 'billing') {
        this.showBillingPopup = true
      }

      if (addressType === 'shipping') {
        this.showShippingPopup = true
      }
    },
    closePopover (addressType) {
      if (addressType === 'billing') {
        this.showBillingPopup = false
      }

      if (addressType === 'shipping') {
        this.showShippingPopup = false
      }
    },
    registerStore () {
      const profileId = this.profileId
      registerSubmodule({module: AddressStore, namespace: AddressStoreName, slug: profileId})
      this.$store.commit(`${AddressStoreName}/${AddressStoreName}--${profileId}/updateProfileId`, profileId)
    },
    chooseAddress (addressType) {
      this.openDialog({component: 'address-listing', payload: {isNew: true, addressType}})
    },
    async fetchData () {
      this.fetchDefaultBillingAddress()
      await this.fetchDefaultShippingAddress()
      this.fetchAllBillingAddresses()
      await this.fetchAllShippingAddresses()
      this.addressLoaded()
    }
  },
  created () {
    this.registerStore()
    this.fetchData()
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  }
}
</script>
<style lang="sass" scoped>
  .address
    position: relative
    &__title
      font-size: $font-size-regular
      color: $font-heading-color
    &__container
    &__box
      cursor: pointer
      width: 100px
      height: 100px
      border: 2px solid $color-indicator-error
      border-radius: 4px
      padding: .5rem
      margin: 0
      background: $color-background-primary
      justify-content: center
      display: flex
      flex-wrap: wrap
      flex-direction: column
      align-items: center
      font-size: $font-size-smaller
      text-align: center
  .billing
    margin-bottom: 1rem
  .shipping
    margin-bottom: 1.5rem
  .list_error
    margin-top: 10px
</style>
