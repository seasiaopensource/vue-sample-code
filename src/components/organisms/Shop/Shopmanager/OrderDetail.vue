<template lang="html">
  <box class="order-detail">
    <div class="order-detail__header">
      <aa :href="{name: 'ordersOverviewPage'}" title="" class="order-detail-backto">
        <i class="fa fa-angle-left" aria-hidden="true"/> {{ $t('order.editOrders.backToOrders') }}
      </aa>
      <icon-text-button icon="save" @click.native="updateOrder" :name="$t('button.save')" frontOrientation color="secondary" />
    </div>
    <!-- <operation-notification @fadeOut="isUpdated = false" v-if="isUpdated"
    :message="{type: 'success', text: $t('settings.config.success')}"></operation-notification> -->
    <loader v-if="isLoadingFetchOrder || isLoadingUpdateOrderStatus || isLoadingGenerateInvoice" fullPage />
    <div class="order-detail__box">
      <h3 class="order-detail__orderid">{{ $t('order.editOrders.orderNo') }} {{viewOrderId}}</h3>
      <split-grid :leftColSize="6" :rightColSize="6" :leftSmSize="12" :rightSmSize="12">
        <form-field slot="left" :name="$t('order.editOrders.orderNumber')" :value="viewOrderId" :disabled="true" />
        <form-field slot="right" :name="$t('order.editOrders.purchaseDate')" :value="formatDate(orderDetails.created)" :disabled="true" />
      </split-grid>
    </div>
    <div class="order-detail__box">
      <split-grid :leftColSize="6" :rightColSize="6" :leftSmSize="12" :rightSmSize="12">
        <h3 slot="left">{{ $t('order.editOrders.customerProfile') }}</h3>
        <user-bar
          slot="left"
          v-if="profileDetails && categoryId"
          :name="profileDetails.displayName"
          :imageName="profileDetails.profilePictureName"
          :categoryId="categoryId"
          size="medium"
          fontWeightUpper="bold"
          fontWeightBottom="regular"
          fontSizeUpper="small"
          fontSizeBottom="small"
          :isOnline="false"
          :auxText="$t(currentProfileType)"
          :truncateName='true'
          @click="redirecToProfile"
        />
        <h4 slot="left" v-if="profileDetails.length === 0" class="heading">{{$t('order.editOrders.orderDeleted')}}</h4>
        <span slot="left" class="customer-no">{{$t('order.editOrders.customerNumber')}}: {{viewCustomerId}}</span>
        <div class="order-detail__content-wrapper" slot="right">
          <billing-address slot="left" v-if="billingAddress" :heading="$t('order.editOrders.billingAddress')" :details="billingAddress" />
          <billing-address slot="right" v-if="shippingAddress" :heading="$t('order.editOrders.shippingAddress')" :details="shippingAddress" />
        </div>
      </split-grid>
    </div>
    <div class="order-detail__box">
      <h3>{{ $t('shopmanager.ordersOverview.columnLabel.status') }}</h3>
      <div class="order-detail__content-wrapper">
        <order-status v-for="order in orderStatusList" :key="order.icon" :iconName="order.icon" :text="$t(order.name)" :isActive="orderStatus === order.statusId" @click.native="orderStatus = order.statusId" />
      </div>
      <split-grid :leftColSize="6" :rightColSize="6" :leftSmSize="12" :rightSmSize="12">
        <form-field slot="left" :name="$t('order.editOrders.notes')" :placeholder="$t('order.editOrders.notes')" type="textarea" v-model="notes" />
      </split-grid>
    </div>
    <div class="shipping-details order-detail__box">
      <split-grid :leftColSize="6" :rightColSize="6" :leftSmSize="12" :rightSmSize="12" >
        <h3 slot="left">{{$t('order.editOrders.shippingType')}}</h3>
        <fancy-radio slot="left" v-for="(shippingObj, key) in shippingTypes" name="shippingMethod" :key="key" :label="getShippingTypeLabel(shippingObj)" :selectedValue="selectedShipping.name" :value="shippingObj.shippingTypeName" disabled />
        <h3 slot="right">{{$t('order.editOrders.shippingCost')}}</h3>
        <form-field slot="right" class="shipping-input" :name="$t('shopmanager.addEditProduct.priceEuro')" noLabel :noBorderRadius="'right'" :value="formatPrice(shippingCost)" disabled />
        <form-field slot="right" class="shipping-currency" disabled :noBorderRadius="'left'" type="select" noLabel name="currency" :options="currency" :value="getSelectedShippingCurrency" />
      </split-grid>
    </div>
    <div class="order-detail__box">
      <h3>{{ $t('order.editOrders.paymentInfo') }}</h3>
      <div class="order-detail__content-wrapper">
        <order-status iconName="paypal" :text="$t('order.editOrders.paypal')" :isActive="isPaypal" disabled />
        <order-status iconName="money" :text="$t('order.editOrders.cash')" :isActive="isCash" disabled />
      </div>
    </div>
    <div class="order-detail__box">
      <h3>{{ $t('order.editOrders.paymentStatus') }}</h3>
      <div class="order-detail__content-wrapper">
        <order-status v-for="(payment, key) in paymentStatus" :key="key" :iconName="payment.icon" :text="$t(payment.name)" :disabled="currentPaymentState === 2" :isActive="payment.state.indexOf(orderPaymentState) >= 0" @click.native="changeOrderStatus(payment)" />
      </div>
    </div>
    <div class="table-title no-border">
      <h3 class="table-title__heading">{{ $t('order.editOrders.shoppingCart') }}</h3>
    </div>
    <div v-if="orderDetails && items && !(bootstrapMode === 'md' || bootstrapMode === 'lg' || bootstrapMode === 'sm' || bootstrapMode === 'xs')">
      <table-component :data="items" tableClass="fixed-class" tbodyClass="border-none" :showHeader="false" :filterNoResults="$t('cartSummary.noItems')">
        <table-column cellClass="no-border" headerClass="no-table-border img-hw" :sortable="false" :filterable="false" label="">
          <template slot-scope="row">
            <i class="fa fa-tags fa-2x" aria-hidden="true" v-if="row.article && row.article.photos && row.article.photos.length === 0"/>
            <api-img v-else :imageName="row.article.photos[0]['name']" :width="38" />
          </template>
        </table-column>
        <table-column cellClass="no-border ellipse-limit gtin-width" :sortable="false" show="article.gtin" title="'article.gtin'" :label="$t('order.editOrders.gtin')" headerClass="text-left no-table-border" />
        <table-column :sortable="false" cellClass="no-border ellipse-limit article-width" headerClass="article-no no-table-border articleNumber-hw" show="article.articleNumber" :label="$t('order.editOrders.articleNumber')" />
        <table-column cellClass="no-border ellipse-limit" headerClass="name-width no-table-border name-hw" :sortable="false" show="article.name" :label="$t('order.editOrders.name')" />
        <table-column cellClass="no-border" :sortable="false" :filterable="false" headerClass="no-table-border quantity-hw" :label="$t('order.editOrders.quantity')">
          <template slot-scope="row">
            <quantity :amount="row.amount" :disabled="true"/>
          </template>
        </table-column>
        <table-column cellClass="no-border align-article" headerClass="unit-price no-table-border text-right" :sortable="false" show="article.price.price" :formatter="formatTotal" :label="$t('order.editOrders.unitPrice')" />
        <table-column cellClass="no-border" headerClass="total-price no-table-border" :sortable="false" show="article.grossPrice" :formatter="formatTotal" :label="$t('order.editOrders.totalPrice')" />
      </table-component>
    </div>
    <div class="mobile-table" v-else>
      <Order-table-mobile v-for="(item, index) in items" :key="index" :tableData="item" />
    </div>
    <div class="order-detail__box">
      <split-grid :leftColSize="4" :rightColSize="8" :leftSmSize="12" :rightSmSize="12">
        <div slot="left" class="invoice-pdf">
          <div v-if="invoice" @click="downloadFile">
            <i class="fa fa-fil  e-pdf-o invoice-pdf-icon" aria-hidden="true"/>
            <span><b>{{ $t('order.editOrders.invoice') }}</b></span>
          </div>
          <div v-else-if="isCash" @click="generateOrderInvoice">
            <span><b>{{ $t('order.editOrders.createInvoice') }}</b></span>
          </div>
        </div>
        <h4 slot="right" class="text-right cart-heading">{{$t('checkoutSummary.subtotal')}} ({{ ($t('order.editOrders.items', {x: numberOfItems})) }}):</h4>
        <p slot="right" class="text-right cart-amount">{{fetchFractionalPrice(orderDetails.sumGrossPrice)}}{{ $t('article.decimalSeparator')}}{{fetchDecimalPrice(orderDetails.sumGrossPrice)}}
         {{ currencyList[1] }}</p>
        <h4 slot="right" class="text-right cart-heading">{{$t('order.editOrders.shipping')}}</h4>
        <p slot="right" class="text-right cart-amount" >{{cShippingCost}} {{ currencyList[1] }}</p>
        <div v-for="(order, index) in sortedItems" :key="index">
          <h4 slot="right" class="text-right cart-heading">{{ $t('checkoutSummary.inclusiveSub', {percentage: order.name}) }}:</h4>
          <p slot="right" class="text-right cart-amount">{{fetchFractionalPrice(order.total)}}{{ $t('article.decimalSeparator') }}{{fetchDecimalPrice(order.total)}} {{ currencyList[1] }}</p>
        </div>
        <h4 slot="right" class="text-right cart-heading">{{$t('checkoutSummary.total')}}:</h4>
        <p slot="right" class="text-right cart-amount">{{fetchFractionalPrice(orderDetails.totalPrice)}}{{ $t('article.decimalSeparator') }}{{fetchDecimalPrice(orderDetails.totalPrice)}} {{ currencyList[1] }}</p>
      </split-grid>
    </div>
    <div class="order-detail__box order-detail__box--button">
      <icon-text-button icon="save" @click.native="updateOrder" :name="$t('button.save')" frontOrientation color="secondary" />
      <!--<icon-text-button icon="trash" :name="$t('button.remove')" frontOrientation inverted color="secondary" />-->
    </div>
  </box>
