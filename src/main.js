import Vue from 'vue'
import Cookies from 'js-cookie'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css
import './styles/btn.scss'
import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import './utils/error-log' // error log
import * as filters from './filters' // global filters
var lodash = require('lodash');
var lodashUuid = require('lodash-uuid');
Vue.prototype.$lodash = lodash
Vue.prototype.$lodashUuid = lodashUuid
Vue.prototype.$store = store

import moment from "moment";
Vue.prototype.$moment = moment

import VueNativeSock from 'vue-native-websocket'

Vue.use(VueNativeSock, 'ws://218.203.206.160:60007/ws', {
  connectManually: true,
  store: store,
  // format: 'json',
 
  // passToStoreHandler: function (eventName, event) {
  //   if (!eventName.startsWith('SOCKET_')) {
  //     return
  //   }
  //   let method = 'commit';
  //   let target = eventName.toUpperCase();
  //   let msg = event;
  //   if (this.format === 'json' && event.data) {
  //     msg = JSON.parse(event.data);
  //     if (msg.mutation) {
  //       target = [msg.namespace || '', msg.mutation].filter((e) => !!e).join('/');
  //     } else if (msg.action) {
  //       method = 'dispatch';
  //       target = [msg.namespace || '', msg.action].filter((e) => !!e).join('/');
  //     }
  //   }
  //   this.store[method](target, msg);
  //   this.store.state.socket.message = msg;
  // }
})


import XEUtils from 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/index.css'
Vue.use(VXETable)
Vue.prototype.$XEUtils = XEUtils



/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
// import { mockXHR } from '../mock'
// if (process.env.NODE_ENV === 'production') {
//   mockXHR()
// }
import 'video.js/dist/video-js.css'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)
// set ElementUI lang to EN
Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
