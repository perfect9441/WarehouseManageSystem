import request from '@/utils/request'


export function getMerchantByUsername(username) {
    return request({
      url: '/mall/merAdmin/getMerchantByUsername?username='+username,
      method: 'get',
    })
  }



export function refreshMerAdminByUsernameAndMerchantIdList(username,list) {
    return request({
      url: '/mall/merAdmin/refreshMerAdminByUsernameAndMerchantIdList?username='+username,
      method: 'post',
      data:list,
    })
  }