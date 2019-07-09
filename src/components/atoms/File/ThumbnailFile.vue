<template lang="html">
  <div class="upload-file">
    <span v-if="showRemoveButton" class="upload-file__remove" @click="onClick"><i class="fa fa-remove"/></span>
    <i class="upload-file__icon" :class="docIcon"></i>
    <headline-text class="upload-file__name" :title="docName" :name="truncatedFileName" size="h6" />
    <p class="upload-file__size">{{docSize}} </p>
  </div>
</template>
<script>
export default {
  name: 'ThumbnailFile',
  props: {
    docName: {
      type: String,
      required: true
    },
    docSize: {
      type: String,
      required: true
    },
    docType: {
      type: String,
      required: true
    },
    showRemoveButton: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onClick () { this.$emit('removeThumbnailFile') }
  },
  computed: {
    truncatedFileName () {
      if (this.docName.length > 20) {
        return this.docName.substring(0, 10) + ' ...' + this.docName.substr(this.docName.length - 11)
      }

      return this.docName
    },
    docIcon () {
      switch (this.docType) {
        case 'application/msword':
          return 'fa fa-file-word-o'
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          return 'fa fa-file-word-o'
        case 'application/pdf':
          return 'fa fa-file-pdf-o'
        case 'text/plain':
          return 'fa fa-file-text-o'
        case 'application/vnd.ms-excel':
          return 'fa fa-file-excel-o'
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
          return 'fa fa-file-excel-o'
        case 'application/vnd.ms-powerpoint':
          return 'fa fa-file-powerpoint-o'
        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
          return 'fa fa-file-powerpoint-o'
        case 'application/vnd.openxmlformats-officedocument.presentationml.slideshow':
          return 'fa fa-file-powerpoint-o'
        default:
          return 'fa fa-file-text-o'
      }
    }
  }
}
</script>
<style lang="sass" scoped>
.upload-file
  position: relative
  background-color: $box-bg-color
  border: 1px solid $box-border-color
  border-radius: $box-border-radius
  background: $color-background-primary
  padding: 0.5rem
  word-break: break-all
  width: 89px
  text-align: center
  margin: 0 10px 10px 0
  &__name
    padding: 4px 0
    overflow: hidden
    text-align: center
    display: flex
    justify-content: center
  &__size
    font-size: $font-size-extra-small
    padding: 0
    font-weight: $font-weight-light
    text-align: center
    margin: 0
  &__icon
    font-size: $font-size-larger
  &__remove
    position: absolute
    top: -6px
    right: -5px
    z-index: 1
    width: 20px
    height: 20px
    display: block
    padding: 2px
    font-size: 0.875rem
    line-height: 1
    border-radius: 20px
    border: 1px solid $color-border
    background-color: $color-background-secondary
    cursor: pointer
    text-align: center
</style>
