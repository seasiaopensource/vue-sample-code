<template lang="html">
  <div class="dashboard-list">
    <template v-for="(item, index) in items">
      <router-link
        v-if="item.routerTo"
        :key="index"
        :to="item.routerTo"
        class="dashboard-list__item"
        :class="{
          'dashboard-list__item--single': items.length === 1,
          'dashboard-list__item--last': itemsIsOdd && items.length - 1 === index
        }"
      >
        <span class="dashboard-list__label">
          <i :class="'fa-'+ item.icon" class="dashboard-list__icon fa">
            <badge v-if="item.badgeCounter" :counter="item.badgeCounter" />
          </i>
          {{ item.label }}
        </span>
        <i class="dashboard-list__icon dashboard-list__icon--right fa fa-angle-right"/>
      </router-link>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    items: Array
  },
  computed: {
    itemsIsOdd () {
      return this.items.length % 2
    }
  }
}
</script>

<style lang="sass" scoped>
.dashboard-list
  border-top: 1px solid $color-border
  display: flex
  flex-wrap: wrap
  &__item
    color: $font-regular-color
    padding: $box-padding
    border-bottom: 1px solid $color-border
    text-decoration: none
    cursor: pointer
    display: flex
    align-items: center
    justify-content: space-between
    +ease(.3s)
    +make-col(12)
    +xs\-
      +make-col(6)
      padding: $box-padding-xs
      &:nth-of-type(even)
        border-left: 1px solid $color-border

    &:hover
      color: $color-keycolor-1
      text-decoration: none

    &--single
      border: 0

    &--last
      +xs\-
        +make-col(12)
        border: 0
    &.router-link-active
      color: $color-keycolor-1
      .fa
        color: $color-keycolor-1
  &__label
    display: inline-block
    font-weight: $font-weight-regular
    margin: 0
    +xs\-
      font-size: $font-size-small
  &__icon
    position: relative
    width: 2rem
    padding-right: .5rem
    text-align: center
    font-size: $font-size-larger
    &--right
      text-align: right
      padding: 0
      width: auto
</style>
