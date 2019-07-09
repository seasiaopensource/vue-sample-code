<template lang="html">
  <div>
    <scaling-api-img v-if="!showDefaultImage" :imageName="imgSrc" autoWidth loaderOverlay class="article-image" @error.native="imageLoadError" />
    <img v-if="showDefaultImage" class="article-image" :src="defaultImage" >
  </div>
</template>
<script>
import { Article } from '@/etc/userClaims'
import portalConfig from '@/config'
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
      showDefaultImage: false,
      defaultImage: portalConfig.img.shopNoImage
    }
  },
  methods: {
    imageLoadError () {
      this.showDefaultImage = true
    }
  },
  computed: {
    imgSrc () {
      if (this.article !== null && this.article.photos) {
        if (this.article.photos.length) {
          let image = ''
          this.article.photos.forEach((img) => {
            if (Article.image.Featured === img.imageType) {
              image = img.name
            }
          })
          return image
        }
      }
      return ''
    },
    imageSize () {
      return { width: 250, height: 250 }
    }
  }
}
</script>
<style lang="sass" scoped>
  .article-image
    width: 100%
    height: auto

</style>
