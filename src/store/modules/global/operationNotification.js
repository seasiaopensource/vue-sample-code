import createId from '@/etc/createId'
import { addProp } from '@/store/helpers/helpers'
import _ from 'lodash'

// to create a new operationNotification only do
// dispatch('operationNotification/create', {title: 'foo', type: 'SUCCESS', message: 'bar'})
// all other things will be handled for you

const maxNotifications = {
  xl: 5,
  lg: 5,
  md: 5,
  sm: 1,
  xs: 1
}

const notificationDuration = 7000 // in milliseconds

export const operationNotificationTypes = {
  success: 'SUCCESS',
  error: 'ERROR',
  warning: 'WARNING',
  info: 'INFO'
}

const notificationModel = {
  title: {
    required: true
  },
  type: {
    required: true,
    valueCheck: (value) => _.includes(operationNotificationTypes, value)
  },
  message: {
  }
}

function closeAfterTimeout ({dispatch}, notificationId) {
  dispatch('close', notificationId)
}

const isValid = (data) => {
  _.each(notificationModel, (conditions, name) => {
    // check, if required data is there
    if (conditions.required) {
      if (!data[name]) {
        throw new Error(`[operationNotification] Cannot create operationNotification: ${name} is missing`)
      }
    }

    // check, if valueCheck is ok
    if (conditions.valueCheck) {
      if (!conditions.valueCheck(data[name])) {
        throw new Error(`[operationNotification] Cannot create operationNotification: The value '${data[name]}' is not an allowed '${name}'.`)
      }
    }
  })

  // we are fine here
  return true
}

const namespaced = true

const initialState = () => {
  return {
    notifications: {},
    notificationOrder: []
  }
}

const getters = {
  notifications: (state) => state.notifications,
  notificationOrder: (state) => state.notificationOrder,

  // returns an ordered array of all notification where visible: true
  showingNotifications: (state) => {
    let orderedNotifications = _.map(state.notificationOrder, (id) => _.cloneDeep(state.notifications[id]))
    let filteredNotifications = _.filter(orderedNotifications, 'visible')
    return filteredNotifications
  },
  // returns an ordered array of all notification where visible: false
  hidingNotifications: (state) => {
    let orderedNotifications = _.map(state.notificationOrder, (id) => _.cloneDeep(state.notifications[id]))
    let filteredNotifications = _.filter(orderedNotifications, {visible: false})
    return filteredNotifications
  }
}

const mutations = {
  addNotification: (state, {notificationId, notificationObject}) => {
    state.notifications = addProp(state.notifications, notificationId, notificationObject)
    state.notificationOrder.push(notificationId)
  },
  revealNotification: (state, {notificationId, timeoutID}) => {
    let oldNotification = state.notifications[notificationId]
    if (!oldNotification) {
      throw new Error(`[operationNotification] Cannot reveal the notificationId ${notificationId}: ID not found`)
    }
    let newNotification = {
      ...oldNotification,
      visible: true,
      timeoutID
    }
    state.notifications = addProp(state.notifications, notificationId, newNotification)
  },
  hideNotification: (state, notificationId) => {
    let oldNotification = state.notifications[notificationId]
    if (!oldNotification) {
      throw new Error(`[operationNotification] Cannot hide the notificationId ${notificationId}: ID not found`)
    }
    clearTimeout(oldNotification.timeoutID)
    let newNotification = {
      ..._.omit(oldNotification, 'timeoutID'),
      visible: false
    }
    state.notifications = addProp(state.notifications, notificationId, newNotification)
  },
  closeNotification: (state, notificationId) => {
    var filteredNotificationOrder = _.filter(state.notificationOrder, (value) => value !== notificationId)
    state.notificationOrder = filteredNotificationOrder
    var filteredNotifications = _.omit(state.notifications, notificationId)
    state.notifications = filteredNotifications
  }
}

const actions = {

  async create ({ dispatch }, notificationData) {
    // Check, if given data is valid
    isValid(notificationData)

    // create a new hidden notification
    var notificationId = await dispatch('_addHiddenNotification', notificationData)

    // reveal possible notifications
    await dispatch('_revealPossibleNotification')

    // return the notification id, for possible later references
    return notificationId
  },

  async close ({ commit, dispatch }, notificationId) {
    // Close the notification
    commit('closeNotification', notificationId)

    // tell reveal, that it can check for new possible notifications
    dispatch('_revealPossibleNotification')
  },

  _addHiddenNotification ({commit}, notificationData) {
    let notificationId = createId()
    let notificationObject = {
      id: notificationId,
      visible: false,
      data: notificationData
    }
    commit('addNotification', {notificationId, notificationObject})
    return notificationId
  },

  _revealPossibleNotification ({commit, rootGetters, getters, dispatch}) {
    // find out, how many notifications should be able to be displayed
    let currentMaxNotifications = maxNotifications[rootGetters['browser/bootstrapMode']]

    // find out, how many notifications are displayed right now
    let currentShownNotifications = getters.showingNotifications.length

    // calculate the maximum of to be added notification
    var addMax = currentMaxNotifications - currentShownNotifications

    // if we have too much already, hide all needed
    if (addMax < 0) {
      dispatch('_hideNeededNotifications')
      return
    }

    // reveal as many notifications as possible
    var added = 0
    _.each(getters.hidingNotifications, (notification) => {
      if (addMax > added++) {
        let timeoutID = setTimeout(closeAfterTimeout, notificationDuration, {dispatch}, notification.id)
        commit('revealNotification', {notificationId: notification.id, timeoutID})
      }
    })
  },

  _hideNeededNotifications ({commit, rootGetters, getters}) {
    // find out, how many notifications should be able to be displayed
    let currentMaxNotifications = maxNotifications[rootGetters['browser/bootstrapMode']]

    // find out, how many notifications are displayed right now
    let currentShownNotifications = getters.showingNotifications.length

    // calculate, how many should be hidden
    var hideMax = currentShownNotifications - currentMaxNotifications

    // take the reverse order of showing notifications, hide the calculated amount
    let reversedShowingNotification = _.reverse(_.clone(getters.showingNotifications))
    var hidden = 0
    _.each(reversedShowingNotification, ({id}) => {
      if (hideMax > hidden++) {
        commit('hideNotification', id)
      }
    })
  }

}

export default {
  namespaced,
  state: initialState,
  getters,
  actions,
  mutations
}
