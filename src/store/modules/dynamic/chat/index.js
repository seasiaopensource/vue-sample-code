import {createStandardStore} from '@/store/helpers/createStandards'
import {signalrChatConnection} from '@/etc/chat'
import _ from 'lodash'

var makePropsCamelCase = (obj) => _.mapKeys(obj, (value, key) => _.camelCase(key))

const namespaced = true

const standardValues = {
  errorBagSocket: false
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
  async init (context) {
    // moved the init of live chat to `etc/chat.js`
    signalrChatConnection.init()
  },
  async _onDisconnected ({commit}, payload) {
    commit('updateErrorBagSocket', payload)
  },
  async _onSetUsersOnline ({dispatch}, users) {
    console.debug('[chat] _onSetUsersOnline:', users)
    _.each(users, (user) => {
      dispatch('chat/contacts/_setUserOnline', {profileId: user.profileId}, {root: true})
    })
  },
  async _onUsersJoined ({dispatch}, user) {
    console.debug('[chat] _onUsersJoined:', user)
    dispatch('chat/contacts/_setUserOnline', {profileId: user.profileId}, {root: true})
  },
  async _onUsersLeft ({dispatch}, user) {
    console.debug('[chat] _onUsersLeft:', user)
    dispatch('chat/contacts/_setUserOffline', {profileId: user.profileId}, {root: true})
  },
  async _onSend ({commit, dispatch, rootGetters}, payload) {
    console.debug('[chat] _onSend:', payload)

    var camelCasePayload = makePropsCamelCase(payload)

    // We want to get chat messages for the current profile
    // (this check is done for accounts which have 2 profiles: personal and business).
    if (camelCasePayload.sentTo.toString() === rootGetters['user/profileId'].toString()) {
      dispatch('chat/threads/_onMessageSend', payload, {root: true})
      dispatch(
        'chat/contacts/_setUsersLastActive',
        {profileId: payload.sentBy, timestamp: payload.createdOn},
        {root: true}
      )
      dispatch(
        'chat/contacts/_setUsersLastMessage',
        {profileId: payload.sentBy, message: payload.message},
        {root: true}
      )
    }
  },
  async _send ({commit, getters}, {threadId, message}) {
    console.debug('[chat] _send:', {threadId, message})
    signalrChatConnection.connection.sendMessage(threadId, message)
  },

  minimizeAllWindows ({dispatch}) {
    dispatch('chat/threads/minimizeAll', {}, {root: true})
    dispatch('chat/contacts/minimizeContactWindow', {}, {root: true})
  }
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
