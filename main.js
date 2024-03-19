import App from './App'

// #ifndef VUE3
import Vue from 'vue'

import store from './store'

import api from '@/common/api/base'
Vue.prototype.$api = api

import util from '@/common/util/util'
Vue.prototype.$util = util

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	store,
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif