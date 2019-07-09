import _ from 'lodash'
import router from '@/router'
import oidcUserManager from '@/etc/oidcUserManager'
import i18n from '@/locales/i18n'
import { CompanyAccountType, PersonAccountType, PersonBusinessProfileCategoryId, getCategoryFromGlobalId } from '@/etc/userClaims'
import { createStandardStore, createStandardAjax } from '@/store/helpers/createStandards'
import delay from 'timeout-as-promise'
import { operationNotificationTypes } from '@/store/modules/global/operationNotification'
import jwt from 'jsonwebtoken'
import moment from '@/etc/moment'

import Swagger from 'swagger-client'
import portalConfig from '@/config'

const SwaggerPromise = Swagger(portalConfig.api.identityServer)
const ProfileSwaggerPromise = Swagger(portalConfig.api.profile)

// namespaced
const namespaced = true

const standardValues = {
  initialSigninSilentDone: false,
  shopAjax: null,
  shopIsLoading: false,
  user: null,
  isLoading: false,
  isLoggingOut: false,
  userAddress: [],
  showPopup: false,
  deleteAccountPermanentlyAjax: null,
  deleteAccountAjax: null,
  deleteProfilePermanentlyAjax: null,
  deleteProfileAjax: null,
  deleteAccountErrorBag: [],
  deleteAccountPermanentlyErrorBag: [],
  deleteProfileErrorBag: [],
  deleteProfilePermanentlyErrorBag: [],

  isLoadingDeleteAccount: false,
  isLoadingDeleteAccountPermanentlyState: false,

  isLoadingDeleteProfile: false,
  isLoadingDeleteProfilePermanently: false,

  isLoadingSendInvite: false,
  sendInviteErrorBag: [],

  isLoadingLogError: false,
  logErrorResponse: null,
  logErrorBag: [],

  isLoadingChangeLanguage: false,
  changeLanguageResponse: '',
  languageErrorBag: [],

  isLoadingFetchSubscription: false,
  fetchSubscriptionErrorBag: [],
  fetchSubscriptionResponse: '',
  paymentResponseBag: [],
  isGracePeriodAcknowledged: false
}

// initial state
const initialState = () => {
  return {
  }
}

// getters
const getters = {
  user: state => state.user,
  isLoading: state => state.isLoading || state.isLoggingOut,
  address: state => state.userAddress,
  isLoaded: state => state.isLoaded,
  isLoggedIn: (state, getters, rootState, rootGetters) => {
    if (state.user && state.user.expires_at) {
      return state.user && state.user.expires_at > rootGetters['browser/now']
    } else {
      return false
    }
  },
  isLoggedInViaAccessToken: state => state.user && !!state.user.isLoggedInViaAccessToken,
  email: state => state.user && state.user.profile && state.user.profile.email,
  accessToken: state => state.user && state.user.access_token,
  isCompany: state => state.user && state.user.profile && state.user.profile.AccountType === CompanyAccountType.toString(),
  isPerson: state => state.user && state.user.profile && state.user.profile.AccountType === PersonAccountType.toString(),
  hasProfile: state => state.user && state.user.profile && state.user.profile.Profile,
  isCurrentBusinessProfile: (state, getters) => getters.profileCategoryId && getters.profileCategoryId === PersonBusinessProfileCategoryId,
  hasMultipleProfiles: state => state.user && state.user.profile && _.isArray(state.user.profile.Profile),
  fullProfileId: state => state.user && state.user.profile && state.user.profile.CurrentProfile && state.user.profile.CurrentProfile,
  profileId: state => state.user && state.user.profile && state.user.profile.CurrentProfile,
  userProfileId: (state, getters) => getters.profileId,
  profileCategoryId: (state, getters) => getters.profileId && getCategoryFromGlobalId(getters.profileId),
  canCreateAdditionalProfile: (state, getters) => !getters.isCompany && !getters.hasMultipleProfiles,
  shopId: (state, getters) => getters.shopAjax && getters.shopAjax[0] && getters.shopAjax[0].shopId,
  hasShop: (state, getters) => !!getters.shopId,
  userLanguage: (state, getters) => getters.user && getters.user.profile && getters.user.profile.UserLanguage ? getters.user.profile.UserLanguage : navigator.language.substr(0, 2),
  accountId: (state, getters) => getters.user && getters.user.profile && getters.user.profile.AccountId,
  subscription: (state, getters) => getters.fetchSubscriptionResponse,
  subscriptionStatus: (state, getters) => getters.fetchSubscriptionResponse && getters.fetchSubscriptionResponse.status,
  cardInformation: (state, getters) => getters.fetchSubscriptionResponse && getters.fetchSubscriptionResponse.registerationInformation,
  lastSubscription: (state, getters) => getters.fetchSubscriptionResponse && getters.fetchSubscriptionResponse.subscriptionFee
}

