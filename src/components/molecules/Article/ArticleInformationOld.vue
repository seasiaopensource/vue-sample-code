<template lang="html">
  <div>
    <div class="product-name">{{ article.name }}</div>
    <div class="von-text">
      <!--von <aa href="#" class="von-text-anchor">Samsung</aa>-->
    </div>
    <!-- <div class="uvp-price">
        <span class="uvp-price-heading">UVP:</span>
        <span class="uvp-price-text">999</span> &euro;
      </div> -->
    <div class="product-price">
      <span class="product-price-heading">{{ $t('article.product_price') }}</span>
      <price-text :priceObject="article.price" :separator="$t('article.decimalSeparator')" />
      <span class="product-price-text"> {{ fractionPrice }}<sup>{{ $t('article.decimalSeparator') }}{{ decimalPrice }} {{ currency[article.price.currency.symbol] }}</sup>
        <p>{{ $t('article.product_vat') }}</p>
        <p>{{ $t('article.product_shipping') }}</p>
      </span>
    </div>
    <div class="stock-left">
      <!-- <h3>{{article.stock}}</h3>-->
      <!-- <h4>Lieferung innerhalb von 2 Werktagen</h4> -->
    </div>

  </div>
</template>
<script>
import { Article } from '@/etc/userClaims'
export default {
  props: {
    article: {
      type: Object,
      default () {
        return null
      }
    }
  },
  data () {
    return {
      currency: null
    }
  },
  computed: {
    fractionPrice () {
      if (this.article !== null && typeof this.article.price !== 'undefined' && typeof this.article.price.price) {
        return this.article.price.price.toFixed(2).split('.')[0]
      }
    },
    decimalPrice () {
      if (this.article !== null && typeof this.article.price !== 'undefined' && typeof this.article.price.price) {
        return this.article.price.price.toFixed(2).split('.')[1]
      }
    }
  },
  created () {
    this.currency = Article.currency
  }
}
</script>
<style lang="sass" scoped>
  .product-name
    float: left
    width: 100%
    font-size: $font-size-larger
    font-weight: $font-weight-bold
    line-height: 23px
    padding: 0 0 5px 0
    color: $font-heading-color
  .von-text
    float: left
    width: 100%
    font-size: $font-size-small
    margin: 0 0 20px 0
    color: $font-regular-color
    &-anchor
      color: $color-keycolor-1
  .uvp-price
    float: left
    width: 100%
    font-size: $font-size-small
    margin-bottom: 3px
    color: $font-regular-color
    &-heading
      float: left
      width: 50px
    &-text
      text-decoration: line-through
      color: $font-regular-color
  .product-price
    float: left
    width: 100%
    font-size: $font-size-small
    margin-bottom: 20px
    &-heading
      float: left
      width: 50px
      padding: 4px 0 0 0
      color: $font-regular-color
    &-text
      font-size: $font-size-double-extra-large
      font-weight: $font-weight-light
      float: left
      font-family: lato
      color: $font-regular-color

      sup
        top: -.6em
        color: $font-regular-color
        font-size: $font-size-large
      p
        font-size: $font-size-smaller
        line-height: 12px
        padding: 0
        margin: 0
        font-family: sans-serif
        color: $font-regular-color
  .stock-left
    float: left
    width: 100%
    h3
      font-size: $font-size-small
      margin: 0
      padding: 0
      line-height: 15px
      color: $color-keycolor-1
    h4
      font-size: $font-size-small
      margin: 0
      padding: 0
      font-weight: $font-weight-regular
      color: $font-regular-color
</style>
