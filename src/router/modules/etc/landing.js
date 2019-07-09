import store from '@/store'

export default {
  path: '/',
  beforeEnter: (to, from, next) => {
    let externalAreaParams = {
      to: {
        name: to.name || 'home',
        params: to.params,
        query: to.query
      }
    }
    store.getters['user/isLoggedIn']
      ? next({name: 'internalArea', params: to.params, query: to.query})
      : next({name: 'externalArea', params: externalAreaParams})
  }
}
