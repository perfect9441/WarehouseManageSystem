import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import permission from './modules/permission'
import errorLog from './modules/errorLog'
import tagsView from './modules/tagsView'
import websocket from './modules/websocket'

import {
  Notification
} from 'element-ui'


Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    socket: {
      // 连接状态
      isConnected: false,
      // 消息内容
      message: '',
      // 重新连接错误
      reconnectError: false,

    }
  },
  mutations: {

    SOCKET_ONOPEN(state, event) {
      // 连接打开触发的函数
      console.info('SOCKET_ONOPEN')
      Vue.prototype.$socket = event.currentTarget;
      state.socket.isConnected = true
      let sendCONNECTParams = JSON.stringify({
        action: "CONNECT",
        chatMsg: {
          sendUserId: Vue.prototype.$store.getters.userInfo.username + 'KF'
        }
      })

      Vue.prototype.$socket.send(sendCONNECTParams);
      // dispactch('_getUnReadMsgList')
      var keepaliveInterval = setInterval(() => {
        if (!state.socket.isConnected) {
          console.info('SOCKET_ONCLOSE_KEEPALIVE_IS_DONE')
          clearInterval(keepaliveInterval)
        }
        let sendKEEPALIVEParams = JSON.stringify({
          action: 'KEEPALIVE',

        })
        Vue.prototype.$socket.send(sendKEEPALIVEParams);
      }, 50000)


    },
    SOCKET_ONCLOSE(state, event) {
      // 连接关闭触发的函数
      state.socket.isConnected = false;

      console.log(event);
    },
    SOCKET_ONERROR(state, event) {
      // 连接发生错误触发的函数
      console.info('SOCKET_ONERROR')
      console.error(state, event)
    },
    SOCKET_ONMESSAGE(state, message) {
      // 收到消息时触发的函数

      let messagePares = JSON.parse(message.data)


      if (messagePares.actionResp) {

        //返回消息
        if (messagePares.actionResp == 'CHATP2P_RESP') {
          messagePares.data.chatMsg.msg = JSON.parse(messagePares.data.chatMsg.msg)
          let result = messagePares.data.chatMsg


          Vue.prototype.$store.commit('websocket/SET_SEND_MSG', result)
        }
      } else if (messagePares.action) {
        if (messagePares.action == 'CHATP2P') {
          console.info('SOCKET_ONMESSAGE')
          console.info(messagePares)
          messagePares.data.chatMsg.msg = JSON.parse(messagePares.data.chatMsg.msg)

          if (Vue.prototype.$store.getters.isOnPage.code) {
            //onPage
            if (Vue.prototype.$store.getters.isOnPage.onPageMerchantId) {
              if (Vue.prototype.$store.getters.isOnPage.onPageMerchantId == messagePares.data.chatMsg.merchantId && Vue.prototype.$store.getters.isOnPage.onPageUserId == messagePares.data.chatMsg.sendUserId) {
                //当前聊天
                Vue.prototype.$store.commit('websocket/SET_ACCEPT_MSG', messagePares.data.chatMsg)
              } else {
                //非当前聊天
                //处理store
                Vue.prototype.$store.commit('websocket/ADD_UNSIGN', messagePares.data.chatMsg)
                //处理缓存
                Vue.prototype.$store.dispatch('websocket/_ProcessAddMsgStorage', messagePares.data.chatMsg)
              }
            } else {
              //处理store
              Vue.prototype.$store.commit('websocket/ADD_UNSIGN', messagePares.data.chatMsg)
              //处理缓存
              Vue.prototype.$store.dispatch('websocket/_ProcessAddMsgStorage', messagePares.data.chatMsg)
            }


          } else {
            //notNoPage
            //处理store
            Vue.prototype.$store.commit('websocket/ADD_UNSIGN', messagePares.data.chatMsg)
            //处理缓存
            Vue.prototype.$store.dispatch('websocket/_ProcessAddMsgStorage', messagePares.data.chatMsg)
          }
          if (!Vue.prototype.$store.getters.isOnPage.code) {
            Notification.info({
              title: '消息',
              message: '来自于' + messagePares.data.chatMsg.msg.sendUserName,
              duration: 0
            })
          }

        }
      }

      // if (messagePares.action == 'KEEPALIVE') {
      //   console.info('SOCKET_KEEPALIVE')
      // }else if(messagePares.action == 'CONNECT'){
      //   console.info('SOCKET_CONNECT')
      // } else {
      //   console.info('SOCKET_ONMESSAGE')
      //   console.info(message)
      //   Vue.prototype.$store.commit('websocket/ADD_UNSINGED_MSG')
      //   Notification.info({
      //     title: '消息',
      //     message: '这是一条消息的提示消息',
      //     duration: 0
      //   })
      // }
      // state.socket.message = message
    },

  },
  actions: {
    customerAdded(context) {
      // 新连接添加函数
      console.log('action received: customerAdded');
      console.log(context)
    },

  },

  modules: {
    app,
    settings,
    user,
    permission,
    errorLog,
    tagsView,
    websocket

  },
  getters
})

export default store
