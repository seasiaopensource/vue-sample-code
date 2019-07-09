<template lang="html">
  <div
    class="user-button"
    @click="onClick" >
    <user-avatar
      :imageName="imageName"
      :src="src"
      :badge="badge"
      :categoryId="categoryId"
      smSize="medium"
      size="mediumsmall"
      xsSize="small"
    />
    <stacked-text
      :upperText="name"
      :bottomText="auxText"
      fontWeightUpper="regular"
      fontWeightBottom="light"
      fontSizeBottom="small"
      truncateUpper
      truncateAuxText
    />
    <i
      class="fa fa-angle-double-down"
      aria-hidden="true"/>
  </div>
</template>
<script>
export default {
  props: {
    imageName: {
    },
    src: {},
    name: {
      type: String
    },
    auxText: {
      type: String
    },
    badge: {
      type: Number,
      default: 0
    },
    categoryId: {
      type: Number
    }
  },
  methods: {
    onClick () {
      this.$emit('click')
    }
  }
}
</script>
<style lang="sass" scoped>
.user-button
  display: flex
  cursor: pointer
  align-items: center
  height: 45px
  width: auto
  max-width: 200px
  +sm\-
    order: 3

  .avatar
    margin-right: .5rem
    +xs\-
      margin-right: 0.25rem

  .stacked-text
    margin-right: 1rem
    +sm\-
      margin-right: .5rem
    +xs\-
      display: none

</style>
