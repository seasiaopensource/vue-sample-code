import _ from 'lodash'
import VueScrollTo from 'vue-scrollto'
import store from '@/store'
import { operationNotificationTypes } from '@/store/modules/global/operationNotification'
import i18n from '@/locales/i18n'

const defaultScrollDuration = 400
const defaultScrollOptions = {
  offset: -140,
  x: false,
  y: true,
  onDone: (el) => el.focus()
}

export function scrollToFirstError (data) {
  let validator = data.validator
  let scope = data.scope
  let options = data.options
    ? {...defaultScrollOptions, ...data.options}
    : defaultScrollOptions
  let duration = data.duration || defaultScrollDuration
  let disableOperationNotification = data.disableOperationNotification || false

  // data checks
  if (!data) {
    throw new Error('please provide data as first parameter in the following form: {validator, options, duration}')
  }
  if (!validator) {
    throw new Error('No validator given')
  }
  if (!validator.errors || !validator.errors.items || !validator.errors.items.length) {
    throw new Error('No errors found in the validator')
  }
  if (!validator.fields || !validator.fields.items || !validator.fields.items.length) {
    throw new Error('No items found in the validator')
  }

  // get the first error
  let firstError = scope
    ? _.find(validator.errors.items, {scope})
    : validator.errors.items[0]

  // get the element of the first error
  let element = _.find(validator.fields.items, {id: firstError.id}).el

  // scroll to the element
  let cancelScroll = VueScrollTo.scrollTo(element, duration, options)

  // create an operationNotification
  if (!disableOperationNotification) {
    store.dispatch('operationNotification/create', {
      title: i18n.t('operationNotifications.general.userInputError.title'),
      type: operationNotificationTypes.error,
      message: firstError.msg
    })
  }

  return cancelScroll
}
