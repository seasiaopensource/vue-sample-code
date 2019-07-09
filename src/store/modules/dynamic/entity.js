import _ from 'lodash'
import portalConfig from '@/config'
import {createStandardStore, createStandardAjax} from '@/store/helpers/createStandards.js'

const namespaced = true

const standardValues = {
  entityId: null, // Always remember to assign this parameter as the module is registered.
  records: [],
  wallPostProfiles: {},
  wallPostImages: {}
}

const state = () => {
  return {}
}

const getters = {
}

const mutations = {
}

const actions = {
  fetchEntity: createStandardAjax({
    swagger: {
      config: portalConfig.api.dataAggregation,
      tag: 'EntityAggregation',
      operationId: 'ApiEntityAggregationGetEntityListsPost'
    },
    params: {
      'entityId': 'entityId',
      'pageOffSet': {'payload': 'pageOffSet'},
      'pageLimit': {'payload': 'pageLimit'}
    },
    onSuccess ({commit, getters}, payload) {
      if (getters.ajaxResponse) {
        var results = []
        _.each(getters.ajaxResponse, (value) => {
          if (!value.hasErrors && value.resultCount > 0) {
            switch (value.service) {
              case 'WallPostProfiles': {
                commit('updateWallPostProfiles', _.keyBy(value.results, (record) => record.profileId))
                break
              }
              case 'WallPostImages': {
                commit('updateWallPostImages', _.keyBy(value.results, (record) => record.id))
                break
              }
              default: {
                _.each(value.results, (record) => {
                  results.push(record)
                })
              }
            }
          }
        })
        commit('updateRecords', results)
      }
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
