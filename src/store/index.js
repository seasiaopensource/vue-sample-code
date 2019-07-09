import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import user from './modules/global/user'
import additionalProfile from './modules/global/additionalProfile'
import post from './modules/global/post'
import browser from './modules/global/browser'
import operationNotification from './modules/global/operationNotification'
import proxy from './modules/global/proxy'
import globalActions from './global/actions'

import portalConfig from '@/config'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const storeConfig = {
  modules: {
    user,
    additionalProfile,
    browser,
    post,
    operationNotification,
    proxy,
    ...(portalConfig && portalConfig.addons && portalConfig.addons.globalStores)
  },
  plugins: [createPersistedState({
    paths: [
      'user'
    ]
  })],
  strict: debug,
  actions: {
    ...globalActions
  }
}

// console.log(storeConfig)

export default new Vuex.Store(storeConfig)
