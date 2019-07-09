import i18n, {changeLanguage} from '@/locales/i18n'

// namespaced
const namespaced = true

const state = {
  locale: i18n.locale
}

const getters = {
  locale: state => state.locale
}

const mutations = {
  updateLocale (state, { newLocaleValue }) {
    changeLanguage(newLocaleValue)
    state.locale = newLocaleValue
  }
}

const actions = {
  localize ({ commit }, { newLocaleValue }) {
    commit('updateLocale', { newLocaleValue })
  }
}

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
