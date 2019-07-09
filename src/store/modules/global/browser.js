import {createStandardStore} from '@/store/helpers/createStandards'
import _ from 'lodash'
import moment from '@/etc/moment'

const debug = process.env.NODE_ENV !== 'production'

const nowIntervalUpdateTime = (debug === 'production') ? 1000 : 10000

const namespaced = true

const gridBreakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200
}

const standardValues = {
  windowWidth: 0,
  windowHeight: 0,
  now: moment().unix(),
  intervalId: 0
}

const state = () => {
  return {
    foo: 'bar'
  }
}

const getters = {
  bootstrapMode: (state) => {
    var mode
    _.each(gridBreakpoints, (size, name) => {
      if (state.windowWidth >= size) {
        mode = name
      }
    })
    return mode
  }
}

const actions = {
  startNowInterval ({commit, getters}) {
    console.debug('[startNowInterval] is called')
    if (!getters.intervalId) {
      let intervalId = setInterval(function () {
        commit('updateNow', moment().unix())
      }, nowIntervalUpdateTime)
      console.debug('[startNowInterval] intervalId', intervalId)
      commit('updateIntervalId', intervalId)
    }
  }
}

var store = createStandardStore(
  standardValues, {
    namespaced,
    state,
    getters,
    actions
  }
)

export default store
