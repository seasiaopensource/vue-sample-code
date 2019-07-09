const LegalPages = () => import(/* webpackChunkName: "legal" */ '@/components/pages/Legal/page')
const ReleaseNotes = () => import(/* webpackChunkName: "legal" */ '@/components/pages/Release/ReleasePage')
const CommonArea = () => import(/* webpackChunkName: "legal" */ '@/components/pages/CommonArea')
import portalConfig from '@/config'

export default {
  path: '/',
  name: 'commonArea',
  component: CommonArea,
  props: true,
  children: [
    {
      path: 'imprint',
      name: 'imprint',
      component: LegalPages,
      props: { markDownData: portalConfig.legal.imprint }
    },
    {
      path: 'privacy-company',
      name: 'privacyCompany',
      component: LegalPages,
      props: { markDownData: portalConfig.legal.privacyCompany }
    },
    {
      path: 'privacy-person',
      name: 'privacyPerson',
      component: LegalPages,
      props: { markDownData: portalConfig.legal.privacyPerson }
    },
    {
      path: 'terms-company',
      name: 'termsCompany',
      component: LegalPages,
      props: { markDownData: portalConfig.legal.termsCompany }
    },
    {
      path: 'terms-person',
      name: 'termsPerson',
      component: LegalPages,
      props: { markDownData: portalConfig.legal.termsPerson }
    },
    {
      path: 'release-notes',
      name: 'releaseNotes',
      component: ReleaseNotes,
      props: (route) => ({
        versionNo: route.query.version
      })
    }
  ]
}
