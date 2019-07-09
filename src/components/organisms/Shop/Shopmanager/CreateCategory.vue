<template>
  <box>
    <div class="category__header">
      <h2 class="category__title"> {{$t('shopmanager.shopCategory.addCategory.addCategoryBtnText')}}</h2>
    </div>
    <div class="category__content">
      <form-field
        slot="left"
        :name="$t('shopmanager.shopCategory.addCategory.categoryName')"
        type="text"
        v-model="name"
        @input="$emit('changesDetected')"
        additionalValidation="required"
      />
    </div>
    <div class="category__footer">
      <text-button slot="headline" class="save-btn" :name="$t('shopmanager.shopCategory.addCategory.add')" @click="onSubmit" color="secondary" />
    </div>
  </box>
</template>
<script>
import mapDynamicActions from '@/store/helpers/mapDynamicActions'
import mapDynamicGetters from '@/store/helpers/mapDynamicGetters'
import { operationNotificationTypes } from '@/store/modules/global/operationNotification'
import { scrollToFirstError } from '@/etc/validationHelpers'
const storeName = 'categoryArticles'

export default {
  data () {
    return {
      name: ''
    }
  },
  props: {
    parentId: {
      type: String
    },
    shopId: {
      type: String
    },
    lastIndex: {
      type: Number
    }
  },
  computed: {
    ...mapDynamicGetters([
      {namespace: storeName, slug: 'parentId', name: 'isLoadingAddShopCategories'},
      {namespace: storeName, slug: 'parentId', name: 'addShopCategoriesError'}
    ])
  },
  methods: {
    ...mapDynamicActions([
      {namespace: storeName, slug: 'parentId', name: 'addShopCategories'}
    ]),
    async onSubmit () {
      let isValid = await this.$validator.validateAll()
      if (!isValid) {
        scrollToFirstError({validator: this.$validator})
        return
      }

      var obj = {
        parent: this.parentId,
        name: this.name,
        index: this.lastIndex
      }
      await this.addShopCategories({body: obj, shopId: this.shopId})
      if (this.addShopCategoriesError && this.addShopCategoriesError > 0) {
        this.$store.dispatch('operationNotification/create', {
          title: this.$t('operationNotifications.general.unexpectedError.title'),
          type: operationNotificationTypes.error,
          message: this.$t('operationNotifications.general.unexpectedError.message')
        })
      } else {
        this.$store.dispatch('operationNotification/create', {
          title: this.$t('shopmanager.shopCategory.addCategory.title'),
          type: operationNotificationTypes.success,
          message: this.$t('shopmanager.shopCategory.addCategory.notificationMessage')
        })
      }
      this.name = ''
      this.$router.app.$emit('closeDialog')
    }
  },
  $_veeValidate: {
    validator: 'new'
  }
}
</script>
<style lang="sass" scoped>
  .category
    height: 600px
    overflow: hidden
    background-color: $color-background-secondary
    box-shadow: none !important
    +xs\-
      height: 100vh
    &__header
      padding: $box-padding
      height: auto
      border-bottom: 1px solid $color-border
      +make-col(12)
    &__footer
      text-align: center
      border-top: 1px solid $color-border
      padding: $box-padding
      justify-content: flex-end
      background: $color-background-secondary
      &__title
        margin-bottom: 0
      +xs\-
        padding: $box-padding-xs
    &__content
      height: calc( 100% - 224px )
      padding: 1.3rem 2rem
      overflow: auto
    .save-btn
      float: right
</style>
