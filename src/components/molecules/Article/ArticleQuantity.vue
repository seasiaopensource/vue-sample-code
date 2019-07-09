<template lang="html">
  <div class="article-quantity">
    <loader v-if="isCartUpdateLoading || isItemAddedLoading" />
    <h3 class="article-quantity__title">{{ $t('article.shop') }}</h3>
    <p>{{ $t('article.order') }}</p>
    <div class="article-quantity__dropdown">
      <quantity :amount="1" :qty.sync="qty" :qtyLowerLimit="1"/>
      <label class="article-quantity__label">{{ $t('article.amount') }}</label>
    </div>
    <!-- <div v-if="cartCreated || cartUpdated || cartItemUpdated || modifyItemInCart" class="article-quantity--message">
      <p v-if="cartCreated" class="article-quantity--message-success">{{ $t('shop.cartItemAdded') }}</p>
      <p v-if="cartUpdated || cartItemUpdated || modifyItemInCart" class="article-quantity--message-success">{{ $t('shop.cartItemUpdated') }}</p>
    </div> -->
    <list-errors
      v-if="cartCreatedError.length || cartUpdatedError.length || cartItemUpdatedError.length"
      :bag="[{errorField: null, errorMessage: $t('shop.cartItemError')}]"
      class="errors-listing"/>
    <div class="article-quantity__cart">
      <icon-text-button
        :disabled="!isLoggedIn"
        :name="$t('article.inCart')"
        color="secondary"
        frontOrientation
        icon="cart-plus"
        @click.native="addToCart"/>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'
import ShopStore from '@/store/modules/dynamic/shop/shop'
import Quantity from '@/components/molecules/Shop/Quantity'
import registerSubmodule from '@/store/helpers/registerSubmodule'
import mapDynamicGetters from '@/store/helpers/mapDynamicGetters'
import mapDynamicActions from '@/store/helpers/mapDynamicActions'
const storeName = 'shop'

export default {
  data () {
    return {
      qty: 1
    }
  },
  props: {
    shopId: {
      required: true,
      type: String
    },
    articleId: {
      required: true,
      type: String
    }
  },
  computed: {
    ...mapGetters('user', ['isLoggedIn', 'profileId']),
    ...mapDynamicGetters([
      {namespace: storeName, slug: 'shopIdFromRoute', name: 'shopCartItemsCount'},
      {namespace: storeName, slug: 'shopIdFromRoute', name: 'shopCart'},
      {namespace: storeName, slug: 'shopIdFromRoute', name: 'fetchCartId'},
      {namespace: storeName, slug: 'shopIdFromRoute', name: 'isCartUpdateLoading'},
      {namespace: storeName, slug: 'shopIdFromRoute', name: 'isCartItemUpdateLoading'},
      {namespace: storeName, slug: 'shopIdFromRoute', name: 'isItemAddedLoading'},
      {namespace: storeName, slug: 'shopIdFromRoute', name: 'carts'},
      {namespace: storeName, slug: 'shopIdFromRoute', name: 'cartCreated'},
      {namespace: storeName, slug: 'shopIdFromRoute', name: 'cartUpdated'},
      {namespace: storeName, slug: 'shopIdFromRoute', name: 'cartItemUpdated'},
      {namespace: storeName, slug: 'shopIdFromRoute', name: 'modifyItemInCart'},
      {namespace: storeName, slug: 'shopIdFromRoute', name: 'cartCreatedError'},
      {namespace: storeName, slug: 'shopIdFromRoute', name: 'cartUpdatedError'},
      {namespace: storeName, slug: 'shopIdFromRoute', name: 'cartItemUpdatedError'},
      {namespace: storeName, slug: 'shopIdFromRoute', name: 'checkItemInCart'},
      {namespace: storeName, slug: 'shopIdFromRoute', name: 'fetchShopCart'},
      {namespace: storeName, slug: 'shopIdFromRoute', name: 'checkItemQuantityInCart'}
    ]),
    shopIdFromRoute () {
      return this.shopId
    },
    articleIdFromRoute () {
      return this.articleId
    }
  },
  methods: {
    ...mapDynamicActions([
      {namespace: storeName, slug: 'shopIdFromRoute', name: 'fetchCartByShopId'},
      {namespace: storeName, slug: 'shopIdFromRoute', name: 'addItemToCart'},
      {namespace: storeName, slug: 'shopIdFromRoute', name: 'updateItemInCart'},
      {namespace: storeName, slug: 'shopIdFromRoute', name: 'updateCart'},
      {namespace: storeName, slug: 'shopIdFromRoute', name: 'modifyExistingItemInCart'}
    ]),
    registerStore () {
      const shopId = this.shopIdFromRoute
      registerSubmodule({module: ShopStore, namespace: storeName, slug: shopId})
      this.$store.commit(storeName + '/' + storeName + '--' + shopId + '/updateShopId', shopId)
    },
    dispatchUpdateCart () {
      if (this.checkItemInCart(this.articleIdFromRoute)) {
        return this.modifyExistingItemInCart({cartId: this.fetchCartId, articleId: this.articleIdFromRoute, quantity: this.qty})
      } else {
        let shopCart = this.fetchShopCart
        let body = this.fetchCartObj()
        _.forEach(shopCart.items, (item) => {
          body.items.push(item)
        })
        return this.updateCart({ 'cartId': this.fetchCartId, body })
      }
    },
    dispatchCreateCart () {
      const body = this.fetchCartObj()
      return this.addItemToCart({body})
    },
    fetchCartObj () {
      return {
        'profileId': this.profileId,
        'items': [{
          'shopId': this.shopIdFromRoute,
          'articleId': this.articleIdFromRoute,
          'amount': this.qty
        }],
        'specialInstructions': '',
        'active': true
      }
    },
    fetchItem () {
      return {
        'shopId': this.shopIdFromRoute,
        'articleId': this.articleIdFromRoute,
        'amount': this.qty
      }
    },
    addToCart () {
      if (this.fetchCartId) {
        this.dispatchUpdateCart()
          .then(() => {
            this.$router.app.$emit('refreshCart')
          })
      } else {
        this.dispatchCreateCart()
          .then(() => {
            this.$router.app.$emit('refreshCart')
          })
      }
    }
  },
  created () {
    // this.registerStore()
    if (this.isLoggedIn) {
      this.fetchCartByShopId()
      this.qty = this.checkItemQuantityInCart(this.articleIdFromRoute)
    }
  },
  components: {
    Quantity
  }
}
</script>
<style lang="sass" scoped>
  .errors-listing
    margin-top: 10px
  .lt-input
    float: left

  .number-data
    display: inline-block
    vertical-align: top
    margin: 5px 0 0 5px
    font-size: $font-size-regular
    color: $font-regular-color
  .article-quantity
    &__title
      font-size: $font-size-regular
      color: $font-heading-color
    &--message
      display: inline-block
      width: 100%
      margin: 10px 0 0 0
      &-success
        color: $color-indicator-success !important
        background-color: rgba($color-indicator-success, .2)
        border: 1px solid rgba($color-indicator-success, .4)
        padding: .4rem 1.5rem .4rem 1rem !important
        font-size: $font-size-small
        border-radius: 4px
    &__dropdown
      display: flex
      align-items: center
    &__label
      margin: 0
      padding-left: .5rem
      font-weight: $font-weight-regular
    &__cart
      margin-top: 1rem
      button
        width: 100%
</style>
