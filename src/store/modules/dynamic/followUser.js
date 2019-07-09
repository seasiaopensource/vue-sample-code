import portalConfig from '@/config'
import {createStandardStore, createStandardAjax} from '@/store/helpers/createStandards.js'

const namespaced = true

const standardValues = {
  isLoading: false,
  errorBag: [],
  isFollowingLoading: false,
  isFollowingErrorBag: [],
  isFollowingResponse: '',
  isUnFollowLoading: false,
  isUnFollowResponse: ''
}

const state = () => {
  return {}
}

const getters = {
}

const mutations = {
}

const actions = {
  addFollow: createStandardAjax({
    isLoadingState: 'isLoading',
    errorBagState: 'errorBag',
    swagger: {
      config: portalConfig.api.followService,
      tag: 'Follow',
      operationId: 'ApiV1FollowFollow_statesByProfileIdFollowsPost'
    },
    params: {
      'profileId': 'user/profileId',
      'followProfile': { payload: 'followProfile' }
    }
  }),
  addUnFollow: createStandardAjax({
    isLoadingState: 'isUnFollowLoading',
    responseState: 'isUnFollowResponse',
    swagger: {
      config: portalConfig.api.followService,
      tag: 'Follow',
      operationId: 'ApiV1FollowFollow_statesByProfileIdUnfollowsPost'
    },
    params: {
      'profileId': 'user/profileId',
      'unfollowProfile': { payload: 'unfollowProfile' },
      'connected': {payload: 'connected'}
    }
  }),
  isFollowing: createStandardAjax({
    isLoadingState: 'isFollowingLoading',
    errorBagState: 'isFollowingErrorBag',
    responseState: 'isFollowingResponse',
    swagger: {
      config: portalConfig.api.followService,
      tag: 'Follow',
      operationId: 'ApiV1FollowFollow_statesByProfileIdFollowsByFollowedProfileGet'
    },
    params: {
      'profileId': 'user/profileId',
      'followedProfile': { payload: 'followedProfile' }
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
