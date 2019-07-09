// import DefaultAvatar from '@/assets/img/users.svg'
import { getCategoryFromGlobalId, roleAdministrator, roleModerator } from '@/etc/userClaims'
// import i18n from '@/locales/i18n.js'
import _ from 'lodash'

export const groupsCollectionTransformToCard = (info) => {
  var possibleActions = []
  if (info.actionType === 'leave') {
    possibleActions.push('leave')
  }
  return _.map(info.groups, (value, index) => {
    return {
      link: {name: 'groupOverview', params: {groupId: value.id}},
      imageName: value.profilePictureName,
      heading: value.groupName,
      description: {'trans': 'group.members', 'plural': true, 'params': {'count': value.members}},
      suffixIcon: value.isClosed ? 'lock' : 'lock-open',
      possibleActions,
      categoryId: getCategoryFromGlobalId(value.id),
      _original: value
    }
  })
}

export const groupsTransformToCard = (value, index, collection) => {
  return {
    link: {name: 'groupOverview', params: {groupId: value.id}},
    imageName: value.profilePictureName,
    heading: value.groupName,
    description: {'trans': 'group.members', 'plural': true, 'params': {'count': value.members}},
    suffixIcon: value.isClosed ? 'lock' : 'lock-open',
    possibleActions: [],
    categoryId: getCategoryFromGlobalId(value.id),
    _original: value
  }
}

