const OidcCallback = () => import(/* webpackChunkName: "oidc" */ '@/components/pages/Site/OidcCallback')

export default {
  path: '/site',
  name: 'oidcCallbacks',
  component: OidcCallback,
  children: [
    {
      path: 'silent-login-callback',
      name: 'silentCallback'
    },
    {
      path: 'login-callback',
      name: 'loginCallback'
    },
    {
      path: 'logout-callback',
      name: 'logoutCallback'
    }
  ]
}
