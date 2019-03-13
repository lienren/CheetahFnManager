/*
 * @Author: Lienren
 * @Date: 2018-08-13 22:29:12
 * @Last Modified by: Lienren
 * @Last Modified time: 2019-03-13 10:09:04
 */
'use strict'

import Vue from 'vue'
import VCharts from 'v-charts'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import VueParticles from 'vue-particles'
import UtilsPlugin from './assets/utils'
import './plugins/install'
import App from './App'
import router from './router'
import './styles/index.scss' // global css
import './styles/animate.css' // animate css
import store from './store'
import { sync } from 'vuex-router-sync'

Vue.config.productionTip = false

Vue.use(Antd)
Vue.use(UtilsPlugin)
Vue.use(VueParticles)
Vue.use(VCharts)

sync(store, router)

/* eslint-disable no-new */
window.$globalHub = new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
