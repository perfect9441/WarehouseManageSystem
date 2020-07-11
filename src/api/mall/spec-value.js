import request from '@/utils/request'


export function getSpecValuePageByAttributes(data) {
    return request({
      url: '/mall/specValue/getSpecValuePageByAttributes',
      method: 'post',
      params:data
    })
  }
   

  export function removeSpecValue(specValueId) {
    return request({
      url: '/mall/specValue/removeSpecValue/'+specValueId,
      method: 'delete',
    })
  }



export function saveOrModifySpecValue(data) {
    return request({
      url: '/mall/specValue/saveOrModifySpecValue',
      method: 'post',
      data:data
    })
  }