// mutations
const mutations = {
  updateIsLoaded (state, isLoaded) {
    state.isLoaded = isLoaded
  },
  updateIsLoggingOut (state, isLoggingOut) {
    state.isLoggingOut = isLoggingOut
  },
  updateUserAddress (state, newValue) { state.userAddress = newValue }
}

// actions
const actions = {
  async updateCurrentProfileIdAndLog ({ commit, getters, rootGetters, dispatch }, payload) {
    var switchProfile = {
      profileId: payload,
      api: {
        ApiV1ClaimsCurrent_profilePost: {
          success: '',
          response: ''
        },
        signInSilent: {
          success: '',
          response: ''
        }
      }
    }
    localStorage.setItem('switchProfile', JSON.stringify(switchProfile))
    await dispatch('updateCurrentProfileId', payload)
  },
  async updateCurrentProfileId ({ commit, getters, rootGetters, dispatch }, profileId) {
    var client = await SwaggerPromise
    // console.log(client)
    try {
      commit('updateIsLoading', true)
      var parameters = {
        'currentProfile': profileId,
        'Accept-Language': i18n.locale,
        'Authorization': 'Bearer ' + getters['accessToken']
      }
      var data = await client.execute({ operationId: 'ApiV1ClaimsCurrent_profilePost', parameters })
      await dispatch('updateUser')
      if (!localStorage.oidcNoPopup) {
        commit('updateIsLoading', true)
        location.reload()
        return
      }
      commit('updateIsLoading', false)
    } catch (e) {
      console.error(e)
      await dispatch('logSwitchProfileResponse', {step: 'ApiV1ClaimsCurrent_profilePost', success: false, response: e.response || e, log: true, removeAndNotify: true})
      commit('updateIsLoading', false)
    }
    return data
  },

  logSwitchProfileResponse ({ commit, getters, rootGetters, dispatch }, payload) {
    var switchProfile = localStorage.getItem('switchProfile')
    if (switchProfile) {
      var switchProfileJson = JSON.parse(switchProfile)
      switchProfileJson.api[payload.step]['success'] = payload.success
      switchProfileJson.api[payload.step]['response'] = payload.response

      var switchProfileString = JSON.stringify(switchProfileJson)
      localStorage.setItem('switchProfile', switchProfileString)

      if (payload.log) {
        dispatch('logError', {
          categoryId: '1000',
          actionId: '1',
          contentId: 'N/A',
          subject: '[Frontend] Switch Profile',
          content: {
            'time-stamp': moment().unix(),
            'user-id': 0,
            'message': switchProfileString
          }
        })
      }

      if (payload.removeAndNotify) {
        dispatch(
          'operationNotification/create',
          {
            title: i18n.t('errors.switchProfileFailed.title'),
            type: operationNotificationTypes.error,
            message: i18n.t('errors.switchProfileFailed.message')
          },
          {root: true}
        )
        localStorage.removeItem('switchProfile')
      }
    }
  },

  checkForSwitchedProfiles ({ commit, getters, rootGetters, dispatch }, payload) {
    var switchProfile = localStorage.getItem('switchProfile')
    if (switchProfile) {
      var switchProfileJson = JSON.parse(switchProfile)
      if (switchProfileJson.profileId !== getters.profileId) {
        switchProfileJson.message = 'This check was made after the profiles were switched'
        dispatch(
          'operationNotification/create',
          {
            title: i18n.t('errors.switchProfileFailed.title'),
            type: operationNotificationTypes.error,
            message: i18n.t('errors.switchProfileFailed.message')
          },
          {root: true}
        )
        dispatch('logError', {
          categoryId: '1000',
          actionId: '1',
          contentId: 'N/A',
          subject: '[Frontend] Switch Profile',
          content: {
            'time-stamp': moment().unix(),
            'user-id': 0,
            'message': JSON.stringify(switchProfileJson)
          }
        })
      }
      localStorage.removeItem('switchProfile')
    }
  },

  logError: createStandardAjax({
    isLoadingState: 'isLoadingLogError',
    responseState: 'logErrorResponse',
    errorBagState: 'logErrorBag',
    swagger: {
      config: portalConfig.api.loggingService,
      tag: 'Logging',
      operationId: 'ApiV1LoggingErrorPost'
    },
    params: {
      categoryId: {'payload': 'categoryId'},
      actionId: {'payload': 'actionId'},
      contentId: {'payload': 'contentId'},
      subject: {'payload': 'subject'},
      content: {'payload': 'content'}
    }
  }),

  async onSilentRenewError ({ commit, dispatch }) {
    // show the warning
    dispatch('operationNotification/create', {
      title: i18n.t('errors.userSessionUpdateFailed.title1'),
      type: operationNotificationTypes.warning,
      message: i18n.t('errors.userSessionUpdateFailed.message1')
    }, {root: true})

    // wait
    await delay(50 * 1000) // = 50 secs

    // rewarn
    dispatch('operationNotification/create', {
      title: i18n.t('errors.userSessionUpdateFailed.title2'),
      type: operationNotificationTypes.warning,
      message: i18n.t('errors.userSessionUpdateFailed.message2')
    }, {root: true})

    // wait
    await delay(10 * 1000) // = 10 secs

    // try to updateUser
    dispatch('updateUser')
  },

  async updateUser ({ commit, dispatch }) {
    commit('updateIsLoading', true)
    try {
      var response = await oidcUserManager.signinSilent()
      await dispatch('logSwitchProfileResponse', {step: 'signInSilent', success: true, response})
    } catch (e) {
      console.error('signinSilent failed:')
      console.error(e)
      await dispatch('logSwitchProfileResponse', {step: 'signInSilent', success: false, response: e.response || e, log: true})
      // commit('updateUser', null)
      await dispatch('login', {noPopup: true})
    } finally {
      commit('updateIsLoading', false)
    }
    // We are handling the changes to the user in `etc/oidcUserManager.js`
  },

  // tries a signIn Silent, if we are not logged in
  async initialSigninSilent ({ commit, dispatch, getters }) {
    commit('updateInitialSigninSilentDone', false)
    try {
      if (!getters.isLoggedIn) {
        console.debug('[initialSigninSilent] user is not logged in, trying silent login...')
        // commit('updateIsLoading', true)
        await oidcUserManager.signinSilent()
        console.debug('[initialSigninSilent] silent login successful')
      }
    } catch (e) {
      console.error('[initialSigninSilent] initialSigninSilent failed:')
      console.error('[initialSigninSilent]', e)
    } finally {
      console.debug('[initialSigninSilent] initialSigninSilent finishing...')
      commit('updateIsLoading', false)
      commit('updateInitialSigninSilentDone', true)
    }
  },

  async login ({ commit, dispatch, state, getters }, payload) {
    var noPopup = payload && payload.noPopup || false
    if (noPopup) {
      localStorage.oidcNoPopup = true
      await oidcUserManager.signinRedirect({ ui_locales: i18n.locale })
    } else {
      localStorage.removeItem('oidcNoPopup')
      await oidcUserManager.signinPopup({ ui_locales: i18n.locale })
    }

    // We are handling the changes to the user in `etc/oidcUserManager.js`

    // Additional things to check, if we already have a profileId
    if (getters.hasProfile) {
      // If we don't have a currentProfileId, create one
      if (!(state.user && state.user.profile && state.user.profile.CurrentProfile)) {
        await dispatch(
          'updateCurrentProfileId',
          _.isArray(state.user.profile.Profile)
            ? state.user.profile.Profile[0]
            : state.user.profile.Profile
        )
      }
    }
  },

  async logout ({ commit, getters }, payload) {
    var noPopup = payload && payload.noPopup || false
    commit('updateIsLoading', true)
    commit('updateIsLoggingOut', true)
    commit('updateIsGracePeriodAcknowledged', false)
    // We are handling the changes to the user in `etc/oidcUserManager.js`
    // documentation: https://github.com/IdentityModel/oidc-client-js/wiki
    try {
      if (noPopup) {
        localStorage.oidcNoPopup = true
        await oidcUserManager.signoutRedirect()
      } else {
        localStorage.removeItem('oidcNoPopup')
        await oidcUserManager.signoutPopup()
      }
    } catch (e) {
      console.error(e)
    } finally {
      commit('reset')
      commit('updateIsLoading', false)
      // commit('updateIsLoggingOut', false)
      router.push({name: 'externalArea'})
    }
  },
  makeLogoutChanges ({ commit, getters }) {
    commit('updateIsLoggingOut', false)
  },
  checkAndFetchShop ({getters, dispatch}) {
    if (getters.isCompany) {
      dispatch('fetchShopData')
    }
  },
  fetchShopData: createStandardAjax({
    isLoadingState: 'shopIsLoading',
    responseState: 'shopAjax',
    ajaxQueueAction: 'fetchShopData',
    swagger: {
      config: portalConfig.api.shopService,
      tag: 'ShopsApi',
      operationId: 'GetShopByOwnerId'
    },
    params: {
      ownerId: 'profileId'
    }
  }),

  loginViaAccessToken: async ({dispatch, commit, state, rootGetters}, {accessToken}) => {
    var decodedAccessToken = jwt.decode(accessToken)
    let user = {
      access_token: accessToken,
      profile: decodedAccessToken,
      expires_at: decodedAccessToken.exp,
      isLoggedInViaAccessToken: true
    }
    commit('updateUser', user)
    return user
  },

  fetchUserAddress: async ({dispatch, commit, state, getters, rootGetters}) => {
    var client = await ProfileSwaggerPromise
    var parameters = {
      'Authorization': 'Bearer ' + rootGetters['user/accessToken'],
      'profileId': getters.profileId
    }
    var resp = await client.execute({ operationId: 'ApiV1ProfileGet_detailed_profile_dataGet', parameters })
    if (resp.obj) {
      commit('updateUserAddress', resp.obj)
    }
  },
  async refreshProfileInfo ({rootState, getters, dispatch}) {
    if (rootState['navigation/navigationUserBox']) {
      await dispatch('navigation/navigationUserBox/fetchData', null, { root: true })
    }
    if (rootState.profileInfo && rootState.profileInfo[ 'profileInfo--' + getters.profileId ]) {
      await dispatch('profileInfo/profileInfo--' + getters.profileId + '/fetchProfileInfo', { profileId: getters.profileId }, { root: true })
    }
    if (rootState.profileInfoShort && rootState.profileInfoShort[ 'profileInfoShort--' + getters.profileId ]) {
      await dispatch('profileInfoShort/profileInfoShort--' + getters.profileId + '/fetchProfileInfoShort', { profileId: getters.profileId }, { root: true })
    }
  },
  deleteAccountPermanently: createStandardAjax({
    isLoadingState: 'isLoadingDeleteAccountPermanentlyState',
    responseState: 'deleteAccountPermanentlyAjax',
    errorBagState: 'deleteAccountPermanentlyErrorBag',
    swagger: {
      config: portalConfig.api.identityServer,
      tag: 'Manage',
      operationId: 'ApiV1ManageDelete_account_permanentlyDelete'
    },
    params: {
      accountId: 'accountId'
    }
  }),
  deleteAccount: createStandardAjax({
    isLoadingState: 'isLoadingDeleteAccount',
    responseState: 'deleteAccountAjax',
    errorBagState: 'deleteAccountErrorBag',
    swagger: {
      config: portalConfig.api.identityServer,
      tag: 'Manage',
      operationId: 'ApiV1ManageDelete_accountDelete'
    }
  }),
  deleteProfile: createStandardAjax({
    isLoadingState: 'isLoadingDeleteProfile',
    responseState: 'deleteProfileAjax',
    errorBagState: 'deleteProfileErrorBag',
    swagger: {
      config: portalConfig.api.profile,
      tag: 'Profile',
      operationId: 'ApiV1ProfileDelete_profileDelete'
    },
    params: {
      profileId: 'userProfileId'
    }
  }),
  deleteProfilePermanently: createStandardAjax({
    isLoadingState: 'isLoadingDeleteProfilePermanently',
    responseState: 'deleteProfilePermanentlyAjax',
    errorBagState: 'deleteProfilePermanentlyErrorBag',
    swagger: {
      config: portalConfig.api.profile,
      tag: 'Profile',
      operationId: 'ApiV1ProfileDelete_profile_permanentlyDelete'
    },
    params: {
      profileId: 'userProfileId'
    }
  }),
  sendInvite: createStandardAjax({
    isLoadingState: 'isLoadingSendInvite',
    errorBagState: 'sendInviteErrorBag',
    swagger: {
      config: portalConfig.api.InvitationServiceApi,
      tag: 'InvitationService',
      operationId: 'CreateInvitation'
    },
    params: {
      'body': {'payload': 'body'}
    }
  }),
  changeLanguage: createStandardAjax({
    isLoadingState: 'isLoadingChangeLanguage',
    errorBagState: 'languageErrorBag',
    responseState: 'changeLanguageResponse',
    swagger: {
      config: portalConfig.api.identityServer,
      tag: 'Manage',
      operationId: 'ApiV1ManageSet_languagePost'
    },
    params: {
      language: {payload: 'newLanguage'}
    },
    onSuccess: async ({ commit, dispatch }) => {
      await dispatch('updateUser')
    }
  }),
  fetchSubscription: createStandardAjax({
    isLoadingState: 'isLoadingFetchSubscription',
    errorBagState: 'fetchSubscriptionErrorBag',
    responseState: 'fetchSubscriptionResponse',
    swagger: {
      config: portalConfig.api.subscriptionService,
      tag: 'Subscriptions',
      operationId: 'GetSubscription'
    }
  }),
  acknowledgeGracePeriod ({ commit }, payload) {
    commit('updateIsGracePeriodAcknowledged', payload)
  }
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
