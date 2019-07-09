import Swagger from 'swagger-client'
import portalConfig from '@/config'

const SwaggerPromise = Swagger(portalConfig.api.identityServer)

const namespaced = true

const state = {
  isLoading: false,
  code: null
}

const getters = {
  isLoading: state => state.isLoading,
  code: state => state.code
}

const mutations = {
  updateIsLoading (state, newValue) { state.isLoading = newValue },
  updateCode (state, newValue) { state.code = newValue }
}

const actions = {
  updateCode ({ commit }, { newValue }) { commit('updateCode', newValue) },

  async submit ({ commit, state }, payload) {
    commit('updateIsLoading', true)
    var client = await SwaggerPromise
    var resp

    // We are using the execute interface here. More Infos:
    // https://github.com/swagger-api/swagger-js#tryitout-executor
    var parameters = {
      'code': state.code,
      'redirectUrl': null
    }
    resp = await client.execute({ operationId: 'ApiV1ActivationConfirm_emailByCodePost', parameters })

    commit('updateIsLoading', false)

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
