<template lang="html">
  <div v-if="itemCount === 0" class="msgbox">
    <div class="msgbox-icon">
      <i aria-hidden="true" class="fa fa-shopping-cart" />
    </div>
    <div class="msgbox-text">{{ $t('cartSummary.emptyCart') }}</div>
    <div class="msgbox-btn">
      <icon-text-button
        icon="angle-right"
        :name="$t('cartSummary.continue')"
        color="secondary"
        @click.native="goToShop()" />
    </div>
  </div>
</template>
<script>
import {getDefaultCategoryIdFromShopId} from '@/etc/shops.js'
export default {
  props: {
    itemCount: {
      type: Number,
      required: true
    },
    shopId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      categoryId: ''
    }
  },
  computed: {
    shopIdFromRoute () {
      return this.shopId
    }
  },
  created () {
    this.fetchCategory()
  },
  methods: {
    async fetchCategory () {
      this.categoryId = await getDefaultCategoryIdFromShopId(this.shopIdFromRoute)
    },
    goToShop () {
      this.$router.push({name: 'categoryPage', params: {shopId: this.shopIdFromRoute, categoryId: this.categoryId}})
    }
  }
}
</script>

<style lang="sass" scoped>
  .msgbox
    display: inline-block
    width: 100%
    text-align: center
    margin: 45px 0
    &-icon
      i
        font-size: 40px
        line-height: 35px
    &-text
      font-weight: $font-weight-bold
      font-size: $font-size-regular
      color: $font-heading-color
      padding: 0 0 7px 0
</style>
