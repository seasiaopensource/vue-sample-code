import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from './translations'
import portalConfig from '@/config'
import { Validator } from 'vee-validate'

Vue.use(VueI18n)

export const isLanguageAvailable = (userLanguage) => {
  return messages[userLanguage] ? userLanguage : portalConfig.i18n.defaultLocale
}

const i18n = new VueI18n({
  locale: isLanguageAvailable(portalConfig.i18n.defaultLocale),
  fallbackLocale: 'en',
  messages: messages,
  numberFormats: {
    en: {
      decimal: {
        style: 'decimal',
        minimumFractionDigits: 2
      }
    },
    de: {
      currency: {
        style: 'currency',
        currency: 'EUR'
      }
    }
  }
})

export default i18n

export const changeLanguage = (newLanguage) => {
  const changeToLanguage = isLanguageAvailable(newLanguage)
  i18n.locale = changeToLanguage
  Validator.localize(changeToLanguage)
}
