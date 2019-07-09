import _ from 'lodash'

const mapDynamicActions = function (array) {
  var returnObject = {}
  _.forEach(array, function ({ name, namespace, slug }) {
    returnObject[name] = async function (payload) {
      return await this.$store.dispatch(namespace + '/' + namespace + '--' + this[slug] + '/' + name, payload)
    }
  })
  return returnObject
}

export default mapDynamicActions