export const profileGroupsMemberTransformToCard = (groupInfo) => {
  var possibleActions = []
  var usrPossibleIcon = []
  if (groupInfo.actionType === 'members') {
    possibleActions.push('remove')
    usrPossibleIcon.push('times')
  }
  if (groupInfo.actionType === 'sent') {
    possibleActions.push('cancel')
    usrPossibleIcon.push('times')
  }
  if (groupInfo.actionType === 'recieved') {
    possibleActions.push('accept', 'decline')
    usrPossibleIcon.push('check', 'times')
  }
  return _.map(groupInfo.groups, (value, index) => {
    return {
      link: {name: 'groupOverview', params: {groupId: value.id}},
      imageName: value.profilePictureName,
      heading: value.groupName,
      description: {'trans': 'group.members', 'plural': true, 'params': {'count': value.members}},
      possibleActions: possibleActions,
      possibleIcon: usrPossibleIcon,
      categoryId: getCategoryFromGlobalId(value.id),
      _original: value
    }
  })
}
export const groupsMemberTransformToCard = (groupInfo) => {
  var possibleActions = []
  var usrPossibleIcon = []
  if (groupInfo.connectionStatus === 'connected' && groupInfo.profileRole === roleAdministrator || groupInfo.profileRole === roleModerator) {
    possibleActions.push('remove')
    usrPossibleIcon.push('times')
  }
  if (groupInfo.connectionStatus === 'sent') {
    if ((typeof groupInfo.isClosed === 'undefined' || groupInfo.isClosed) && groupInfo.profileRole === roleAdministrator) {
      possibleActions.push('cancel')
      usrPossibleIcon.push('times')
    } else {
      possibleActions.push('cancel')
      usrPossibleIcon.push('times')
    }
  }
  if (groupInfo.connectionStatus === 'recieved' && groupInfo.profileRole === roleAdministrator) {
    possibleActions.push('accept', 'decline')
    usrPossibleIcon.push('check', 'times')
  }
  return _.map(groupInfo.lstMembers, (value, index) => {
    return {
      link: { name: 'profileOverview', params: { profileId: value.profileId } },
      imageName: value.profilePicture,
      heading: value.displayName,
      description: {'trans': 'network.' + value.profileType, 'plural': false, params: {}},
      possibleActions: (groupInfo.profileId === value.profileId || value.isAdmin) ? [] : possibleActions,
      possibleIcon: (groupInfo.profileId === value.profileId || value.isAdmin) ? [] : usrPossibleIcon,
      categoryId: getCategoryFromGlobalId(value.profileId),
      _original: value
    }
  })
}
export const contactsTransformToCard = (contactsInfo) => {
  return _.map(contactsInfo.contacts, (value, index) => {
    var usrPossibleActions = []
    var usrPossibleIcon = []
    if (value.connectionState === 'Request Sent') {
      usrPossibleActions.push('cancel')
      usrPossibleIcon.push('times')
    }
    if (value.connectionState === 'Request Received') {
      usrPossibleActions.push('accept', 'decline')
      usrPossibleIcon.push('check', 'times')
    }
    if (value.connectionState === 'Connected') {
      if (contactsInfo.excludeUser[value.profileId]) {
        if (contactsInfo.excludeUser[value.profileId].indexOf('chat') < 0) {
          usrPossibleActions.push('chat')
        }
        if (contactsInfo.excludeUser[value.profileId].indexOf('remove') < 0) {
          usrPossibleActions.push('remove')
        }
      } else {
        usrPossibleActions.push('chat', 'remove')
      }
    }
    return {
      link: {name: 'profileOverview', params: {profileId: value.profileId}},
      imageName: value.profilePicture ? value.profilePicture : '',
      heading: value.displayName,
      description: {'trans': 'network.' + value.profileType, 'plural': false, params: {}},
      suffixIcon: '',
      possibleActions: usrPossibleActions,
      possibleIcon: usrPossibleIcon,
      categoryId: getCategoryFromGlobalId(value.profileId),
      _original: value
    }
  })
}
export const companiesMemberTransformToCard = (companyInfo) => {
  var possibleActions = []
  var usrPossibleIcon = []
  if (companyInfo.actionType === 'member') {
    possibleActions.push('leave')
    usrPossibleIcon.push('times')
  }

  if (companyInfo.actionType === 'received') {
    possibleActions.push('join', 'decline')
    usrPossibleIcon.push('check', 'times')
  }
  return _.map(companyInfo.companies, (value, index) => {
    return {
      link: {name: 'profileOverview', params: {profileId: value.profileId}},
      imageName: value.profilePictureName,
      heading: value.companyName,
      description: {
        'trans': value.position ? value.position : 'companies.employee',
        'plural': false,
        'params': {}
      },
      possibleActions: companyInfo.showActions ? possibleActions : [],
      possibleIcon: companyInfo.showActions ? usrPossibleIcon : [],
      categoryId: getCategoryFromGlobalId(value.profileId),
      _original: value
    }
  })
}
export const cardsTransformContacts = (value, index, collection) => {
  return {
    id: value.id || value.profileId,
    title: value.displayName,
    image: value.profilePicture,
    type: value.profileType,
    categoryId: getCategoryFromGlobalId(value.id || value.profileId),
    ignored: false,
    _original: value
  }
}
export const employeesTransformToCard = (employeesInfo) => {
  var connections = employeesInfo.employees
  if (employeesInfo.excludeUser) {
    connections = _.filter(connections, (connection) => connection.profileId !== employeesInfo.excludeUser)
  }

  return _.map(connections, (value, index) => {
    var usrPossibleActions = []
    var usrPossibleIcon = []
    var tans = value.position ? value.position : 'employees.employee'

    if (employeesInfo.showEmployeeActions && employeesInfo.status === 'connected') {
      usrPossibleActions.push('edit', 'remove')
    }

    if (employeesInfo.showEmployeeActions && employeesInfo.status === 'invited') {
      usrPossibleActions.push('cancel')
    }
    return {
      link: {name: 'profileOverview', params: {profileId: value.profileId}},
      imageName: value.profilePicture ? value.profilePicture : '',
      heading: value.displayName,
      description: {'trans': tans, 'plural': false, params: {}},
      suffixIcon: '',
      possibleActions: usrPossibleActions,
      possibleIcon: usrPossibleIcon,
      categoryId: getCategoryFromGlobalId(value.profileId),
      _original: value
    }
  })
}
