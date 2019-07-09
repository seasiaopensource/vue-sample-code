import _ from 'lodash'

const mapDynamicGetters = function (array) {
  var returnObject = {}
  _.forEach(array, function ({ name, namespace, slug }) {
    returnObject[name] = function () {
      return this.$store.getters[namespace + '/' + namespace + '--' + this[slug] + '/' + name]
    }
  })
  return returnObject
}

export default mapDynamicGetters
