import portalConfig from '@/config'
import {createStandardStore, createStandardAjax} from '@/store/helpers/createStandards'

const namespaced = true

const standardValues = {
}

const state = () => {
  return {
  }
}

const getters = {
}

const mutations = {
}

const actions = {
  corsProxy: createStandardAjax({
    ajaxQueueAction: 'corsProxy',
    swagger: {
      config: portalConfig.api.proxyService,
      tag: 'Proxy',
      operationId: 'ApiV1ProxyCors_proxyGet'
    },
    params: {
      url: { payload: 'url' }
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
