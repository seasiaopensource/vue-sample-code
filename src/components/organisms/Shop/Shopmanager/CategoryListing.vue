<template>
  <div class="cat-listing">
    <h3 class="heading">{{ heading }}</h3>
    <p class="subheading">{{ subHeading }}</p>
    <loader :fullPage="true" v-if="isLoadingSubCategories || isLoadingCategoriesArticlesCount || isLoadingChangeCategoryIndex"/>
    <draggable element="ul" class="cat-bar" v-model="listing">
      <transition-group>
        <li v-for="(shopCategory, index) in listingData" :key="index" class="cat-bar__item" @click="fetchSubcategory(shopCategory)">
          <span class="cat-bar__label">
          <i class="cat-bar__icon fa fa-arrows"></i>{{shopCategory.name}}</span>
          <i class="cat-bar__icon cat-bar__icon--right fa fa-chevron-right"></i>
        </li>
      </transition-group>
    </draggable>
    <!-- ul class="cat-bar">
      <li class="cat-bar__item" @click="fetchSubcategory(shopCategory)" v-for="shopCategory in listingData" :key="shopCategory.name">
        <span class="cat-bar__label">
        <i class="cat-bar__icon fa fa-arrows"></i>{{shopCategory.name}}</span>
        <i class="cat-bar__icon cat-bar__icon--right fa fa-chevron-right"></i>
      </li>
    </ul -->
    <div class="add-btn" @click="openCreateDialog()">
      <span  class="add-btn__label">
      <i  class="add-btn__icon--plus fa fa-plus"></i>
      {{btnText}}
      </span>
    </div>
  </div>
</template>
<script>
import mapDynamicGetters from '@/store/helpers/mapDynamicGetters'
import draggable from 'vuedraggable'

const storeName = 'categoryArticles'

export default {
  props: {
    heading: {
      type: String
    },
    subHeading: {
      type: String
    },
    listingData: {
      type: Array
    },
    parentId: {
      type: String
    },
    shopId: {
      type: String
    },
    btnText: {
      type: String
    }
  },
  components: {
    draggable
  },
  computed: {
    ...mapDynamicGetters([
      {namespace: storeName, slug: 'parentId', name: 'isLoadingSubCategories'},
      {namespace: storeName, slug: 'parentId', name: 'isLoadingCategoriesArticlesCount'},
      {namespace: storeName, slug: 'parentId', name: 'isLoadingChangeCategoryIndex'}
    ]),
    listing: {
      get () {
        return this.listingData
      },
      set (value) {
        this.$emit('indexChanged', {list: value})
      }
    }
  },
  methods: {
    fetchSubcategory (category) {
      this.$router.push({name: 'shopCategory', params: {parentId: category.parent, categoryId: category.categoryId, 'showSubCategory': true}})
    },
    openCreateDialog () {
      this.$router.app.$emit('openDialog',
        {
          'component': 'create-category',
          payload: {
            parentId: this.parentId,
            shopId: this.shopId,
            lastIndex: this.listingData && this.listingData.length || 0
          }
        }
      )
    }
  }
}
</script>
<style lang="sass" scoped>
  .cat-listing
    .heading
      padding: $box-padding
      font-size: 1rem
      border-bottom: 1px solid $color-border
      margin: 0
      +xs\-
        padding: $box-padding-xs
    .subheading
       padding: $box-padding
       border-bottom: 1px solid $color-border
       margin-bottom: 0px
       +xs\-
         padding: $box-padding-xs
    .cat-bar
      padding-left: 0
      margin-bottom: 0
      &__item
        padding: .75rem 2rem
        border-bottom: 1px solid $color-border
        display: flex
        align-items: center
        justify-content: space-between
        cursor: pointer
        +xs\-
          padding: .75rem 1rem
      &__label
        font-weight: $font-weight-normal
        cursor: pointer
      &__icon
        color: $color-base-grey-medium
        padding-right: .5rem
        cursor: pointer
        &:hover
          color: $color-keycolor-1
      &__icon--right
        float: right
        color: $color-base-black
    .add-btn
      background-color: $button-color-secondary
      padding: .75rem 2rem
      cursor: pointer
      color: #fff
      +xs\-
        padding: .75rem 1rem
      &:hover
        background-color: $color-keycolor-1
      &__icon--plus
        color: #fff
        padding-right: .5rem
</style>
