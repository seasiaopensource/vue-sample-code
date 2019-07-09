// When in production mode, then do not allow any consoles
if (process.env.STAGING === 'beta' || process.env.STAGING === 'production') {
  window.console = { ...window.console, log: () => null, error: () => null, debug: () => null, warn: () => null, info: () => null }
}

// if we are in edge, remove the fetch functionality, for it is really bad.
if (/Edge/.test(navigator.userAgent)) {
  window.fetch = undefined
}

// Use the fetch polyfill
require('whatwg-fetch')

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import i18n from './locales/i18n'

import Croppa from 'vue-croppa'
import scrollSpy, { Easing } from 'vue2-scrollspy'
import VueScrollTo from 'vue-scrollto'

// filters
import { truncate, truncateFilename } from '@/etc/filters'

// Validation Stuff
import VeeValidate, { Validator } from 'vee-validate'
import customValidationLocales from '@/locales/validation'
import de from 'vee-validate/dist/locale/de'
import nl from 'vee-validate/dist/locale/nl'

import * as VueGoogleMaps from 'vue2-google-maps'

import {vueInstance} from '@/etc/instances'

// Global Components
import { atoms, molecules, organisms } from 'portal-global-components'

import { onPaypalIsThere } from '@/etc/paypalPromise'
window.onPaypalIsThere = onPaypalIsThere

const additionalLanguages = {
  de,
  nl
}
require('@/etc/passwordValidation') // Extend the Validation Service with custom Rules
Validator.localize(additionalLanguages)
Validator.localize(customValidationLocales)
Validator.localize(i18n.locale)
Validator.extend('taxOrVatRequired', {
  validate: value => {
    if (value) {
      return true
    }
    return false
  }
})

Vue.use(VeeValidate, {
  inject: false
})

Vue.config.productionTip = process.env.NODE_ENV === 'production'

export const mapsApiKey = 'AIzaSyAGEZ3s_b1w_g2MW8dAOeikGBdbpANF0n0'

Vue.use(VueGoogleMaps, {
  load: {
    key: mapsApiKey,
    libraries: 'places' // This is required if you use the Autocomplete plugin
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualization'
    // (as you require)
  }
})

Vue.use(Croppa)
Vue.use(scrollSpy, { easing: Easing.Cubic.In })
Vue.use(VueScrollTo)

// Use our custom made Atoms, Molecules
Vue.use(atoms)
Vue.use(molecules)
Vue.use(organisms)
Vue.filter('truncate', truncate)
Vue.filter('truncateFilename', truncateFilename)

let vue = new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
})

vueInstance.set(vue)

if (process.env.NODE_ENV !== 'production') {
  window.Vue = vue
}
