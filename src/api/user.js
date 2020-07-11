import request from '@/utils/request'






export function getAdminPageByAttributes(data) {
    return request({
      url: '/rbac/admin/getAdminPageByAttributes',
      method: 'post',
      params:data
    })
  }


  export function modifyAdmin(data) {
    return request({
      url: '/rbac/admin/modifyAdmin',
      method: 'put',
      data:data
    })
  }
  export function getAdminByPrincipal() {
    return request({
      url: '/rbac/admin/getAdminByPrincipal',
      method: 'get',
      
    })
  }
