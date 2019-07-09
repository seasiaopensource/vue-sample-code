import { createStandardStore, createStandardAjax } from '@/store/helpers/createStandards'

import portalConfig from '@/config'
import path from 'path'
import buildUrl from 'build-url'

// namespaced
const namespaced = true

const standardValues = {
  previousProfileId: null,
  profilePictureName: null,
  additionalProfileCreated: false
}

// initial state
const initialState = () => {
  return {
  }
}

// getters
const getters = {
  profilePictureUrl: getters => {
    if (getters.profilePictureName) {
      return buildUrl(portalConfig.api.imgServer, { path: path.join(portalConfig.api.imgPath, getters.profilePictureName), queryParams: { height: 185 } })
    }
    return ''
  }
}

// mutations
const mutations = {}

// actions
const actions = {
  fetchBasicInfo: createStandardAjax({
    swagger: {
      config: portalConfig.api.profile,
      tag: 'Profile',
      operationId: 'ApiV1ProfileGet_profile_basic_info_by_idGet'
    },
    params: {
      profileId: 'previousProfileId'
    },
    onSuccess: ({commit, getters}) => {
      commit('updateProfilePictureName', getters.ajaxResponse.profilePictureName)
    }
  })
}

export default createStandardStore(
  standardValues, {
    namespaced,
    state: initialState,
    getters,
    actions,
    mutations
  }
)
