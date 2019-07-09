const DownloadTranslation = () => import(/* webpackChunkName: "translation" */ '@/components/_etc/DownloadTranslation')

export default [{
  path: '/translation/:locale',
  name: 'downloadTranslation',
  component: DownloadTranslation,
  props: true
}]
