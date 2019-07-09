<template lang="html">
  <router-link class="cart" :to="moveToCartPage">
    <i class="cart__icon fa fa-shopping-cart" :class="{ 'cart__icon--label': fetchTotalQuantityInCart }"></i>
   {{ cartLabel }}
  </router-link>
</template>
<script>
import { mapGetters } from 'vuex'
import ShopStore from '@/store/modules/dynamic/shop/shop'
import registerSubmodule from '@/store/helpers/registerSubmodule'
import mapDynamicGetters from '@/store/helpers/mapDynamicGetters'
import mapDynamicActions from '@/store/helpers/mapDynamicActions'
const storeName = 'shop'
export default {
  data () {
    return {
      cartItems: 0
    }
  },
  props: {
    shopId: {
      required: true,
      type: String
    }
  },
  computed: {
    ...mapGetters('user', ['isLoggedIn', 'profileId']),
    ...mapGetters('browser', ['bootstrapMode']),
    ...mapDynamicGetters([
      {namespace: storeName, slug: 'shopIdFromRoute', name: 'shopCartItemsCount'},
      {namespace: storeName, slug: 'shopIdFromRoute', name: 'fetchCartId'},
      {namespace: storeName, slug: 'shopIdFromRoute', name: 'fetchTotalQuantityInCart'}
    ]),
    shopIdFromRoute () {
      return this.shopId
    },
    cartLabel () {
      if (!(this.bootstrapMode === 'xs')) {
        return this.fetchTotalQuantityInCart ? this.fetchTotalQuantityInCart + ' ' + this.$t('cartSummary.items') : this.$t('cartSummary.shopping')
      } else {
        return this.fetchTotalQuantityInCart ? this.fetchTotalQuantityInCart : ''
      }
    },
    moveToCartPage () {
      if (this.fetchCartId) {
        return {name: 'cartPage', params: {cartId: this.fetchCartId}}
      } else {
        return {name: 'emptyCartPage', params: {shopId: this.shopIdFromRoute}}
      }
    }
  },
  methods: {
    ...mapDynamicActions([
      {namespace: storeName, slug: 'shopIdFromRoute', name: 'fetchCartByShopId'},
      {namespace: storeName, slug: 'shopIdFromRoute', name: 'emptyCart'}
    ]),
    registerStore () {
      const shopId = this.shopIdFromRoute
      registerSubmodule({module: ShopStore, namespace: storeName, slug: shopId})
      this.$store.commit(storeName + '/' + storeName + '--' + shopId + '/updateShopId', shopId)
    }
  },
  created () {
    this.registerStore()
    if (this.isLoggedIn) {
      this.fetchCartByShopId()
      this.$router.app.$on('emptyCart', () => this.emptyCart())
      this.$router.app.$on('refreshCart', () => this.fetchCartByShopId())
    }
  }
}
</script>
<style lang="sass" scoped>
.cart
  text-decoration: none
  cursor: pointer
  height: 50px
  display: flex
  align-items: center
  color: $color-keycolor-2
  font-size: $font-size-large
  +ease(.3s)
  &:hover
    color: $color-keycolor-1
  &__icon
    font-size: 24px
    padding-right: .5rem
    +xs\-
      padding-right: 0
    &--label
      +xs\-
        padding-right: 4px
</style>
