import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store/index'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import BSON from 'bson'
Vue.prototype.$BSON= BSON
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
import moment from 'moment'
Vue.prototype.$moment= moment

import websocket from '@/server/WebSocket'
// let ws= new websocket('ws://47.93.62.163:8000/ws');
// let ws= new websocket('ws://52.81.250.99:8000/ws');
let ws= new websocket('ws://1.117.230.210:8002/ws');

Vue.prototype.$ws= ws
import BUS from '@/server/eventBus'
BUS(Vue)

import * as filter from '@/assets/js/filter.service'
Object.keys (filter).forEach(keys=>{
  Vue.filter(keys,filter[keys])
})

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
router.beforeEach((to, from, next)=>{
  if(from.name == 'gameChannel' && to.name == 'channelDetail'){ //游戏频道
    from.meta.keepAlive= true
  }
  next()
})
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
