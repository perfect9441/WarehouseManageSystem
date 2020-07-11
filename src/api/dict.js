import request from '@/utils/request'



export function getDictPage(parmas) {
    return request({
      url: '/rbac/dict/getDictPage',
      method: 'get',
      params:parmas
    })
  }


export function getDictPageByAttributes(data) {
  return request({
    url: '/rbac/dict/getDictPageByAttributes',
    method: 'post',
    params:data
  })
}

export function saveOrModifyDict(data) {
    return request({
      url: '/rbac/dict/saveOrModifyDict',
      method: 'post',
      data:data
    })
  }


export function removeDict(dictId) {
    return request({
      url: '/rbac/dict/removeDict/'+dictId,
      method: 'delete',
    })
  }