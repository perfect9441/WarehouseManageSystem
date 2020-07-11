import request from '@/utils/request'


export function getUnReadMsgList(data) {
    return request({
      url: '/open/im/getUnReadMsgList?acceptUserId='+data,
      method: 'post',
    
    })
  }

  export function getMsgPageByAttributes(data) {
   
   return request({
     url: '/open/im/getMsgPageByAttributes',
     method: 'post',
      params:data
   })
 }