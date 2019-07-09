import router from '@/router'

import _ from 'lodash'
import Swagger from 'swagger-client'
import hash from 'object-hash'
import delayPromise from 'timeout-as-promise'
import queueCollection from './queueCollection'
import { operationNotificationTypes } from '@/store/modules/global/operationNotification'
import { errorCodes } from '@/etc/userClaims'
import {vueInstance, configInstance} from '@/etc/instances'

class SwaggerConfigCache {
  constructor () {
    this.cache = {}
  }
  // TODO:
  // IsConfigThere Params Config Return Boolean
  async createConfig (config) {
    let configHash = hash.sha1(config)
    let client = await Swagger(config)

    this.cache[configHash] = client
  }

  configExist (hash) {
    return !!this.cache[hash]
  }

  async getConfig (config) {
    let configHash = hash.sha1(config)

    if (this.configExist(configHash)) {
      return this.cache[configHash]
    } else {
      await this.createConfig(config)
      return this.cache[configHash]
    }
  }
}

const swaggerConfigCache = new SwaggerConfigCache()

const additionalStandardValues = {
  isLoading: false,
  errorBag: [],
  ajaxResponse: null,
  ajaxQueue: []
}

const normalize = (standardValues) => {
  if (_.isArray(standardValues)) {
    var resultObj = {}
    _.each(standardValues, (standardValue) => {
      resultObj[standardValue] = null
    })
    return resultObj
  } else if (_.isObject(standardValues)) {
    return standardValues
  }
  console.error('"standardValues" should be an Object or an Array, but got', standardValues)
}

const addAdditionalStandardValues = (standardValuesObj) => {
  return {
    ...additionalStandardValues,
    ...standardValuesObj
  }
}

const cleanUp = (standardValues) => addAdditionalStandardValues(normalize(standardValues))

export const mutationName = (stateName) => 'update' + _.upperFirst(stateName)

export const createStandardState = (standardValues) => {
  let result = cleanUp(standardValues)
  return result
}

export const createStandardGetters = (standardValues) => {
  standardValues = cleanUp(standardValues)
  return _.mapValues(standardValues, (initialValue, getterName) => {
    return (state) => state[getterName]
  })
}

export const createStandardMutations = (standardValues) => {
  standardValues = cleanUp(standardValues)
  var resultObj = {}
  _.each(standardValues, (initialValue, name) => {
    resultObj[mutationName(name)] = (state, newValue) => { state[name] = newValue }
  })
  return resultObj
}

export const mergeStandardIntoStateFunction = (standardValues, stateFunction) => {
  var newStateFunction = () => {
    return _.merge(stateFunction(), createStandardState(standardValues))
  }
  return newStateFunction
}

export const createStandardStore = (standardValues, storeDefinition) => {
  return {
    namespaced: storeDefinition.namespaced,
    state: _.isFunction(storeDefinition.state)
      ? mergeStandardIntoStateFunction(standardValues, storeDefinition.state)
      : {
        ...createStandardState(standardValues),
        ...storeDefinition.state
      },
    getters: {
      ...createStandardGetters(standardValues),
      hasErrors: state => !_.isEmpty(state.errorBag),
      popAjaxQueue: state => _.last(state.ajaxQueue),
      ...storeDefinition.getters
    },
    mutations: {
      ...createStandardMutations(standardValues),
      pushAjaxQueue (state, payload) { state.ajaxQueue.push(payload) },
      popAjaxQueue (state) { state.ajaxQueue.pop() },
      reset (state) { state = Object.assign(state, getInitialState(standardValues, storeDefinition.state)) },
      ...storeDefinition.mutations
    },
    actions: {
      popAjaxQueue ({getters, commit}) {
        let returnValue = getters.popAjaxQueue
        commit('popAjaxQueue')
        return returnValue
      },
      ...storeDefinition.actions
    }
  }
}

export const getInitialState = (standardValues, state) => {
  let returnState = createStandardStore(standardValues, {state}).state
  if (_.isFunction(returnState)) {
    return returnState()
  }
  return returnState
}

