<template lang="html">
  <div class="article-information">
    <h1 class="article-information__title">{{ $t('article.product_information') }}</h1>
    <p class="article-information__description" v-html="parseFull"/>
  </div>
</template>
<script>
import sanitizeHtml from 'sanitize-html'

export default {
  props: {
    article: {
      type: Object,
      default () {
        return null
      }
    }
  },
  computed: {
    description () {
      if (this.article && this.article.descriptions && this.article.descriptions.full) {
        let text = this.article.descriptions.full
        // Replaces linebreaks with br-Tag
        return text.replace(/\n/g, '<br />')
      }
    },
    parseFull () {
      if (this.description) {
        return sanitizeHtml(this.description, {
          allowedTags: [ 'strong', 'h3', 'h4', 'h5', 'h6', 'b', 'i', 'u', 'br', 'p', 'ul', 'li' ]
        })
      }
    }
  }
}
</script>
<style lang="sass" scoped>
  .article-information
    &__title
      font-size: $font-size-regular
    &__description
      font-size: $font-size-small
</style>
