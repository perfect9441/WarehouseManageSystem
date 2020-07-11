import request from '@/utils/request'




export function getOrgPageByAttributes(data) {
  return request({
    url: '/rbac/org/getOrgPageByAttributes',
    method: 'post',
    params:data
  })
}

export function saveOrModifyOrg(data) {
  return request({
    url: '/rbac/org/saveOrModifyOrg',
    method: 'post',
    data:data
  })
}

export function getOrgById(orgId) {
  return request({
    url: '/rbac/org/getOrgById/'+orgId,
    method: 'get',
  })
}
export function removeOrg(orgId) {
  return request({
    url: '/rbac/org/removeOrg/'+orgId,
    method: 'delete',
  })
}


export function getOrgPageOfParentIdIsNull() {
  return request({
    url: '/rbac/org/getOrgPageOfParentIdIsNull',
    method: 'get',
  })
}


