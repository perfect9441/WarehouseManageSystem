import request from '@/utils/request'



export function getAdPageByAttributes(data) {
    return request({
      url: '/mall/ad/getAdPageByAttributes',
      method: 'post',
      params:data
    })
  }
  

 

 
  export function removeAd(adId) {
    return request({
      url: '/mall/ad/removeAd/'+adId,
      method: 'delete',
    })
  }


export function saveOrModifyAd(data) {
    return request({
      url: '/mall/ad/saveOrModifyAd',
      method: 'post',
      data:data
    })
  }