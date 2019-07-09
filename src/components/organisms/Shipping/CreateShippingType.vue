<template lang="html">
  <box>
    <div class="shipping__header">
      <h2 class="shipping__title"> {{$t('shopmanager.shipping.addShippingOption')}}</h2>
    </div>
    <div class="shipping__content" ref="scrollContainer">
      <form-field
        slot="left"
        :name="$t('shopmanager.shipping.shippingOptionName')"
        type="text"
        v-model="shippingName"
        additionalValidation="required"
      />
      <split-grid>
        <div slot="left">
          <div class="split-grid-form">
            <div class="shipping-input">
              <form-field
                :name="$t('shopmanager.shipping.price')"
                :noBorderRadius="'right'"
                v-model= "shippingPrice"
                :additionalValidation="{required: true, decimal: [2, $t('article.decimalSeparator')]}"
              />
            </div>
            <div class="shipping-currency">
              <form-field
                :noBorderRadius="'left'"
                type="select"
                name=""
                :options="currencyInfo"
                v-model="shippingCurrency"
              />
            </div>
          </div>
        </div>
        <div slot="right" class="shipping-switch">
          <portal-switch-input :size="'small'" v-model="shippingIsActive"/>
          {{$t('shopmanager.shipping.active')}}
        </div>
      </split-grid>
    </div>
    <div class="shipping__footer">
      <text-button slot="headline" class="save-btn" :name="$t('shopmanager.shipping.add')"  @click="onSubmit" color="secondary" />
    </div>
  </box>
</template>
<script>
import { mapGetters } from 'vuex'
import { Article } from '@/etc/userClaims'
import mapGettersMutations from '@/store/helpers/mapGettersMutations'
import { scrollToFirstError } from '@/etc/validationHelpers'
export default {
  computed: {
    ...mapGetters('shopSettings', ['hasCustomShipping', 'customShippingConfig']),
    ...mapGettersMutations([
      { name: 'shipmentTypes', namespace: 'shopSettings', emitChanges: 'changesDetected' },
      { name: 'shippingName', namespace: 'shopSettings', emitChanges: 'changesDetected' },
      { name: 'shippingPrice', namespace: 'shopSettings', emitChanges: 'changesDetected' },
      { name: 'shippingCurrency', namespace: 'shopSettings', emitChanges: 'changesDetected' },
      { name: 'shippingIsActive', namespace: 'shopSettings', emitChanges: 'changesDetected' },
      { name: 'providerId', namespace: 'shopSettings', emitChanges: 'changesDetected' }
    ]),
    article: () => Article,
    currencyInfo () {
      return this.article.currencyInfo
    }
  },
  created () {
    if (this.shippingPrice && this.$i18n.locale === 'en' && this.shippingPrice.indexOf('.')) {
      this.shippingPrice = this.shippingPrice.replace(',', '.')
    }
    if (this.shippingPrice && this.$i18n.locale === 'de' && this.shippingPrice.indexOf(',')) {
      this.shippingPrice = this.shippingPrice.replace('.', ',')
    }
  },
  methods: {
    async onSubmit () {
      let isValid = await this.$validator.validateAll()
      if (!isValid) {
        let container = this.$refs.scrollContainer
        scrollToFirstError({validator: this.$validator, options: {container}})
        return
      }
      await this.$store.dispatch('shopSettings/updateCustomShipment', this.customShippingConfig)
      this.resetShippingAttributes()
      this.$router.app.$emit('closeDialog')
    },
    resetShippingAttributes () {
      this.shippingName = ''
      this.shippingPrice = ''
      this.shippingCurrency = '1'
    }
  },
  $_veeValidate: {
    validator: 'new'
  },
  beforeDestroy () {
    this.$validator.destroy()
  },
  destroyed () {
    this.resetShippingAttributes()
  }
}
</script>
<style lang="sass" scoped>
  .shipping
    height: 600px
    overflow: hidden
    background-color: $color-background-secondary
    box-shadow: none !important
    +xs\-
      height: 100vh
    &__header
      padding: $box-padding
      height: auto
      border-bottom: 1px solid $color-border
      +make-col(12)
    &__footer
      align-items: center
      display: flex
      border-top: 1px solid $color-border
      padding: $box-padding
      justify-content: flex-end
      background: $color-background-secondary
      &__title
        margin-bottom: 0
      +xs\-
        padding: $box-padding-xs
    &__content
      height: calc( 100% - 224px )
      padding: 1.3rem 2rem
      overflow: auto
  .shipping-input
    width: 60%
    float: left
  .shipping-currency
    width: 40%
    float: left
    margin-top: 1.5rem
    .form-select
      border-radius: 0px 8px 8px 0px !important
      border: 1px solid #E1E1E1 !important
  .shipping-switch
    margin-top: 25px
  .save-btn
    float: right
</style>
