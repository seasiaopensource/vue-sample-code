import _ from 'lodash'

const mapGettersMutations = function (array) {
  var returnObject = {}
  _.forEach(array, function ({ name, namespace, emitChanges }) {
    // debugger
    var getter = _.join([namespace, name], '/')
    var mutation = _.join([namespace, _.upperFirst(name)], '/update')
    returnObject[name] = {
      get () { return this.$store.getters[getter] },
      set (value) {
        var emitChangesCheck = emitChanges || false
        if (emitChangesCheck) { this.$emit(emitChangesCheck, {val: value}) }
        this.$store.commit(mutation, value)
      }
    }
  })
  return returnObject
}

export default mapGettersMutations
