import rtmpPlayer from './index.vue'

rtmpPlayer.install = function (Vue) {
  Vue.component(rtmpPlayer.name, rtmpPlayer)
}

if (typeof window !== 'undefined' && window.Vue) {
  window.rtmpPlayer = rtmpPlayer
  window.Vue.use(rtmpPlayer)
}

export default rtmpPlayer
