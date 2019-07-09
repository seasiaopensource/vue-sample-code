<template lang="html">
  <div class="language-selector">
    <span class="language-selector__label" v-if="nameLanguage">
      {{nameLanguage}}
    </span>
    <drop-down-list class="language-selector__dropdown"
      :name="$t('navbar.homeDashboard.selectlanguage')"
      :options="languageOptions"
      v-model="selected"
    />
  </div>
</template>
<script>
import _ from 'lodash'
import {changeLanguage} from '@/locales/i18n'
import portalConfig from '@/config'

export default {
  props: {
    nameLanguage: {
      type: String
    },
    text: {
      type: String
    }
  },
  computed: {
    selected: {
      get () {
        return this.$i18n.locale
      },
      set (optionValue) {
        changeLanguage(optionValue)
        this.$emit('languageSelected', optionValue)
      }
    },
    languageOptions () {
      let keys = _.keys(this.$i18n.messages) // ['de', 'en', 'nl']
      return _.map(keys, (key) => ({value: key, name: portalConfig['commonData']['languages'][key]}))
    }
  }
}
</script>
<style lang="sass" scoped>
.language-selector
  display: flex
  direction: row
  align-items: center

  &__dropdown
    width: 183px

  &__label
    padding: 0 .5rem
</style>
