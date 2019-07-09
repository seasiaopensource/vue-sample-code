// // Import of Librarys
import Vue from 'vue'
import Router from 'vue-router'
// // Import of all Template Sections

import dummyPortalRoutes from './dummyPortalRoutes'
import translations from './modules/etc/translations'

import landing from './modules/etc/landing'
import externalArea from './modules/externalArea'
import internalArea from './modules/internalArea'
import commonArea from './modules/commonArea'
import callbacks from './modules/etc/callbacks'
import setup from './modules/etc/setup'

import ArticleOverview from '@/components/pages/Article/Overview'
import ArticleDetail from '@/components/pages/Article/Detail'
import RouteNotFound from '@/components/pages/RouteNotFound'

import Debug from '@/components/_etc/Debug'

import replaceRoutes from './helpers/replaceRoutes'

import portalConfig from '@/config'

Vue.use(Router)

var routes = {
  mode: 'history',
  routes: replaceRoutes(portalConfig.addons && portalConfig.addons.routes, portalConfig.addons.dummyPortal ? dummyPortalRoutes : [
    ...portalConfig.addons.getTranslations ? translations : [],
    landing,
    externalArea,
    callbacks,
    internalArea,
    commonArea,
    setup,
    {
      path: '/article',
      name: 'articleOverview',
      component: ArticleOverview,
      redirect: { name: 'articleOverviewDetail' },
      children: [
        {
          path: ':articleId',
          name: 'articleOverviewDetail',
          component: ArticleDetail
        }
      ]
    },
    {
      path: '/debug',
      name: 'debug',
      component: Debug
    },
    {
      path: '*',
      name: 'routeNotFound',
      component: RouteNotFound
    }
  ]),
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
}

// console.log(routes)

const router = new Router(routes)

// router.beforeEach(async (to, from, next) => {
//   await onInitCompletePromise
//   next()
// })

export default router
