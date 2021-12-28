import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import rtmpPlayer from './components/videPlayer/index'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.use(rtmpPlayer)
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
