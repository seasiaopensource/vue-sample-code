<template lang="html">
  <box class="user-address">
    <loader fullPage v-if="isLoading" />
    <div class="header">
      <i @click="openDialog({component: 'address-listing', payload: {fetch: false, addressType}})" class="fa fa-angle-left header__icon" />
      <h2 class="header__title">
        {{ heading }}
      </h2>
    </div>
    <div class="content" ref="scrollContainer">
      <form-field
        :name= "$t('address.fullName')"
        v-model="name"
        additionalValidation="required" />
      <form-field
        :name="$t('address.companyName')"
        v-model="company" />
      <form-field
        :name="$t('address.additionalAddress')"
        v-model="additionalAddress"  />
      <split-grid :leftColSize="8" :rightColSize="4" :leftSmSize="12" :rightSmSize="12">
        <form-field
          slot="left"
          :name="$t('address.street')"
          type="text"
          v-model="street"
          additionalValidation="required" />
        <form-field
          slot="right"
          :name="$t('address.houseNumber')"
          type="text"
          v-model="house" />
      </split-grid>
      <split-grid :leftColSize="4" :rightColSize="8" :leftSmSize="12" :rightSmSize="12">
        <form-field
          slot="left"
          :name="$t('address.zip')"
          type="text"
          v-model="zipCode"
          additionalValidation="required" />
        <form-field
          slot="right"
          :name="$t('address.city')"
          type="text"
          v-model="city"
          additionalValidation="required" />
      </split-grid>
      <split-grid :leftColSize="6" :rightColSize="6" :leftSmSize="12" :rightSmSize="12" class="content__align-center">
        <form-field
          slot="left"
          :name="$t('address.country')"
          v-model="country"
          :options="countries"
          type="select"
          additionalValidation="required" />
        <div slot="right" class="default-wrapper">
          <portal-input inputType="checkbox" v-model="isDefault" :disabled="isDefaultAddressDisabled" />
          <span @click="toggleDefaultIfActive()" class="content__default" :class="{'content__disabled': isDefaultAddressDisabled}">{{ $t('address.setAsDefault') }}</span>
        </div>
      </split-grid>
      <portal-modal
        v-if="isModalVisible"
        isDialog
        :showButton="false"
        name="ConfirmDeleteAddress"
        :buttonLabelYes="$t('button.yesText')"
        :buttonLabelNo="$t('button.noText')"
        @closeModal="isModalVisible = false"
        @yesClick="proceedDelete"
        @noClick="isModalVisible = false">
        <p slot="modalContent">{{ $t('address.confirmDelete') }}</p>
      </portal-modal>
    </div>
    <div class="footer">
      <icon-text-button icon="save" :name="$t('button.save')" color="secondary" @click.native="onSave" frontOrientation />
      <i v-if="!isNew && !isCurrentDefaultAddress" class="fa fa-ellipsis-v footer__dots" @click="toggleContextMenu()" />
      <div v-show="showContextMenu && !isNew" class="context-menu">
        <ul class="context-menu__list">
          <li class="context-menu_list-1" v-if="!isNew && !isCurrentDefaultAddress">
            <aa class="link" @click.native="isModalVisible = true">{{$t('address.deleteAddress')}}</aa>
          </li>
        </ul>
      </div>
    </div>
  </box>
</template>
<script>
import _ from 'lodash'
import portalConfig from '@/config'
import { mapGetters, mapActions } from 'vuex'
import mapDynamicActions from '@/store/helpers/mapDynamicActions'
import mapDynamicGetters from '@/store/helpers/mapDynamicGetters'
import mapDynamicGettersMutations from '@/store/helpers/mapDynamicGettersMutations'
import { scrollToFirstError } from '@/etc/validationHelpers'

const AddressStoreName = 'address'

