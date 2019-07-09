import store from '@/store'
import registerSubmodule from '@/store/helpers/registerSubmodule'
import groupInfoStore from '@/store/modules/dynamic/groups/info'
import { queify } from '@/etc/queueCollection'

const storeNamespace = 'groupInfo'

const registerGroupInfoStore = (groupId) => {
  registerSubmodule({module: groupInfoStore, namespace: storeNamespace, slug: groupId})
  store.commit(storeNamespace + '/' + storeNamespace + '--' + groupId + '/updateGlobalId', groupId)
}

export const isCurrentUserGroupMember = queify(async (groupId) => {
  // create the groupInfo store, if it doesn't exist
  registerGroupInfoStore(groupId)

  // Perform the lazyLoadAction
  return await store.dispatch(`groupInfo/groupInfo--${groupId}/lazyCheckIfCurrentUserIsGroupMember`)
})

export const isCurrentUserAdminOrModerator = queify(async (groupId) => {
  // create the groupInfo store, if it doesn't exist
  registerGroupInfoStore(groupId)

  // Perform the lazyLoadAction
  return await store.dispatch(`groupInfo/groupInfo--${groupId}/lazyCheckIfCurrentUserIsAdminOrModerator`)
})