export const createStandardAjax = ({isLoadingState, responseState, errorBagState, swagger, params, ajaxQueueAction, noRefetch, delay, onSuccess, debug, faultHandling}) => {
  // Assign default Values
  isLoadingState = isLoadingState || 'isLoading'
  responseState = responseState || 'ajaxResponse'
  errorBagState = errorBagState || 'errorBag'
  params = params || {}
  ajaxQueueAction = ajaxQueueAction || null
  noRefetch = noRefetch || false
  delay = delay || 0
  onSuccess = onSuccess || (() => { return })
  debug = debug || false
  faultHandling = faultHandling || false

  return async (context, payload) => {
    let ajaxFunction = async (context, payload) => {
      var { state, commit, getters, rootGetters, dispatch } = context

      // If is already is loading
      if (getters[isLoadingState]) {
        // If no queue action is given, cancel the request with a warning
        console.warn('calling action [' + swagger.operationId + '] while ' + isLoadingState + ' is still true and no ajaxQueueAction given. Cancelling the request.')
        return
      }

      if (noRefetch) {
        // Don't call me, when I have already data
        if (state[responseState]) {
          console.warn('calling action[' + swagger.operationId + '] with noRefetch = true and having following in ' + responseState + ':', state[responseState], 'Cancelling the request.')
          return
        }
      }

      commit(mutationName(isLoadingState), true)
      // var client = await Swagger(swagger.config)
      var client = await swaggerConfigCache.getConfig(swagger.config)
      var resp
      var response
      try {
        if (delay) {
          debug ? console.log(`[CreateStandardAjaxDebug]\nDelay option is activated. Going to delay for ${delay}ms.`) : null
          await delayPromise(delay)
          debug ? console.log(`[CreateStandardAjaxDebug]\nDone with waiting.`) : null
        }
        let swaggerParams = {
          'Accept-Language': vueInstance.get().$i18n.locale,
          'Authorization': 'Bearer ' + rootGetters['user/accessToken'],
          ..._.mapValues(params, (value) => {
            if (_.isObject(value) && (value.plain || value.plain === 0 || value.plain === '')) {
              return value.plain
            }
            if (_.isObject(value) && (value.payload || value.payload === 0 || value.payload === '')) {
              return payload[value.payload]
            }
            if (_.includes(value, '/')) {
              return rootGetters[value]
            }
            return getters[value]
          })
        }
        debug ? console.log(`[CreateStandardAjaxDebug]\nGoing to call the API:`, `${swagger.tag}.${swagger.operationId}`) : null
        debug ? console.log(`[CreateStandardAjaxDebug]\nwith these params:`, swaggerParams) : null
        resp = await client.execute({ operationId: swagger.operationId, parameters: swaggerParams })
        debug ? console.log(`[CreateStandardAjaxDebug]\nGot this response from swagger:`, resp) : null
        response = resp.obj
        commit(mutationName(errorBagState), [])
        commit(mutationName(responseState), response)
        onSuccess(context, payload, response)
      } catch (err) {
        debug ? console.log(`[CreateStandardAjaxDebug]\nGot this error from swagger:`, err) : null
        debug ? console.log(`[CreateStandardAjaxDebug]\nWith this error.response:`, err && err.response) : null

        // catch token problems
        if (err.status === 401) {
          // if we really have a token problem,...
          var identityServerClient = await swaggerConfigCache.getConfig(configInstance.get().api.identityServer)
          try {
            var parameters = {
              'Authorization': 'Bearer ' + rootGetters['user/accessToken']
            }
            await identityServerClient.execute({
              oprationId: 'ApiV1ClaimsGet_claimsGet',
              parameters
            })
          } catch (e) {
            if (e.status === 401) {
              dispatch('user/updateUser', {}, {root: true})
            }
          }
        }

        // standard error handling
        if (faultHandling) {
          var faults = err.response && err.response.body && err.response.body.faults
          // console.debug(err)
          // console.debug(err.response)
          if (faults && faults.length) {
            _.each(faults, fault => {
              dispatch('operationNotification/create', {title: vueInstance.get().$t('errors.' + errorCodes[fault.errorCode]), type: operationNotificationTypes.error}, {root: true})
            })
          } else {
            dispatch('operationNotification/create', {title: vueInstance.get().$t('errors.unexpected'), type: operationNotificationTypes.error}, {root: true})
          }
        } else {
          if (err.response && err.response.body && err.response.body.errorFields) {
            commit(mutationName(errorBagState), err.response.body.errorFields)
          } else if (err.response && err.response.status === 403) {
            router.replace({name: 'AccessDeniedPage'})
          } else if (err.response && err.response.status !== 500) {
            commit(mutationName(errorBagState), [{'status': err.response.status, 'errorMessage': err.response.body && err.response.body.errorMessage}])
          } else {
            commit(mutationName(errorBagState), [{'errorMessage': vueInstance.get().$t('errors.unexpected')}])
          }
        }
      } finally {
        commit(mutationName(isLoadingState), false)
      }
      return response
    }

    if (ajaxQueueAction) {
      // Put me in the queue, if I have a queue action
      let queue = queueCollection.getQueue(ajaxQueueAction)
      return await queue.add(async () => {
        return await ajaxFunction(context, payload)
      })
    } else {
      return await ajaxFunction(context, payload)
    }
  }
}
