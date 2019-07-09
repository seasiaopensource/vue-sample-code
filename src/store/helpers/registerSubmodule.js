import store from '@/store'

const registerSubmodule = function ({module, namespace, slug}) {
  // register a new module only if doesn't exist
  if (!(store && store.state && store.state[namespace] && store.state[namespace][namespace + '--' + slug])) {
    if (!(store && store.state && store.state[namespace])) {
      store.registerModule([namespace], {namespaced: true})
    }
    store.registerModule([namespace, namespace + '--' + slug], module)
  } else {
    // re-use the already existing module
    // console.log(`reusing module: ${namespace + '/' + slug}`)
  }

  return 0
}

export default registerSubmodule
