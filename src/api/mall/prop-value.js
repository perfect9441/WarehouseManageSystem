import request from '@/utils/request'


export function getPropValuePageByAttributes(data) {
    return request({
      url: '/mall/propValue/getPropValuePageByAttributes',
      method: 'post',
      params:data
    })
  }
  

  export function removePropValue(propId) {
    return request({
      url: '/mall/propValue/removePropValue/'+propId,
      method: 'delete',
    })
  }


 
export function saveOrModifyPropValue(data) {
    return request({
      url: '/mall/propValue/saveOrModifyPropValue',
      method: 'post',
      data:data
    })
  }