</template>
<script>
import path from 'path'
import buildUrl from 'build-url'
import portalConfig from '@/config'
import mapDynamicGetters from '@/store/helpers/mapDynamicGetters'
import mapDynamicActions from '@/store/helpers/mapDynamicActions'
import mapDynamicGettersMutations from '@/store/helpers/mapDynamicGettersMutations'
import registerSubmodule from '@/store/helpers/registerSubmodule'
import OrderStatus from '@/components/molecules/cart/orderStatus'
import BillingAddress from '@/components/molecules/cart/BillingAddress'
import OrderTableMobile from '@/components/organisms/Shop/Shopmanager/OrderTableMobile'
import Quantity from '@/components/molecules/Shop/Quantity'
import _ from 'lodash'
import { mapGetters } from 'vuex'
import OrdersDetailStore from '@/store/modules/dynamic/shop/orders/details'
import {orderStatus, Article, getCategoryFromGlobalId, CompanyProfileCategoryId, PersonPersonalProfileCategoryId, PersonBusinessProfileCategoryId, paymentModes, zeroPrice} from '@/etc/userClaims'
import { operationNotificationTypes } from '@/store/modules/global/operationNotification'
import moment from 'moment'

const storeName = 'orders/details'

export default {
  data () {
    return {
      quantity: null,
      currencyList: null,
      moment: moment,
      currency: [
        {
          name: 'EUR',
          value: '1'
        }
      ],
      paymentStatus: [
        {
          icon: 'times',
          name: 'order.editOrders.paymentPending',
          state: [1, 3, 4],
          value: 1
        },
        {
          icon: 'check',
          name: 'order.editOrders.paymentCompleted',
          state: [2],
          value: 2
        }
      ],
      orderStatusList: [
        {
          icon: 'file-text-o',
          name: 'order.editOrders.newOrder',
          statusId: orderStatus.NEW
        },
        {
          icon: 'ellipsis-h',
          name: 'order.editOrders.inProgress',
          statusId: orderStatus.IN_PROGRESS
        },
        {
          icon: 'truck',
          name: 'order.editOrders.shipped',
          statusId: orderStatus.SHIPPED
        },
        {
          icon: 'check-circle',
          name: 'order.editOrders.completed',
          statusId: orderStatus.COMPLETED
        }
      ],
      paymentModes: paymentModes
    }
  },
  watch: {
    '$route': 'registerAndFetch'
  },
  components: {
    OrderStatus,
    BillingAddress,
    Quantity,
    OrderTableMobile
  },
  props: {
    orderId: {
      required: true,
      type: String
    }
  },
  computed: {
    ...mapGetters('browser', ['bootstrapMode']),
    ...mapDynamicGetters([
      {namespace: storeName, slug: 'orderIdFromRoute', name: 'currentPaymentState'},
      {namespace: storeName, slug: 'orderIdFromRoute', name: 'isLoadingFetchOrder'},
      {namespace: storeName, slug: 'orderIdFromRoute', name: 'isLoadingUpdateOrderStatus'},
      {namespace: storeName, slug: 'orderIdFromRoute', name: 'isLoadingGenerateInvoice'},
      {namespace: storeName, slug: 'orderIdFromRoute', name: 'viewOrderId'},
      {namespace: storeName, slug: 'orderIdFromRoute', name: 'viewCustomerId'},
      {namespace: storeName, slug: 'orderIdFromRoute', name: 'orderDetails'},
      {namespace: storeName, slug: 'orderIdFromRoute', name: 'profileDetails'},
      {namespace: storeName, slug: 'orderIdFromRoute', name: 'fetchOrderError'},
      {namespace: storeName, slug: 'orderIdFromRoute', name: 'numberOfItems'},
      {namespace: storeName, slug: 'orderIdFromRoute', name: 'items'},
      {namespace: storeName, slug: 'orderIdFromRoute', name: 'address'},
      {namespace: storeName, slug: 'orderIdFromRoute', name: 'billingAddress'},
      {namespace: storeName, slug: 'orderIdFromRoute', name: 'shippingAddress'},
      {namespace: storeName, slug: 'orderIdFromRoute', name: 'paymentInfo'},
      {namespace: storeName, slug: 'orderIdFromRoute', name: 'shipmentInfo'},
      {namespace: storeName, slug: 'orderIdFromRoute', name: 'shippingCost'},
      {namespace: storeName, slug: 'orderIdFromRoute', name: 'shippingTypes'},
      {namespace: storeName, slug: 'orderIdFromRoute', name: 'invoice'},
      {namespace: storeName, slug: 'orderIdFromRoute', name: 'vat'}
    ]),
    ...mapDynamicGettersMutations([
      {namespace: storeName, slug: 'orderIdFromRoute', name: 'notes'},
      {namespace: storeName, slug: 'orderIdFromRoute', name: 'orderPaymentState'},
      {namespace: storeName, slug: 'orderIdFromRoute', name: 'orderStatus'},
      {namespace: storeName, slug: 'orderIdFromRoute', name: 'isUpdated'}
    ]),
    sortedItems () {
      return _.orderBy(this.vat, ['type'], ['asc'])
    },
    currentProfileType () {
      if (this.profileDetails && this.profileDetails.profileType) {
        var profileType = ''
        if (parseInt(getCategoryFromGlobalId(this.profileDetails.profileId)) === CompanyProfileCategoryId) { profileType = 'profile_information.profileType.company' }
        if (parseInt(getCategoryFromGlobalId(this.profileDetails.profileId)) === PersonPersonalProfileCategoryId) { profileType = 'profile_information.profileType.private' }
        if (parseInt(getCategoryFromGlobalId(this.profileDetails.profileId)) === PersonBusinessProfileCategoryId) { profileType = 'profile_information.profileType.business' }
        return profileType
      }
    },
    orderIdFromRoute () {
      return this.orderId
    },
    categoryId () {
      return getCategoryFromGlobalId(this.profileDetails.profileId)
    },
    isCash () {
      if (this.paymentInfo && this.paymentInfo.paymentType) {
        return this.paymentModes.cash === this.paymentInfo.paymentType
      }
    },
    isPaypal () {
      if (this.paymentInfo && this.paymentInfo.paymentType) {
        return this.paymentModes.paypal === this.paymentInfo.paymentType
      }
    },
    selectedShipping () {
      if (this.shipmentInfo && this.shipmentInfo.supportedTypes) {
        return this.shipmentInfo.supportedTypes
      }
    },
    getSelectedShippingCurrency () {
      if (this.selectedShipping && this.selectedShipping.price && this.selectedShipping.price.currency) {
        return this.selectedShipping.price.currency.symbol || this.selectedShipping.price.currency.name
      }
    },
    cShippingCost () {
      if (this.shippingCost) {
        return this.fetchFractionalPrice(this.shippingCost) + this.$t('article.decimalSeparator') + this.fetchDecimalPrice(this.shippingCost)
      }
    }
  },
  created () {
    this.currencyList = Article.currency
    this.registerAndFetch()
  },
  $_veeValidate: {
    validator: 'new'
  },
  methods: {
    ...mapDynamicActions([
      {namespace: storeName, slug: 'orderIdFromRoute', name: 'fetchOrder'},
      {namespace: storeName, slug: 'orderIdFromRoute', name: 'updateOrderStatus'},
      {namespace: storeName, slug: 'orderIdFromRoute', name: 'generateInvoice'}
    ]),
    changeOrderStatus (payment) {
      if (this.currentPaymentState && this.currentPaymentState !== 2) {
        this.orderPaymentState = payment.value
      }
    },
    getShippingTypeLabel (shippingObject) {
      if (shippingObject && shippingObject.providerSource !== 'Custom') {
        return this.$t('order.editOrders.shippingTypes.' + shippingObject.shippingTypeName)
      } else {
        return shippingObject.shippingTypeName
      }
    },
    formatDate (date) {
      return this.moment(date).format('DD.MM.YYYY')
    },
    formatTotal (amount) {
      return this.formatPrice(amount) + ' ' + Article.currency[1]
    },
    formatPrice (amount) {
      return this.fetchFractionalPrice(amount) + this.$t('article.decimalSeparator') + this.fetchDecimalPrice(amount)
    },
    redirecToProfile () {
      return this.$router.push({ name: 'profileOverview', params: {profileId: this.profileDetails.profileId} })
    },
    fetchFractionalPrice (price) {
      price = price && price.toString().replace(',', '.') || zeroPrice
      return parseFloat(price).toFixed(2).split('.')[0]
    },
    fetchDecimalPrice (price) {
      price = price && price.toString().replace(',', '.') || zeroPrice
      return parseFloat(price).toFixed(2).split('.')[1]
    },
    registerStore () {
      const orderId = this.orderIdFromRoute
      registerSubmodule({module: OrdersDetailStore, namespace: storeName, slug: orderId})
      this.$store.commit(`${storeName}/${storeName}--${orderId}/updateOrderId`, orderId)
    },
    registerAndFetch () {
      this.registerStore()
      this.fetchOrder()
    },
    async updateOrder () {
      var isValid = await this.$validator.validateAll()
      if (isValid) {
        this.updateOrderStatus()
        this.isUpdated = true
        this.$store.dispatch('operationNotification/create', {
          title: this.$t('settings.config.success'),
          type: operationNotificationTypes.success
        })
      }
    },
    downloadFile () {
      // Check for invoice and download
      if (this.invoice) {
        var url = buildUrl(portalConfig.api.imgServer, {
          path: path.join(portalConfig.api.filePath, this.invoice),
          queryParams: {}
        })
        window.open(url, '_blank')
      }
    },
    async generateOrderInvoice () {
      await this.generateInvoice()
      this.$store.dispatch('operationNotification/create', {
        title: this.$t('order.invoiceGeneratedMessage'),
        type: operationNotificationTypes.success
      })
    }
  },
  beforeDestroy () {
    this.$validator.destroy()
  }
}
</script>
<style lang="sass" scoped>
  @mixin singleLineEllipsis($lineHeight: 1.2em, $lineCount: 1, $bgColor: white)
    overflow: hidden
    position: relative
    line-height: $lineHeight
    max-height: $lineHeight * $lineCount
    text-align: justify
    overflow: hidden
    text-overflow: ellipsis
    white-space: nowrap

  .details
    padding: $box-padding

  .order-detail
    &__content-wrapper
      display: flex
      flex-wrap: wrap
    &__orderid
      +sm\-
        @include singleLineEllipsis
    &__header
      display: flex
      flex-wrap: wrap
      justify-content: space-between
      padding: $box-padding
      border-bottom: 1px solid $color-border
      +xs\-
        padding: $box-padding-xs

    &-not-exists
      padding: $box-padding
      +xs\-
        padding: $box-padding-xs

    &-backto
      line-height: 32px
      font-size: $font-size-regular
      font-weight: $font-weight-bold
      color: $font-regular-color
      +ease(.3s)
      i
        padding: 0 4px 0 0
      &:hover
        text-decoration: none
        color: $color-keycolor-2
      +xs\-
        margin-bottom: 1rem
    &__box
      padding: $box-padding
      border-bottom: 1px solid $color-border
      +xs\-
        padding: $box-padding-xs

    &--button
      display: flex
      justify-content: flex-end
      border-bottom: 0
  .table-title
    padding: $box-padding
    +xs\-
      padding: $box-padding-xs
      margin-bottom: 0
  .no-border
    border: 0px
  span.customer-no
      margin-top: 10px
      float: left
      font-size: $font-size-small
  .shipping-type
    list-style: none
    position: relative
    padding-left: 1.5rem
    &_item
      position: relative
  .shipping-input
    width: 35%
    float: left
    +sm\-
      width: 60%
  .shipping-currency
    min-width: 75px
    float: left
    +sm\-
      width: 35%
    .form-select
      border-radius: 0px 8px 8px 0px !important
      border: 1px solid #E1E1E1 !important
  .text-right
    text-align: right
  .invoice-pdf:hover
      color: $color-keycolor-1
      cursor: pointer
  .invoice-pdf-icon
     font-size: $font-size-large
     margin-right: .5rem
  .label-list
    list-style: none
    margin: 0px
    padding: 0
  .checkmark
    position: absolute
    top: 3px
    left: 0
    height: 17px
    width: 17px
    background: $color-background-primary
    border-radius: 50%
    border: 1px solid $color-border
  .checkmark:after
    content: ""
    position: absolute
    display: none
  .cart-heading
    margin-bottom: 0
  .cart-amount
    margin-bottom: .5rem
  .heading
    font-weight: $font-weight-regular
  .mobile-table
    padding: 0.25rem
    border-top: 1px solid $color-border
  .gtin-width
    display: none
</style>
