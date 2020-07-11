import request from '@/utils/request'

export function getConfigPageByAttributes(data) {
    return request({
      url: '/rbac/config/getConfigPageByAttributes',
      method: 'post',
      params:data
    })
  }

  export function modifyConfig(data) {
    return request({
      url: '/rbac/config/modifyConfig',
      method: 'put',
      data:data
    })
  }