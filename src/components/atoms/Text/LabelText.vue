<template lang="html">
  <label class="form-label">{{ name }}</label>
</template>
<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    }
  }
}
</script>
<style lang="sass" scoped>
  .form-label
    font-weight: $font-weight-regular
    &--checkbox
      display: inline-block
      font-size: .875rem
      width: calc(100% - 30px)

    &__link
      font-size: .875rem
      text-decoration: underline
      cursor: pointer
      &:hover
        color: $color-keycolor-2
</style>
