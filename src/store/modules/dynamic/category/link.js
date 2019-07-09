import portalConfig from '@/config'
import {createStandardStore, createStandardAjax} from '@/store/helpers/createStandards.js'

const namespaced = true

const standardValues = {
  categoryId: null, // Always remember to assign this parameter as the module is registered.
  isLoadingShopCategories: 0,
  subCategories: []
}

const state = () => {
  return {}
}

const getters = {
  hasErrors: state => state.errorBag && state.errorBag.length
}

const mutations = {

}

const actions = {
  getCategoryById: createStandardAjax({
    isLoadingState: 'isLoadingShopCategories',
    responseState: 'subCategories',
    swagger: {
      config: portalConfig.api.categoryService,
      tag: 'Categories',
      operationId: 'GetCategoryById'
    },
    params: {
      shopId: {payload: 'shopId'},
      depth: {payload: 'depth'},
      categoryId: {payload: 'categoryId'}
    }
  })
}

export default createStandardStore(
  standardValues,
  {
    namespaced,
    state,
    getters,
    actions,
    mutations
  }
)
