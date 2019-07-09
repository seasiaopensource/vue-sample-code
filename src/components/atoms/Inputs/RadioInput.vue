<template lang="html">
  <portal-input
    :class="'form-input--radio'"
    :validation="validation"
    :name="name"
    :value="value"
    v-model="dataInstance"
    inputType="radio" />
</template>
<script>
export default {
  components: {

  },
  props: {
    validation: {
      type: [Boolean, String],
      default: false
    },
    name: {
      type: [Boolean, String],
      default: false
    },
    value: {
      type: [Boolean, String],
      default: ''
    }
  },
  data () {
    return {
      dataInstance: this.value
    }
  },
  watch: {
    dataInstance (newValue) {
      this.$emit('input', newValue)
    }
  }
}
</script>
<style lang="sass" scoped>
  .form-input
    display: block
    border-radius: 8px
    border: 1px solid $color-border
    background-color: $color-background-primary
    font-weight: $font-weight-light
    padding: 0 .25rem
    height: 2rem
    width: 100%

    &--radio
      display: inline-block
      cursor: pointer
      font-size: 1rem
      line-height: 1
      width: 1.5rem
      height: 1rem
      padding: 0
</style>
