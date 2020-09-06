import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },

    {
      path: '/chatPanel',
      name: 'chatPanel',
      component: require('@/components/chatPanel/chatPanel').default,
      meta: {
        keepAlive: true
      },
    },
    // {
    //   path: '/',
    //   redirect: '/chatPanel'
    // },

    {
      path: '/pyq',
      name: 'pyq',
      component: require('@/components/pyq/pyq.page').default
    },
    {
      path: '/login',
      name: 'login',
      component: require('@/components/login/login').default
    },
    {
      path: '/gameChannel',
      name: 'gameChannel',
      component: require('@/components/gameChannel/gameChannel.page').default,
      meta: {
        keepAlive: false
      },
    },
    {
      path: '/channelDetail',
      name: 'channelDetail',
      component: require('@/components/gameChannel/channelDetail.page').default
    },

  ]
})
