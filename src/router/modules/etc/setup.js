import { isPersonAccount, isCompanyAccount } from '@/etc/oidcUserManager'
// import store from '@/store'

const SiteForProfileCreation = () => import(/* webpackChunkName: "profile-creation" */ '@/components/pages/SiteForProfileCreation')
const Setup = () => import(/* webpackChunkName: "profile-creation" */ '@/components/pages/Setup')
const ProfilePayment = () => import(/* webpackChunkName: "profile-creation" */ '@/components/pages/ProfilePayment')

// const CompanyProfilePaymentInfo = () => import(/* webpackChunkName: "profile-creation" */ '@/components/pages/Company/ProfilePaymentInfo')
const CompanyProfilePayment = () => import(/* webpackChunkName: "profile-creation" */ '@/components/pages/Company/ProfilePayment')
const CompanyProfilePaymentExpired = () => import(/* webpackChunkName: "profile-creation" */ '@/components/pages/Company/ProfilePaymentExpired')
const CompanyProfilePaymentFailed = () => import(/* webpackChunkName: "profile-creation" */ '@/components/pages/Company/ProfilePaymentFailed')
const CompanyProfileInformation = () => import(/* webpackChunkName: "profile-creation" */ '@/components/pages/Company/ProfileInformation')
const CompanyUploadProfileImage = () => import(/* webpackChunkName: "profile-creation" */ '@/components/pages/Company/UploadProfileImage')
const CompanyProfileSubscription = () => import(/* webpackChunkName: "profile-creation" */ '@/components/pages/Company/ProfileSubscription')

const ChooseProfileType = () => import(/* webpackChunkName: "profile-creation" */ '@/components/pages/Profile/ChooseProfileType')
const ProfileInformation = () => import(/* webpackChunkName: "profile-creation" */ '@/components/pages/Profile/ProfileInformation')
const UploadProfileImage = () => import(/* webpackChunkName: "profile-creation" */ '@/components/pages/Profile/UploadProfileImage')

export default {
  path: '/setup',
  component: SiteForProfileCreation,
  name: 'creationArea',
  // beforeEnter: async (to, from, next) => {
  //   await onInitCompletePromise
  //   if (store.getters['user/canCreateAdditionalProfile']) {
  //     next()
  //   } else {
  //     next({name: 'internalArea'})
  //   }
  // },
  redirect: {name: 'createPersonProfile'},
  children: [
    {
      path: 'person',
      component: Setup,
      name: 'createPersonProfile',
      redirect: {name: 'profileChooseProfileType'},
      beforeEnter: async (to, from, next) => {
        !await isCompanyAccount()
          ? next()
          : next({name: 'createCompanyProfile'})
      },
      children: [
        {
          path: 'create-profile',
          name: 'profileChooseProfileType',
          component: ChooseProfileType
        },
        {
          path: 'fill-profile-information',
          name: 'profileProfileInformation',
          component: ProfileInformation
        },
        {
          path: 'upload-profile-photo',
          name: 'profileUploadProfileImage',
          component: UploadProfileImage
        }
      ]
    },
    {
      path: 'company',
      component: Setup,
      name: 'createCompanyProfile',
      redirect: {name: 'companyProfileInformation'},
      beforeEnter: async (to, from, next) => {
        !await isPersonAccount()
          ? next()
          : next({name: 'createPersonProfile'})
      },
      children: [
        {
          path: 'create-profile',
          name: 'companyProfileInformation',
          component: CompanyProfileInformation
        },
        {
          path: 'upload-profile-photo',
          name: 'companyProfileUploadProfileImage',
          component: CompanyUploadProfileImage
        },
        /* {
          path: 'profile-payment-info',
          name: 'companyProfilePaymentInfo',
          component: CompanyProfilePaymentInfo
        }, */
        {
          path: 'subscription',
          name: 'companyProfilePaymentPage',
          component: ProfilePayment,
          redirect: {name: 'companyProfileSubscription'},
          children: [
            {
              path: 'plans',
              name: 'companyProfileSubscription',
              component: CompanyProfileSubscription
            },
            {
              path: 'payment',
              name: 'companyProfilePayment',
              component: CompanyProfilePayment
            },
            {
              path: 'payment-expired',
              name: 'companyProfilePaymentExpired',
              component: CompanyProfilePaymentExpired
            },
            {
              path: 'payment-failed',
              name: 'companyProfilePaymentFailed',
              component: CompanyProfilePaymentFailed
            }
          ]
        }
      ]
    }
  ]
}
