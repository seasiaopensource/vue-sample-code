// import _ from 'lodash'
import portalConfig from '@/config'
import {createStandardStore, createStandardAjax} from '@/store/helpers/createStandards.js'

const namespaced = true

const standardValues = {
  globalId: null, // Always remember to assign this parameter as the module is registered.
  isLiked: false
}

const state = () => {
  return {}
}

const getters = {
}

const mutations = {
}

const actions = {
  async likeOrDislikeMe ({ getters, dispatch }) {
    getters.isLiked ? await dispatch('dislikeMe') : await dispatch('likeMe')
    // await dispatch('fetchLike')
  },

  likeMe: createStandardAjax({
    swagger: {
      config: portalConfig.api.likes,
      tag: 'Like',
      operationId: 'ApiV1LikesObjectByGlobalidPost'
    },
    params: {
      'globalid': 'globalId',
      'profileId': 'user/profileId'
    },
    onSuccess: ({commit}) => {
      commit('updateIsLiked', true)
    }
  }),

  dislikeMe: createStandardAjax({
    swagger: {
      config: portalConfig.api.likes,
      tag: 'Like',
      operationId: 'ApiV1LikesObjectByGlobalidDelete'
    },
    params: {
      'globalid': 'globalId',
      'profileid': 'user/profileId'
    },
    onSuccess: ({commit}) => {
      commit('updateIsLiked', false)
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
