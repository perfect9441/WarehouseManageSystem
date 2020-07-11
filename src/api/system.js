import request from '@/utils/request'




export function getSysPage(data) {
    return request({
      url: '/rbac/sys/getSysPage',
      method: 'get',
      params:data
    })
}

