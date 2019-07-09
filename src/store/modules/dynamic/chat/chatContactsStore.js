import portalConfig from '@/config'
import _ from 'lodash'
import {createStandardStore, createStandardAjax} from '@/store/helpers/createStandards'
import {addProp} from '@/store/helpers/helpers'

const namespaced = true

const onlineStatus = {
  online: 'online',
  offline: 'offline'
}

const standardValues = {
  isContactWindowMinimized: true,
  isLoadingUserStatus: false,
  userStatusAjax: null,
  isLoading: false,
  errorBag: [],
  contactsFromAjax: null,
  onlineUsers: {},
  lastActivities: {},
  lastMessages: {},
  liveMessages: []
}

const initialState = () => {
  return {
  }
}

const getters = {
  hasContacts: state => state.contactsFromAjax && state.contactsFromAjax.itemCount && state.contactsFromAjax.itemCount > 0,
  hasErrors: (state, getters, rootState, rootGetters) => {
    if (rootState['chat']['errorBagSocket'] || state.errorBag && state.errorBag.length) {
      return true
    }
    return false
  }, // eslint-disable-line no-unneeded-ternary
  contacts: (state, getters, rootState, rootGetters) => {
    if (state.contactsFromAjax && state.contactsFromAjax.profileData) {
      return _.map(
        state.contactsFromAjax.profileData,
        profileObject => {
          return {
            profileId: profileObject.profileId,
            name: profileObject.displayName,
            image: profileObject.profilePicture,
            lastMessage: {
              msg: state.lastMessages[profileObject.profileId] !== undefined
                ? state.lastMessages[profileObject.profileId]
                : (rootGetters['chat/threads/lastMessages'][profileObject.chatInfo && profileObject.chatInfo.threadId]) ? rootGetters['chat/threads/lastMessages'][profileObject.chatInfo && profileObject.chatInfo.threadId]['message'] : profileObject.chatInfo && profileObject.chatInfo.message,
              date: state.lastActivities[profileObject.profileId] !== undefined
                ? state.lastActivities[profileObject.profileId]
                : (rootGetters['chat/threads/lastMessages'][profileObject.chatInfo && profileObject.chatInfo.threadId]) ? rootGetters['chat/threads/lastMessages'][profileObject.chatInfo && profileObject.chatInfo.threadId]['createdOn'] : profileObject.chatInfo && profileObject.chatInfo.createdOn || 0
            },
            isOnline: state.onlineUsers[profileObject.profileId] !== undefined
              ? state.onlineUsers[profileObject.profileId] === onlineStatus.online
              : profileObject.onlineStatus,
            unreadMessages:
              rootGetters['chat/threads/unreadMessages'] && rootGetters['chat/threads/unreadMessages'][profileObject.chatInfo && profileObject.chatInfo.threadId] === 0
                ? 0
                : rootGetters['chat/threads/unreadMessages'] && rootGetters['chat/threads/unreadMessages'][profileObject.chatInfo && profileObject.chatInfo.threadId] ||
                (getters.receivedLiveMessages && getters.receivedLiveMessages[profileObject.profileId] || 0) +
                (profileObject.chatInfo && profileObject.chatInfo.noOfUnseenMessages || 0)
          }
        },
      )
    }
  },
  receivedLiveMessages: (state, getters, rootState, rootGetters) => {
    let liveMessagesObject = rootGetters['chat/threads/liveMessages']
    return _.mapValues(liveMessagesObject, (liveMessageArray) => {
      return _.filter(liveMessageArray, (liveMessage) => liveMessage.sentBy !== rootGetters['user/profileId']).length
    })
  },
  isUserOnline: (state) => (profileId) => {
    if (typeof state['onlineUsers'][profileId] !== 'undefined' && state['onlineUsers'][profileId] === onlineStatus.online) {
      return true
    }
    return false
  }
}

const mutations = {
  setUserOnline: (state, profileId) => {
    state.onlineUsers = addProp(state.onlineUsers, profileId, onlineStatus.online)
  },
  setUserOffline: (state, profileId) => {
    state.onlineUsers = addProp(state.onlineUsers, profileId, onlineStatus.offline)
  },
  setUserLastActive: (state, {profileId, timestamp}) => {
    state.lastActivities = addProp(state.lastActivities, profileId, timestamp)
  },
  setUserLastMessage: (state, {profileId, message}) => {
    state.lastMessages = addProp(state.lastMessages, profileId, message)
  }
}

const actions = {

  minimizeContactWindow ({commit}) {
    commit('updateIsContactWindowMinimized', true)
  },

  fetchContacts: createStandardAjax({
    isLoadingState: 'isLoading', // default: isLoading
    responseState: 'contactsFromAjax', // default: ajaxResponse
    errorBagState: 'errorBag', // default: errorBag
    swagger: {
      config: portalConfig.api.dataAggregation,
      tag: 'DataAggregation',
      operationId: 'ApiV1DataAggregationGet_contact_list_by_profile_idGet'
    },
    params: { // default: {}
      'ProfileId': 'user/profileId' // use getter names here. Include '/' to use rootGetters
    },
    noRefetch: true, // default: false
    delay: 0 // default: 0
  }),

  fetchUserStatusInitial: createStandardAjax({
    isLoadingState: 'isLoadingUserStatus', // default: isLoading
    responseState: 'userStatusAjax', // default: ajaxResponse
    errorBagState: 'errorBag', // default: errorBag
    swagger: {
      config: portalConfig.api.chatService,
      tag: 'Chat',
      operationId: 'ApiV1ChatUsersOnline_statusGet'
    },
    params: { // default: {}
      'ProfileIds': {'payload': 'profiles'}
    },
    noRefetch: false, // default: false
    delay: 0, // default: 0
    onSuccess ({commit, state, getters, dispatch}, payload) {
      _.each(getters.userStatusAjax.users, (user) => {
        if (user.isOnline) {
          dispatch('_setUserOnline', {profileId: user.profileId})
        } else {
          dispatch('_setUserOffline', {profileId: user.profileId})
        }
      })
    }
  }),

  async reFetchContacts ({ commit, dispatch }, withProfileId) {
    commit('reset')
    if (withProfileId) {
      await dispatch('chat/threads/reFetchThread', withProfileId, {root: true})
    }
    await dispatch('fetchContacts')
  },

  async openThread ({dispatch, commit}, contact) {
    dispatch('chat/threads/openThread', {withProfileId: contact.profileId}, {root: true})
    commit('chat/threads/makeWindowFirst', contact.profileId, {root: true})
  },

  _setUserOnline: ({commit}, {profileId}) => {
    commit('setUserOnline', profileId)
  },

  _setUserOffline: ({commit}, {profileId}) => {
    commit('setUserOffline', profileId)
  },

  _setUsersLastActive: ({commit}, {profileId, timestamp}) => {
    commit('setUserLastActive', {profileId, timestamp})
  },

  _setUsersLastMessage: ({commit}, {profileId, message}) => {
    // console.log('_setUsersLastMessage')
    commit('setUserLastMessage', {profileId, message})
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
