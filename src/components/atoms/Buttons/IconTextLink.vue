<template lang="html">
  <a
    class="link-icontext"
    href="">
    <i
      :class="'fa-' + icon"
      class="fa"
      aria-hidden="true"/>
    <span class="link-icontext__text">{{ name }}</span>
  </a>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="sass" scoped>
  .link-icontext
    display: flex
    .fa
      width: 18px
      height: 18px
      margin: 2px 0.25rem 0 0
      text-align: center
    &__text
      align-self: center
      display: inline-block
      font-size: 0.875rem
      line-height: 1
    &:hover
      text-decoration: none
</style>
