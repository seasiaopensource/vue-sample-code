import i18n from '@/locales/i18n'
import Swagger from 'swagger-client'
import portalConfig from '@/config'

const SwaggerPromise = Swagger(portalConfig.api.identityServer)

const namespaced = true

const state = {
  isLoading: false,
  code: null,
  email: null,
  password: null,
  showResult: false
}

const getters = {
  isLoading: state => state.isLoading,
  showResult: state => state.showResult,
  code: state => state.code,
  email: state => state.email,
  password: state => state.password
}

const mutations = {
  updateIsLoading (state, newValue) { state.isLoading = newValue },
  updateShowResult (state, newValue) { state.showResult = newValue },
  updateCode (state, newValue) { state.code = newValue },
  updateEmail (state, newValue) { state.email = newValue },
  updatePassword (state, newValue) { state.password = newValue }
}

const actions = {
  updateCode ({ commit }, { newValue }) { commit('updateCode', newValue) },
  updateEmail ({ commit }, { newValue }) { commit('updateEmail', newValue) },
  updatePassword ({ commit }, { newValue }) { commit('updatePassword', newValue) },
  updateShowResult ({ commit }, { newValue }) { commit('updateShowResult', newValue) },

  async submit ({ commit, state }, payload) {
    commit('updateIsLoading', true)
    var client = await SwaggerPromise
    var resp

    try {
      // We are using the execute interface here. More Infos:
      // https://github.com/swagger-api/swagger-js#tryitout-executor
      var parameters = {
        'Code': state.code,
        'Email': state.email,
        'Password': state.password,
        'ConfirmPassword': state.password,
        'Accept-Language': i18n.locale
      }
      resp = await client.execute({ operationId: 'ApiV1AccountReset_passwordPost', parameters })
    } catch (e) {
      throw e
    } finally {
      commit('updateIsLoading', false)
    }

    return resp
  }
}
export default {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
