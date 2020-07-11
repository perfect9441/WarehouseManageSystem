import request from '@/utils/request'


export function getSpecPageByAttributes(data) {
    return request({
      url: '/mall/spec/getSpecPageByAttributes',
      method: 'post',
      params:data
    })
  }
 
  export function getSpecById(specId) {
    return request({
      url: '/mall/spec/getSpecById/'+specId,
      method: 'get',
    })
  }

  export function removeSpec(specId) {
    return request({
      url: '/mall/spec/removeSpec/'+specId,
      method: 'delete',
    })
  }

 
export function saveOrModifySpec(data) {
    return request({
      url: '/mall/spec/saveOrModifySpec',
      method: 'post',
      data:data
    })
  }