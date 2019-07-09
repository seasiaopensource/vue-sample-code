import portalConfig from '@/config'
import { createStandardStore, createStandardAjax } from '@/store/helpers/createStandards'
import i18n from '@/locales/i18n'
import { operationNotificationTypes } from '@/store/modules/global/operationNotification'

const namespaced = true

const standardValues = {
  newEmail: '',
  emailIsSaved: false,
  emailErrorBag: [],

  oldPassword: '',
  newPassword: '',
  passwordIsSaved: false,
  passwordErrorBag: [],

  newLanguage: '',
  languageIsSaved: false,
  languageErrorBag: [],
  isLoadingCancelSubscription: false,
  cancelSubscriptionErrorBag: [],
  subscriptionInfo: [],
  isLoadingGetSubscription: false,

  revokeCancelSubscriptionErrorBag: [],
  isLoadingRevokeCancelSubscription: false

}

const initialState = () => {
  return {
  }
}

const getters = {
  lastSubscriptionDay: state => state.subscriptionInfo && state.subscriptionInfo.startOfNextCycle,
  subscriptionStatus: state => state.subscriptionInfo && state.subscriptionInfo.status,
  subscriptionFee: state => state.subscriptionInfo && state.subscriptionInfo.subscriptionFee && state.subscriptionInfo.subscriptionFee.value,
  subscriptionFeeObj: state => state.subscriptionInfo && state.subscriptionInfo.subscriptionFee,
  subscriptionFeeVat: state => state.subscriptionInfo && state.subscriptionInfo.subscriptionFee && state.subscriptionInfo.subscriptionFee.vat
}

const mutations = {
}

const actions = {
  changeEmail: createStandardAjax({
    errorBagState: 'emailErrorBag',
    swagger: {
      config: portalConfig.api.identityServer,
      tag: 'Manage',
      operationId: 'ApiV1ManageChange_emailPost'
    },
    params: {
      NewEmail: 'newEmail'
    },
    onSuccess: ({ commit, dispatch }) => {
      commit('updateEmailIsSaved', true)
    }
  }),

  changePassword: createStandardAjax({
    errorBagState: 'passwordErrorBag',
    swagger: {
      config: portalConfig.api.identityServer,
      tag: 'Manage',
      operationId: 'ApiV1ManageChange_passwordPost'
    },
    params: {
      OldPassword: 'oldPassword',
      NewPassword: 'newPassword'
    },
    onSuccess: ({ commit }) => {
      commit('updatePasswordIsSaved', true)
    }
  }),

  changeLanguage: createStandardAjax({
    errorBagState: 'languageErrorBag',
    swagger: {
      config: portalConfig.api.identityServer,
      tag: 'Manage',
      operationId: 'ApiV1ManageSet_languagePost'
    },
    params: {
      language: 'newLanguage'
    },
    onSuccess: async ({ commit, dispatch }) => {
      commit('updateLanguageIsSaved', true)
      dispatch('operationNotification/create',
        {
          title: i18n.t('operationNotifications.general.settingsUpdated.title'),
          type: operationNotificationTypes.success,
          message: i18n.t('operationNotifications.general.settingsUpdated.message')
        },
        {
          root: true
        }
      )
      await dispatch('user/updateUser', null, {root: true})
    }
  }),
  getSubscription: createStandardAjax({
    responseState: 'subscriptionInfo',
    isLoadingState: 'isLoadingGetSubscription',
    swagger: {
      config: portalConfig.api.subscriptionService,
      tag: 'Subscriptions',
      operationId: 'GetSubscription'
    }
  }),
  cancelSubscription: createStandardAjax({
    errorBagState: 'cancelSubscriptionErrorBag',
    isLoadingState: 'isLoadingCancelSubscription',
    swagger: {
      config: portalConfig.api.subscriptionService,
      tag: 'Subscriptions',
      operationId: 'CancelSubscription'
    },
    onSuccess: ({ commit, dispatch }) => {
      dispatch('getSubscription')
      dispatch('operationNotification/create',
        {
          title: i18n.t('settings.general.payment.cancelSubscriptionSuccessTitle'),
          type: operationNotificationTypes.success,
          message: i18n.t('settings.general.payment.cancelSubscriptionSuccessDesc')
        },
        {
          root: true
        }
      )
    }
  }),
  revokeCancelSubscription: createStandardAjax({
    errorBagState: 'revokeCancelSubscriptionErrorBag',
    isLoadingState: 'isLoadingRevokeCancelSubscription',
    swagger: {
      config: portalConfig.api.subscriptionService,
      tag: 'Subscriptions',
      operationId: 'RevokeCancellation'
    },
    onSuccess: ({ commit, dispatch }) => {
      dispatch('getSubscription')
      dispatch('operationNotification/create',
        {
          title: i18n.t('settings.general.payment.revokeCanellationSuccessTitle'),
          type: operationNotificationTypes.success,
          message: i18n.t('settings.general.payment.revokeCanellationSuccessDesc')
        },
        {
          root: true
        }
      )
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
