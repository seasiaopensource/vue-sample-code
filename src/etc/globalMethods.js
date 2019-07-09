import store from '@/store'

export default {
  getConformation (code, cb) {
    store.commit('activation/updateCode', code)
    store.dispatch('activation/submit')
      .then((res, err) => {
        cb(err, res)
      })
      .catch((err) => {
        cb(err)
      })
  },
  bytesToSize (bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes === 0) return '0 Byte'
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
  }
}
