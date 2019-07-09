import _ from 'lodash'
import portalConfig from '@/config'

import de from './de'
import en from './en'

const messages = _.merge({
  de,
  en
}, portalConfig.messages)

export default messages
