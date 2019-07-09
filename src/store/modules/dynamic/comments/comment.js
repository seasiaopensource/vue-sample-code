import Swagger from 'swagger-client'
import portalConfig from '@/config'
import i18n from '@/locales/i18n'
import delay from 'timeout-as-promise'
import store from '@/store'

const SwaggerPromise = Swagger(portalConfig.api.commentService)

const namespaced = true
const constWarningDuration = 6000 // miliseconds

const state = () => {
  return {
    isLoading: false,
    commentText: '',
    globalId: null,
    errorBag: [],
    wallOwnerId: ''
  }
}

const getters = {
  isLoading: state => state.isLoading,
  commentText: state => state.commentText,
  globalId: state => state.globalId,
  errorBag: state => state.errorBag,
  wallOwnerId: state => state.wallOwnerId
}

const mutations = {
  updateIsLoading (state, newValue) { state.isLoading = newValue },
  updateCommentText (state, newValue) { state.commentText = newValue; state.errorBag = [] },
  updateGlobalId (state, newValue) { state.globalId = newValue },
  updateErrorBag (state, newValue) { state.errorBag = newValue },
  updateWallOwnerId (state, newValue) { state.wallOwnerId = newValue }
}

const actions = {
  async createComment ({ commit, dispatch, state, getters, rootGetters }, payload) {
    if (state.commentText.trim() === '') {
      commit('updateErrorBag', [{'errorMessage': i18n.t('wallPosts.emptyCommentTextError')}]) // TO DO: add an "empty field" error message here
      await delay(constWarningDuration)
      commit('updateErrorBag', [])
    } else {
      commit('updateIsLoading', true)

      // Update the Wall Owner ID
      // console.log('[Store] My payload is = ', payload)
      commit('updateWallOwnerId', payload.wallOwnerId)

      var client = await SwaggerPromise
      var resp
      try {
        var parameters = {
          'globalId': state.globalId,
          'CommentText': state.commentText.trim(),
          'OwnerProfileId': rootGetters['user/profileId'], // the current user, who comments
          'Authorization': 'Bearer ' + rootGetters['user/accessToken'],
          'Accept-Language': i18n.locale
        }
        resp = await client.execute({ operationId: 'ApiV1CommentObjectByGlobalIdPost', parameters })
        // console.log('[Store] Create Comment resp: ', resp)

        // reset text in the Add Comment input field
        commit('updateCommentText', '')

        // Prepare user input data for real-time previewing in commentsList store
        var myCommentPreview = {
          'postId': state.globalId,
          'profileId': rootGetters['user/profileId'],
          'authorImage': payload.authorImage,
          'authorName': payload.authorName,
          'commText': resp.obj['comment-text'],
          'commTime': resp.obj.created,
          'commId': resp.obj.commentId,
          'likesNumber': 0
        }
        // console.log('[Comment Store] myCommentPreview: ', myCommentPreview)
        // commit('wall/wall' + '--' + rootGetters['user/profileId'] + '/addCommentPreview', myCommentPreview, { root: true })

        // Send CommentPreview data (user input data in real-time) to commentsList dynamic store
        commit('commentsList/commentsList' + '--' + state.globalId + '/updatePreviewComments', myCommentPreview, { root: true })

        // Update the number of comments by dispatching an action which calculates the new number
        await dispatch('calculateCommentsNumber')
      } catch (e) {
        console.log('Error: ', e)
      } finally {
        commit('updateIsLoading', false)
      }
      return resp
    }
  },
  async calculateCommentsNumber ({ commit, dispatch, state, getters, rootGetters }) {
    // Update the number of comments in real time
    if (store && store.state && store.state.wall && store.state.wall['wall' + '--' + getters.wallOwnerId]) {
      await dispatch('wall/wall' + '--' + getters.wallOwnerId + '/processOnTheFlyCommentsNumber', state.globalId, { root: true })
    }
    if (store && store.state && store.state.userFeed && store.state.userFeed['userFeed' + '--' + rootGetters['user/profileId']]) {
      await dispatch('userFeed/userFeed' + '--' + rootGetters['user/profileId'] + '/processOnTheFlyCommentsNumber', state.globalId, { root: true })
    }
    if (store && store.state && store.state['singlePost']) {
      await dispatch('singlePost/processOnTheFlyCommentsNumber', state.globalId, { root: true })
    }

    // Reset the Wall Owner Id state, to take everytime the correct one
    // commit('updateWallOwnerId', '')
  }
}

export default {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
