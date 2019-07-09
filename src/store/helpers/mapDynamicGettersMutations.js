import _ from 'lodash'
import { mutationName } from './createStandards'

const mapDynamicGetters = function (array) {
  var returnObject = {}
  _.forEach(array, function ({ name, namespace, slug, emitChanges }) {
    returnObject[name] = {
      get () { return this.$store.getters[namespace + '/' + namespace + '--' + this[slug] + '/' + name] },
      set (newValue) {
        var emitChangesCheck = emitChanges || false
        if (emitChangesCheck) { this.$emit(emitChangesCheck, {val: newValue}) }
        this.$store.commit(namespace + '/' + namespace + '--' + this[slug] + '/' + mutationName(name), newValue)
      }
    }
  })
  return returnObject
}

export default mapDynamicGetters
