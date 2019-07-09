<template lang="html">
  <orders-list
    :query="query"
    :ordersLinks = "ordersLinks"
    :isLoadingFetchOrders = "isLoadingFetchOrders"
    :orders = "orders"
    :totalOrders="totalOrders"
    :columns="['viewOrderId', 'created', 'shippingAddress', 'billingAddress', 'shippingState', 'totalPrice']"
    :orderDetailRouteName="orderDetailRouteName"
  />
</template>
<script>
import { mapGetters } from 'vuex'
import OrdersList from '@/components/molecules/OrdersList/OrdersList'
import OrdersOverviewStore from '@/store/modules/dynamic/shop/orders'
import registerSubmodule from '@/store/helpers/registerSubmodule'
import mapDynamicGetters from '@/store/helpers/mapDynamicGetters'
import mapDynamicActions from '@/store/helpers/mapDynamicActions'
import { orderStatus } from '@/etc/userClaims'
const OrdersOverviewStoreName = 'orders/overview'

export default {
  data () {
    return {
      orderDetailRouteName: 'ordersDetailPage'
    }
  },
  components: {
    OrdersList
  },
  props: {
    query: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters('user', ['hasShop', 'shopId']),
    ...mapDynamicGetters([
      {namespace: OrdersOverviewStoreName, slug: 'shopId', name: 'orders'},
      {namespace: OrdersOverviewStoreName, slug: 'shopId', name: 'totalOrders'},
      {namespace: OrdersOverviewStoreName, slug: 'shopId', name: 'isLoadingFetchOrders'}
    ]),
    fetchShopId () {
      return this.shopId
    },
    fetchPage () {
      return this.query.page ? this.query.page : 1
    },
    fetchView () {
      return this.query.view ? this.query.view : 8
    },
    ordersLinks () {
      return [
        {
          'path': {name: 'ordersOverviewPageAll', query: { page: 1, view: 8 }},
          'title': 'ordersList.ordersOverview.filter.all',
          'isInternal': true
        },
        {
          'path': {name: 'ordersOverviewPageNewOrders', query: { page: 1, view: 8 }},
          'title': 'ordersList.ordersOverview.filter.newOrders',
          'isInternal': true
        },
        {
          'path': {name: 'ordersOverviewPageInProgress', query: { page: 1, view: 8 }},
          'title': 'ordersList.ordersOverview.filter.inProgress',
          'isInternal': true
        },
        {
          'path': {name: 'ordersOverviewPageShipped', query: { page: 1, view: 8 }},
          'title': 'ordersList.ordersOverview.filter.shipped',
          'isInternal': true
        },
        {
          'path': {name: 'ordersOverviewPageCompleted', query: { page: 1, view: 8 }},
          'title': 'ordersList.ordersOverview.filter.completed',
          'isInternal': true
        }
      ]
    }
  },
  created () {
    if (this.hasShop) {
      this.registerStore()
      this.fetchShopOrders()
    }
  },
  methods: {
    ...mapDynamicActions([
      {namespace: OrdersOverviewStoreName, slug: 'fetchShopId', name: 'fetchOrders'}
    ]),

    registerStore () {
      const shopId = this.fetchShopId
      registerSubmodule({module: OrdersOverviewStore, namespace: OrdersOverviewStoreName, slug: shopId})
    },
    fetchShopOrders () {
      var orderStates = []
      const page = this.fetchPage
      const pageLimit = this.fetchView
      const pageOffset = (page - 1) * pageLimit
      this.currentRoute = this.$route.name
      switch (this.currentRoute) {
        case 'ordersOverviewPageNewOrders' :
          orderStates = [orderStatus.NEW]
          break
        case 'ordersOverviewPageInProgress' :
          orderStates = [orderStatus.IN_PROGRESS]
          break
        case 'ordersOverviewPageShipped' :
          orderStates = [orderStatus.SHIPPED]
          break
        case 'ordersOverviewPageCompleted' :
          orderStates = [orderStatus.COMPLETED]
          break
        default:
          orderStates = []
      }
      const payload = {
        shopId: this.fetchShopId,
        states: orderStates,
        pageOffset: pageOffset,
        pageLimit: pageLimit
      }
      this.fetchOrders(payload)
    }
  }
}
</script>
<style lang="sass" scoped>
</style>
