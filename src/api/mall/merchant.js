import request from '@/utils/request'


export function getMerchantPageByAttributes(data) {
    return request({
      url: '/mall/merchant/getMerchantPageByAttributes',
      method: 'post',
      params:data
    })
  }
  
  export function getMerchantById(merchantId) {
    return request({
      url: '/mall/merchant/getMerchantById/'+merchantId,
      method: 'get',
    })
  }
  export function removeMerchant(merchantId) {
    return request({
      url: '/mall/merchant/removeMerchant/'+merchantId,
      method: 'delete',
    })
  }

 

export function saveOrModifyMerchant(data) {
    return request({
      url: '/mall/merchant/saveOrModifyMerchant',
      method: 'post',
      data:data
    })
  }