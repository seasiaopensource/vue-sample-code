import portalConfig from '@/config'
import { createStandardStore, createStandardAjax } from '@/store/helpers/createStandards'
import i18n from '@/locales/i18n'
import { operationNotificationTypes } from '@/store/modules/global/operationNotification'

const namespaced = true

const standardValues = {
  adhocSettingsAjax: [],
  settingsIsLoading: false
}

const initialState = () => {
  return {
  }
}

const getters = {
}

const mutations = {
}

const actions = {
  fetchAdhocSettings: createStandardAjax({
    responseState: 'adhocSettingsAjax',
    isLoadingState: 'settingsIsLoading',
    swagger: {
      config: portalConfig.api.wallposts,
      tag: 'Adhoc',
      operationId: 'ApiV1AdhocGet_ad_hoc_settings_by_profileGet'
    }
  }),

  createAdhocSetting: createStandardAjax({
    swagger: {
      config: portalConfig.api.wallposts,
      tag: 'Adhoc',
      operationId: 'ApiV1AdhocCreate_ad_hoc_settingsPost'
    },
    params: {
      'Location': { payload: 'location' },
      Distance: { payload: 'distance' },
      Topic: { payload: 'topic' },
      SearchKeywords: { payload: 'searchKeywords' },
      ExcludeKeywords: { payload: 'excludeKeywords' }
    },
    onSuccess: async ({ dispatch }) => {
      await dispatch('fetchAdhocSettings')
      // operation notification displayed when user creates an Adhoc configuration
      dispatch('operationNotification/create',
        {
          title: i18n.t('operationNotifications.adHoc.configurationCreated.title'),
          type: operationNotificationTypes.success,
          message: i18n.t('operationNotifications.adHoc.configurationCreated.message')
        },
        {
          root: true
        }
      )
    }
  }),

  deleteAdhocSetting: createStandardAjax({
    swagger: {
      config: portalConfig.api.wallposts,
      tag: 'Adhoc',
      operationId: 'ApiV1AdhocDelete_ad_hoc_settingsDelete'
    },
    params: {
      Id: { payload: 'id' }
    },
    onSuccess: async ({ dispatch }) => {
      await dispatch('fetchAdhocSettings')
      // operation notification displayed when user deletes an Adhoc configuration
      dispatch('operationNotification/create',
        {
          title: i18n.t('operationNotifications.adHoc.configurationDeleted.title'),
          type: operationNotificationTypes.success,
          message: i18n.t('operationNotifications.adHoc.configurationDeleted.message')
        },
        {
          root: true
        }
      )
    }
  }),

  updateAdhocSetting: createStandardAjax({
    swagger: {
      config: portalConfig.api.wallposts,
      tag: 'Adhoc',
      operationId: 'ApiV1AdhocUpdate_ad_hoc_settingsPut'
    },
    params: {
      Id: { payload: 'id' },
      'Location': { payload: 'location' },
      Distance: { payload: 'distance' },
      Topic: { payload: 'topic' },
      SearchKeywords: { payload: 'searchKeywords' },
      ExcludeKeywords: { payload: 'excludeKeywords' }
    },
    onSuccess: async ({ dispatch }) => {
      await dispatch('fetchAdhocSettings')
      // operation notification displayed when user updates an Adhoc configuration
      dispatch('operationNotification/create',
        {
          title: i18n.t('operationNotifications.adHoc.configurationUpdated.title'),
          type: operationNotificationTypes.success,
          message: i18n.t('operationNotifications.adHoc.configurationUpdated.message')
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