export default {
  props: {
    id: {
      type: String
    },
    isNew: {
      type: Boolean,
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
  data () {
    return {
      showContextMenu: false,
      isModalVisible: false,
      heading: ''
    }
  },
  computed: {
    ...mapGetters('user', ['profileId']),
    ...mapDynamicGetters([
      {namespace: AddressStoreName, slug: 'profileId', name: 'isLoadingCreateAddress'},
      {namespace: AddressStoreName, slug: 'profileId', name: 'isLoadingUpdateAddress'},
      {namespace: AddressStoreName, slug: 'profileId', name: 'isLoadingDeleteAddress'},
      {namespace: AddressStoreName, slug: 'profileId', name: 'isLoadingFetchAddressById'},
      {namespace: AddressStoreName, slug: 'profileId', name: 'fetchAddressByIdResponse'},
      {namespace: AddressStoreName, slug: 'profileId', name: 'errorBag'},

      {namespace: AddressStoreName, slug: 'profileId', name: 'allBillingAddressList'},
      {namespace: AddressStoreName, slug: 'profileId', name: 'allShippingAddressList'},

      {namespace: AddressStoreName, slug: 'profileId', name: 'selectedBillingAddress'},
      {namespace: AddressStoreName, slug: 'profileId', name: 'selectedShippingAddress'}
    ]),
    ...mapDynamicGettersMutations([
      {namespace: AddressStoreName, slug: 'profileId', name: 'name', emitChanges: 'changesDetected'},
      {namespace: AddressStoreName, slug: 'profileId', name: 'company', emitChanges: 'changesDetected'},
      {namespace: AddressStoreName, slug: 'profileId', name: 'street', emitChanges: 'changesDetected'},
      {namespace: AddressStoreName, slug: 'profileId', name: 'house', emitChanges: 'changesDetected'},
      {namespace: AddressStoreName, slug: 'profileId', name: 'additionalAddress', emitChanges: 'changesDetected'},
      {namespace: AddressStoreName, slug: 'profileId', name: 'city', emitChanges: 'changesDetected'},
      {namespace: AddressStoreName, slug: 'profileId', name: 'zipCode', emitChanges: 'changesDetected'},
      {namespace: AddressStoreName, slug: 'profileId', name: 'country', emitChanges: 'changesDetected'},
      {namespace: AddressStoreName, slug: 'profileId', name: 'isDefault', emitChanges: 'changesDetected'}
    ]),
    isDefaultAddressDisabled () {
      return this.isFirstAddress || this.isCurrentDefaultAddress
    },
    countries () {
      const countries = []
      portalConfig.commonData.countries.forEach((country) => {
        countries.push({name: this.$t('countries.' + country.code), value: country.value})
      })
      return [
        {name: this.$t('formLabels.select'), value: ''},
        ..._.sortBy(countries, ['name'])
      ]
    },
    isLoading () {
      return this.isLoadingFetchAddressById || this.isLoadingCreateAddress || this.isLoadingUpdateAddress || this.isLoadingDeleteAddress
    },
    isFirstAddress () {
      if (this.addressType === 'billing') {
        return this.isNew && this.allBillingAddressList && this.allBillingAddressList.length === 0
      }

      if (this.addressType === 'shipping') {
        return this.isNew && this.allShippingAddressList && this.allShippingAddressList.length === 0
      }
    },
    isCurrentDefaultAddress () {
      if (this.addressType === 'billing') {
        return this.fetchAddressByIdResponse && this.fetchAddressByIdResponse.isDefaultBillingAddress
      }

      if (this.addressType === 'shipping') {
        return this.fetchAddressByIdResponse && this.fetchAddressByIdResponse.isDefaultShippingAddress
      }
    }
  },
  methods: {
    ...mapActions('operationNotification', ['create']),
    ...mapDynamicActions([
      {namespace: AddressStoreName, slug: 'profileId', name: 'createAddress'},
      {namespace: AddressStoreName, slug: 'profileId', name: 'updateAddress'},
      {namespace: AddressStoreName, slug: 'profileId', name: 'deleteAddress'},
      {namespace: AddressStoreName, slug: 'profileId', name: 'fetchAddressById'},
      {namespace: AddressStoreName, slug: 'profileId', name: 'resetAddress'}
    ]),
    toggleDefaultIfActive () {
      if (!this.isDefaultAddressDisabled) {
        this.toggleDefault()
      }
    },
    toggleContextMenu () {
      this.showContextMenu = !this.showContextMenu
    },
    toggleDefault () {
      this.isDefault = !this.isDefault
    },
    async onSave () {
      let isValid = await this.$validator.validateAll()
      if (!isValid) {
        let container = this.$refs.scrollContainer
        scrollToFirstError({validator: this.$validator, options: {container}})
        return
      }
      const address = this.fetchAddressObj()
      if (this.isNew) {
        await this.createAddress({address})
      } else {
        await this.updateAddress({address, id: this.id})
      }
      if (this.errorBag.length) {
        return
      }
      this.resetAddress()
      this.openListing()
    },
    fetchAddressObj () {
      return {
        'isBillingAddress': this.addressType === 'billing',
        'isShippingAddress': this.addressType === 'shipping',
        'isDefaultBillingAddress': (this.isDefault || this.allBillingAddressList.length === 0) && this.addressType === 'billing',
        'isDefaultShippingAddress': (this.isDefault || this.allShippingAddressList.length === 0) && this.addressType === 'shipping',
        'name': this.name,
        'company': this.company,
        'street': this.street,
        'house': this.house,
        'additionalAddress': this.additionalAddress,
        'city': this.city,
        'zipCode': this.zipCode,
        'country': this.country
      }
    },
    openListing () {
      this.openDialog({component: 'address-listing', payload: {fetch: true, addressType: this.addressType}})
    },
    openDialog (payload) {
      this.closeDialog()
      this.$router.app.$emit('openDialog', payload)
    },
    closeDialog () {
      this.$router.app.$emit('closeDialog')
    },
    async proceedDelete () {
      await this.deleteAddress({id: this.id})
      if (this.errorBag.length) {
        this.create({
          title: this.$t('address.deleteErrorTitle'),
          type: 'ERROR',
          message: this.$t('address.deleteErrorMessage')
        })
      } else {
        this.create({
          title: this.$t('address.deleteSuccessTitle'),
          type: 'SUCCESS',
          message: this.$t('address.deleteSuccessMessage')
        })
        this.isModalVisible = false
        this.closeDialog()
        this.openListing()
      }
    },
    async fetchAndSetHeading () {
      if (!this.isNew) {
        await this.fetchAddressById({id: this.id, addressType: this.addressType})
        if (this.fetchAddressByIdResponse) {
          this.heading = `${this.fetchAddressByIdResponse.name} - ${this.fetchAddressByIdResponse.zipCode}`
        }
      } else {
        this.heading = this.$t('address.addNew')
      }
    }
  },
  created () {
    this.fetchAndSetHeading()
  },
  destroyed () {
    this.resetAddress()
  },
  $_veeValidate: {
    validator: 'new'
  },
  beforeDestroy () {
    this.$validator.destroy()
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

  .user-address
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
    display: flex
    align-items: center
    +make-col(12)
    +xs\-
      padding: $box-padding-xs
    &__icon
      font-size: $font-size-extra-large
      padding-right: .75rem
      width: 25px
      cursor: pointer
    &__title
      margin: 0
      padding-right: 1.75rem
      @include singleLineEllipsis
      +xs\-
        font-size: $font-size-larger
  .content
    padding: $box-padding
    height: calc( 100% - 152px )
    overflow: auto
    +custom-scrollbar
    &__align-center
      align-items: center
    &__link
      color: $color-keycolor-1
      margin-top: 15px
      float: left
    &__default
      cursor: pointer
      color: $color-keycolor-1
    &__disabled
      cursor: not-allowed
  .default-wrapper
    display: flex
    align-items: center
    margin-top: 15px
  .footer
    align-items: center
    display: flex
    border-top: 1px solid $color-border
    padding: $box-padding
    justify-content: center
    background: $color-background-secondary
    &__dots
      cursor: pointer
      position: absolute
      right: 25px
      padding: .50rem
  .context-menu
    position: absolute
    right: 50px
    bottom: 10px
    width: 175px
    background: #fff
    margin: 0
    padding: 15px
    box-shadow: $box-shadow
    &__list
     font-size: $font-size-sm
     list-style: none
     padding: 0px
     word-break: break-all
     hyphens: manual
     margin-bottom: 0
  .link
    color: $font-regular-color
    &:hover
      text-decoration: none
      color: $color-keycolor-1
</style>
