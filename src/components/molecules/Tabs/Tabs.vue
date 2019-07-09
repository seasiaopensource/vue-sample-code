<template lang="html">
  <ul class="tab">
    <li
      v-for="(tab, key) in tabs"
      :key="key"
      class="tab__item">
      <aa
        v-if="!tab.disabled"
        :key="tab.id"
        :href="tab.href"
        tag="a"
        class="tab__link">
        {{ tab.name }}
      </aa>
      <span
        v-else
        @click.capture="clicked">
        <aa
          :key="tab.id"
          :href="tab.href"
          tag="a"
          class="tab__link tab__link--disabled">
          {{ tab.name }}
        </aa>
      </span>
    </li>
  </ul>
</template>
<script>
export default {
  name: 'Tabs',
  props: {
    tabs: {
      type: Array,
      required: true
    }
  },
  methods: {
    clicked (e) {
      e.preventDefault()
    }
  }
}
</script>
<style lang="sass" scoped>
.tab
  position: relative
  list-style-type: none
  padding: 0
  margin: 0
  display: flex
  justify-content: space-around

  &::after
    content: ''
    display: block
    position: absolute
    left: 0
    right: 0
    bottom: -4px
    border-bottom: 4px solid $color-keycolor-1

  &__item
    padding: 1rem 0

  &__link
    line-height: 1.5
    color: $color-keycolor-2
    font-size: $font-size-regular
    margin-bottom: 0
    cursor: pointer

    &--disabled
      cursor: not-allowed
      color: $font-regular-color

</style>
