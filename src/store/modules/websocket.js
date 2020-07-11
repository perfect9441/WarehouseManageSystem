import {
  getUnReadMsgList
} from '../../api/mall/websocket'
import Vue from 'vue'
const state = {
  unSignMsgList: [],
  unSignCount: 0, 
  sendMsgData: {},
  isConnect: false,
  isOnPage:{
    code:false,
    onPageMerchantId:null,
    onPageUserId:null,
  },
  onPageMerchantId:null,
  onPageUserId:null,
  sendMsgData:{},
  acceptMsgData:{},
}

const mutations = {
  SET_ISON_PAGE(state, {code,onPageMerchantId,onPageUserId}){
    state.isOnPage.code = code
    state.isOnPage.onPageMerchantId = onPageMerchantId
    state.isOnPage.onPageUserId = onPageUserId
  },
  SET_SOCKET_STATE(state, isConnect) {
    state.isConnect = isConnect
  },
  SET_SEND_MSG(state, sendMsgData) {
   
    state.sendMsgData = sendMsgData
  },
  SET_ACCEPT_MSG(state, acceptMsgData) {
   
    state.acceptMsgData = acceptMsgData
  },
  SET_UNSIGN_LIST(state, list) {
    state.unSignMsgList = list
    state.unSignCount = list.length
  },

  ADD_UNSIGN(state, item) {
    state.unSignMsgList.push(item)
    state.unSignCount++
  },
  SUB_UNSIGN(state, msgId) {

    for (let i = 0; i < state.unSignMsgList.length; i++) {
      if (state.unSignMsgList[i].msgId == msgId) {

        state.unSignMsgList.splice(i, 1)
        state.unSignCount--
        break
      }
    }

  },

  RESET_UNSIGN_COUNT(state) {
    state.unSignMsgList = []
    state.unSignCount = 0
  }

}

const actions = {

  _GetUnReadMsgList({
    rootState,
    commit,
    dispatch
  }) {
    getUnReadMsgList(rootState.user.userInfo.username + 'KF').then(res => {
      console.info('getUnReadMsgList')
      console.info(res)

      if (res != null) {
        let result = res
        //处理缓存
        for (let i = 0; i < result.length; i++) {
          result[i].msg = JSON.parse(result[i].msg)
         

          dispatch('_ProcessAddMsgStorage',  result[i])
        }
        commit('SET_UNSIGN_LIST', result)
      }
    })


  },
  _SendMessage({
    rootState
  }, {acceptUserId, message, merchantId, merchantName, msgCate,merServiceName}) {
    let msg = {
      msg: message,
      merchantName: merchantName,
      avatar: rootState.user.userInfo.avatar,
      sendUserName: merServiceName,
    }
    let sendP2PParams = JSON.stringify({
      action: "CHATP2P",
      chatMsg: {
        acceptUserId: acceptUserId,
        sendUserId: rootState.user.userInfo.username + 'KF',
        msg: JSON.stringify(msg),
        merchantId: merchantId,
        merchantName: merchantName,
        msgType: 'P2P',
        msgCate: msgCate,
      }
    })

    Vue.prototype.$socket.send(sendP2PParams);


  },
  _ProcessSubMsgStorage({state},{merchantId,sendUserId}) {
    return new Promise((resolve,reject)=>{
      let value = localStorage.getItem("MsgStorage")
      if (value) {
        value = JSON.parse(value)
       
        if(value[merchantId].userMap[sendUserId]){
          let merchantUnsignList=value[merchantId].unSignIdList
          let userUnsignList=value[merchantId].userMap[sendUserId].unSignIdList
          console.info('清除该店铺的未读消息缓存')
          for(let i=0;i<userUnsignList.length;i++){
            value[merchantId].unSignIdList.splice(merchantUnsignList.indexOf(userUnsignList[i]),1)
            value[merchantId].unSignCount--
          }
          value[merchantId].userMap[sendUserId].unSignIdList = []
          value[merchantId].userMap[sendUserId].unSignCount = 0
          console.info('清除个人未读消息缓存')
  
          localStorage.setItem("MsgStorage", JSON.stringify(value))

        }
       
        resolve(value)
      }
      
    })
  
  },
  _ProcessAddMsgStorage({
    state
  }, msgItem) {
    let value = localStorage.getItem("MsgStorage")
    

    if (value) {
      value = JSON.parse(value)

      if (value[msgItem.merchantId]) {
        //有这家店铺的缓存
        let hasThisMsg = value[msgItem.merchantId].unSignIdList.indexOf(msgItem.msgId)
        if (hasThisMsg > -1) {
          // console.info('hasThisMsg')
        } else {

          value[msgItem.merchantId].unSignIdList.push(msgItem.msgId)
          value[msgItem.merchantId].unSignCount++

          if (value[msgItem.merchantId].userMap[msgItem.sendUserId]) {
            value[msgItem.merchantId].userMap[msgItem.sendUserId].unSignIdList.push(msgItem.msgId)
            value[msgItem.merchantId].userMap[msgItem.sendUserId].unSignCount++

          } else {
            //这家店铺没有这个人的信息
            let useritem = {
              sendUserName:msgItem.msg.sendUserName,
              avatar:msgItem.msg.avatar,
              sendUserId: msgItem.sendUserId,
              unSignCount: 1,
              unSignIdList: [],
              
            }
            useritem.unSignIdList.push(msgItem.msgId)
            value[msgItem.merchantId].userMap[msgItem.sendUserId]=useritem
           
          }
          localStorage.setItem("MsgStorage", JSON.stringify(value))
        }
        
      } else {
        // console.info('为这家店铺新增未读消息')
        let item = {
          merchantId: msgItem.merchantId,
          merchantName: msgItem.merchantName,
          unSignCount: 1,
          unSignIdList:[],
          userMap: {},
        }
        item.userMap[msgItem.sendUserId] = {
          sendUserId: msgItem.sendUserId,
          sendUserName:msgItem.msg.sendUserName,
          avatar:msgItem.msg.avatar,
          unSignCount: 1,
          unSignIdList: []
        }
        item.unSignIdList.push(msgItem.msgId)
        item.userMap[msgItem.sendUserId].unSignIdList.push(msgItem.msgId)
        value[msgItem.merchantId] = item
        localStorage.setItem("MsgStorage", JSON.stringify(value))
      }


    } else {

      let item = {
        merchantId: msgItem.merchantId,
        merchantName: msgItem.merchantName,
        userMap: {},
        unSignCount: 1,
        unSignIdList: [],
      }
      item.userMap[msgItem.sendUserId] = {
        sendUserId: msgItem.sendUserId,
        sendUserName:msgItem.msg.sendUserName,
        avatar:msgItem.msg.avatar,
        unSignCount: 1,
        unSignIdList: [],
      }
      item.unSignIdList.push(msgItem.msgId)
      item.userMap[msgItem.sendUserId].unSignIdList.push(msgItem.msgId)
      let storage = {}
      storage[item.merchantId] = item

      localStorage.setItem("MsgStorage", JSON.stringify(storage))
    }
    // console.info('localStorage.getItem("MsgStorage")')
    // console.info(JSON.parse(localStorage.getItem("MsgStorage")))
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
