import portalConfig from '@/config'
import {createStandardStore, createStandardAjax} from '@/store/helpers/createStandards.js'

const pageOffset = 0
const pageLimit = 100

const namespaced = true

const standardValues = {
  globalId: null, // Always remember to assign this parameter as the module is registered.

  filesCollection: [],
  isLoading: false,
  ajaxResponse: null,
  errorBag: [],

  pageOffset: pageOffset,
  pageLimit: pageLimit
}

const state = () => {
  return {}
}

const getters = {
  files: (state) => state.ajaxResponse && !state.isLoading && state.filesCollection,
  total: (state) => state.ajaxResponse && state.ajaxResponse.totalAmount,
  remaining: (state) => state.ajaxResponse && state.ajaxResponse.itemsLeft
}

const mutations = {
  pushFiles (state, newValue) {
    state.filesCollection = newValue
  }
}

const actions = {
  fetchMedia: createStandardAjax({
    isLoadingState: 'isLoading',
    responseState: 'ajaxResponse',
    errorBagState: 'errorBag',
    swagger: {
      config: portalConfig.api.dataAggregation,
      tag: 'WallPostAggregation',
      operationId: 'ApiV1DataAggregationMediaByGlobalIdLatest_mediaGet'
    },
    params: {
      'globalId': 'globalId',
      'pageOffset': 'pageOffset',
      'pageLimit': 'pageLimit'
    },
    onSuccess ({state, commit}, payload) {
      commit('pushFiles', state.ajaxResponse.results)
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
