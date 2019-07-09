import _ from 'lodash'
import { getCategoryFromGlobalId } from '@/etc/userClaims'

export const addProp = (stateObj, propName, value) => {
  return _.cloneDeep(Object.assign(stateObj, {[propName]: value}))
}

export const convertMsgNotification = (notificationMsg) => {
  return {
    'threadId': notificationMsg.ContentId,
    'threadName': null,
    'profileId': notificationMsg.SenderProfileId,
    'message': notificationMsg.ContentMessage,
    'hasFiles': false,
    'createdOn': notificationMsg.UtcTimestamp,
    'noOfUnseenMessages': 1,
    'categoryId': getCategoryFromGlobalId(notificationMsg.SenderProfileId),
    'profile': {
      'profileId': notificationMsg.SenderProfileId,
      'displayName': notificationMsg.SenderDisplayNname,
      'profilePictureName': notificationMsg.SenderProfilePicture,
      'coverPictureName': null,
      'profileType': notificationMsg.profileType ? notificationMsg.profileType : ''
    }
  }
}

// filterString = '345-123'
// filterArray = ['345-123', '345-124']
// filterObject = { '345': ['123', '124'] }
/**
 * Filters notifications based on a given filter.
 * @param {Object} notification - The notification, that is checked against the filter.
 * @param {string|string[]|Object|} filter - The filter. Can be defined as
 * following: '345-123' OR ['345-123', '345-124'] OR { '345': ['123', '124'] },
 * where 345 is a categoryId and 123 and 124 is an actionId.
 */
export const isFilteredNotification = (notification, filter) => {
  // format the filter into filterObject, make sure, we have strings
  var filterObject = {}

  // helper methods
  var addToFilterObject = (categoryId, actionId) => {
    categoryId = categoryId.toString()
    actionId = actionId.toString()
    filterObject[categoryId] = filterObject[categoryId] ? _.concat(filterObject[categoryId], actionId) : [actionId]
  }
  var processFilterString = (filterString) => {
    let filterElementSplitArray = _.split(filterString, '-')
    if (!(filterElementSplitArray && filterElementSplitArray.length === 2)) {
      throw new Error(`'${filterString}' is not a valid filter element.`)
    }
    addToFilterObject(filterElementSplitArray[0], filterElementSplitArray[1])
  }

  // filterString
  if (_.isString(filter)) {
    processFilterString(filter)
  }

  // filterArray
  if (_.isArray(filter)) {
    for (let filterElement of filter) {
      // filterArray
      if (_.isString(filterElement)) {
        processFilterString(filterElement)
      }
    }
  }

  // filterObject
  if (_.isPlainObject(filter)) {
    _.each(filter, (actionIds, categoryId) => {
      for (let actionId of actionIds) {
        addToFilterObject(categoryId, actionId)
      }
    })
  }

  // get notification data as strings
  var notificationCategoryId = notification.categoryId && notification.categoryId.toString()
  var notificationActionId = notification.actionId && notification.actionId.toString()

  // check, if the notification is ok with the filter
  return !!(filterObject && filterObject[notificationCategoryId] && _.includes(filterObject[notificationCategoryId], notificationActionId))
}
