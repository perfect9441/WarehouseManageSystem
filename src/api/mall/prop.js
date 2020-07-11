import request from '@/utils/request'


export function getPropPageByAttributes(data) {
    return request({
      url: '/mall/prop/getPropPageByAttributes',
      method: 'post',
      params:data
    })
  }
  
  export function getPropById(propId) {
    return request({
      url: '/mall/prop/getPropById/'+propId,
      method: 'get',
    })
  }

  export function removeProp(propId) {
    return request({
      url: '/mall/prop/removeProp/'+propId,
      method: 'delete',
    })
  }


export function saveOrModifyProp(data) {
    return request({
      url: '/mall/prop/saveOrModifyProp',
      method: 'post',
      data:data
    })
  }