import Swagger from 'swagger-client'
import portalConfig from '@/config'
import { createStandardStore, createStandardAjax } from '@/store/helpers/createStandards'
import i18n from '@/locales/i18n'
import { operationNotificationTypes } from '@/store/modules/global/operationNotification'

const SwaggerPromise = Swagger(portalConfig.api.matchingService)

const namespaced = true

const standardValues = {
  name: '',
  location: '',
  keywords: [],
  categories: [],
  isNew: false,
  isLoading: false,
  isDeleteLoading: false,
  termActiveStatusResponse: null,
  isLoadingMakeTermActive: false,
  isLoadingMakeTermInActive: false
}

const state = () => {
  return {}
}

const getters = {
  globalId: (state, getters, rootState, rootGetters) => rootGetters['user/profileId']
}

const mutations = {
}

const actions = {
  async createConfiguration ({ commit, state, getters, dispatch, rootGetters }, payload) {
    commit('updateIsLoading', true)
    var client = await SwaggerPromise
    var resp
    try {
      var parameters = {
        'Authorization': 'Bearer ' + rootGetters['user/accessToken'],
        'Accept-Language': 'de',
        'globalId': getters.globalId,
        'request': payload.request
      }
      resp = await client.execute({ operationId: 'ApiV1MatchingEntitiesByGlobalIdSearch_termPost', parameters })
      return resp.obj
    } catch (err) {
      throw err.response
    } finally {
      commit('updateIsLoading', false)
      // operation notification displayed when user creates a matching topic
      dispatch('operationNotification/create',
        {
          title: i18n.t('operationNotifications.matching.topicCreated.title'),
          type: operationNotificationTypes.success,
          message: i18n.t('operationNotifications.matching.topicCreated.message')
        },
        {
          root: true
        }
      )
    }
  },
  async updateConfiguration ({ commit, state, getters, dispatch, rootGetters }, payload) {
    commit('updateIsLoading', true)
    var client = await SwaggerPromise
    var resp

    try {
      var parameters = {
        'Authorization': 'Bearer ' + rootGetters['user/accessToken'],
        'Accept-Language': 'de',
        'globalId': getters.globalId,
        'termId': payload.termId,
        'request': payload.request
      }
      resp = await client.execute({ operationId: 'ApiV1MatchingEntitiesByGlobalIdSearch_termByTermIdPut', parameters })
      return resp.obj
    } catch (err) {
      throw err.response
    } finally {
      commit('updateIsLoading', false)
      // operation notification displayed when user updates a matching topic
      dispatch('operationNotification/create',
        {
          title: i18n.t('operationNotifications.matching.topicUpdated.title'),
          type: operationNotificationTypes.success,
          message: i18n.t('operationNotifications.matching.topicUpdated.message')
        },
        {
          root: true
        }
      )
    }
  },
  async deleteConfiguration ({commit, state, getters, dispatch, rootGetters}, payload) {
    commit('updateIsDeleteLoading', true)
    var client = await SwaggerPromise
    var resp

    try {
      var parameters = {
        'Authorization': 'Bearer ' + rootGetters['user/accessToken'],
        'Accept-Language': 'de',
        'globalId': getters.globalId,
        'termId': payload.termId
      }
      resp = await client.execute({ operationId: 'ApiV1MatchingEntitiesByGlobalIdSearch_termsByTermIdDelete', parameters })
      return resp.obj
    } catch (err) {
      console.log('err', err)
    } finally {
      commit('updateIsDeleteLoading', false)
      // operation notification displayed when user deletes a matching topic
      dispatch('operationNotification/create',
        {
          title: i18n.t('operationNotifications.matching.topicDeleted.title'),
          type: operationNotificationTypes.success,
          message: i18n.t('operationNotifications.matching.topicDeleted.message')
        },
        {
          root: true
        }
      )
    }
  },
  makeTermActive: createStandardAjax({
    responseState: 'termActiveStatusResponse',
    isLoadingState: 'isLoadingMakeTermActive',
    swagger: {
      config: portalConfig.api.matchingService,
      tag: 'Matching',
      operationId: 'ApiV1MatchingEntitiesByGlobalIdMatchesSet_matching_activeByTermIdPost'
    },
    params: {
      'globalId': 'globalId',
      'termId': {'payload': 'termId'}
    }
  }),
  makeTermInActive: createStandardAjax({
    responseState: 'termActiveStatusResponse',
    isLoadingState: 'isLoadingMakeTermInActive',
    swagger: {
      config: portalConfig.api.matchingService,
      tag: 'Matching',
      operationId: 'ApiV1MatchingEntitiesByGlobalIdMatchesSet_matching_inactiveByTermIdPost'
    },
    params: {
      'globalId': 'globalId',
      'termId': {'payload': 'termId'}
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
