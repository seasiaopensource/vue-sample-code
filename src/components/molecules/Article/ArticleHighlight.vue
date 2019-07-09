<template lang="html">
  <div class="article-highlight" @click="showDetails()">
    <div class="article-highlight__img">
      <article-image :article="article" />
    </div>
    <div class="article-highlight__info-wrapper">
      <h1 class="article-highlight__name" :title="articleNameTitle">{{ truncateArticleName }}</h1>
      <div class="article-highlight__price">
        <price-text :priceObject="article.price" :separator="$t('article.decimalSeparator')" />

        <!-- <h2>{{ fractionPrice }}<sup>{{ $t('article.decimalSeparator') }}{{ decimalPrice }} {{ currency[article.price.currency.symbol] }}</sup></h2>
        <p>{{ $t('article.product_vat') }}</p>
        <p>{{ $t('article.plus') }} <aa
          href="#"
          title="Versand"
          class="versand">{{ $t('article.shipping') }}</aa></p> -->
      </div>
    </div>
  </div>
</template>
<script>
import ArticleImage from '@/components/molecules/Article/ArticleImage'
import { Article } from '@/etc/userClaims'
import { mapGetters } from 'vuex'

export default {
  props: {
    article: {
      type: Object
    },
    shopId: {
      required: true,
      type: String
    }
  },
  data () {
    return {
      currency: null
    }
  },
  methods: {
    showDetails () {
      this.$router.push({name: 'articlePage', params: { 'shopId': this.shopId, 'articleId': this.article.id }})
    }
  },
  computed: {
    ...mapGetters('browser', ['bootstrapMode']),
    fractionPrice () {
      return this.article.price.price.toFixed(2).split('.')[0]
    },
    decimalPrice () {
      return this.article.price.price.toFixed(2).split('.')[1]
    },
    articleNameTitle () {
      if (this.truncateArticleName !== this.article.name) {
        return this.article && this.article.name
      } else return ''
    },
    truncateArticleName () {
      var articleNameLength = this.article && this.article.name && this.article.name.length

      switch (this.bootstrapMode) {
        case 'sm': {
          if (articleNameLength <= 50) {
            return this.article.name
          } else {
            return this.article.name.substr(0, 50) + '...'
          }
        }
        case 'xs': {
          if (articleNameLength >= 32) {
            return this.article.name.substr(0, 32) + '...'
          } else {
            return this.article.name
          }
        }
        default: {
          if (articleNameLength <= 27) {
            return this.article.name
          } else {
            return this.article.name.substr(0, 27) + '...'
          }
        }
      }
    }
  },
  components: {
    ArticleImage
  },
  created () {
    this.currency = Article.currency
  }
}
</script>
<style lang="sass" scoped>
  .article-highlight
    cursor: pointer
    position: relative
    display: flex
    flex-direction: column
    box-shadow: $box-shadow

    +xs\-
      box-shadow: none
      flex-direction: row
      border-top: 1px solid $color-border
      border-bottom: 1px solid $color-border
    &__img
      width: 100%
      +xs\-
        width: 60px
    &__info-wrapper
      padding: .75rem 1rem
      background: $color-base-grey-regular
      +xs\-
        width: calc(100% - 60px)
        height: 60px
        display: flex
        align-items: center
        padding: 4px .5rem
        justify-content: space-between

    &__name
      word-wrap: break-word
      // height: 42px
      font-size: $font-size-regular
      overflow: hidden
      margin-bottom: 1rem
      +xs\-
        width: calc(100% - 110px)
        font-size: $font-size-small
        margin: 0

    &__price
      display: flex
      justify-content: flex-end
      margin: 5px 0 10px 0
      +xs\-
        width: 100px
        margin: 0
      h2
        font-size: $font-size-double-extra-large
        font-weight: $font-weight-light
        margin-bottom: .8rem
        padding: 0
        line-height: 22px
        color: $font-regular-color
        sup
          top: -.6em
          font-size: $font-size-large
          color: $font-regular-color
      p
        font-size: $font-size-smaller
        margin: 0
        padding: 0
        line-height: 14px
        font-weight: $font-weight-light
        color: $font-regular-color
  .versand
    color: $color-keycolor-1
</style>
