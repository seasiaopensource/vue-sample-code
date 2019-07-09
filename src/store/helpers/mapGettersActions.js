import _ from 'lodash'

const mapGettersActions = function (array) {
  var returnObject = {}
  _.forEach(array, function ({ name, namespace }) {
    var getter = _.join([namespace, name], '/')
    var action = _.join([namespace, _.upperFirst(name)], '/update')
    returnObject[name] = {
      get () { return this.$store.getters[getter] },
      set (value) { this.$store.dispatch(action, { newValue: value }) }
    }
  })
  return returnObject
}

export default mapGettersActions
