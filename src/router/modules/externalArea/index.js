const Site = () => import(/* webpackChunkName: "landing" */ '@/components/pages/Site')
const SiteRegisterCompany = () => import(/* webpackChunkName: "landing" */ '@/components/pages/Site/RegisterCompany')
const SiteRegisterPerson = () => import(/* webpackChunkName: "landing" */ '@/components/pages/Site/RegisterPerson')
const SiteConfirmation = () => import(/* webpackChunkName: "landing" */ '@/components/pages/Site/Confirmation')
const ResetPassword = () => import(/* webpackChunkName: "landing" */ '@/components/pages/Site/ResetPassword')

export default {
  path: '/site',
  name: 'externalArea',
  redirect: {name: 'siteRegisterPerson'},
  component: Site,
  children: [
    {
      path: 'reset-password',
      name: 'siteResetPassword',
      component: ResetPassword
    },
    {
      path: 'register/company',
      name: 'siteRegisterCompany',
      components: {
        default: SiteRegisterCompany
      }
    },
    {
      path: 'register/person',
      name: 'siteRegisterPerson',
      components: {
        default: SiteRegisterPerson
      }
    },
    {
      path: 'account/activation/:code',
      name: 'siteConfirmation',
      component: SiteConfirmation
    }
  ]
}
