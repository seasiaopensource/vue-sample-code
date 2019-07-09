import store from '@/store'
import _ from 'lodash'

const unregisterSubmodule = function ({namespace, slug}) {
  if (store && store.state && store.state[namespace] && store.state[namespace][namespace + '--' + slug]) {
    store.unregisterModule([namespace, namespace + '--' + slug])
    // console.debug('successfully unregistered ' + namespace + '/' + namespace + '--' + slug + ' store')
  }

  if (store && store.state && store.state[namespace] && _.isEmpty(store.state[namespace])) {
    store.unregisterModule(namespace)
  }

  return 0
}

export default unregisterSubmodule
