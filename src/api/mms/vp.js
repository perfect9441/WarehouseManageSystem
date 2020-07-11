import request from '@/utils/request'






export function getVipPrivilegePageByAttributes(data) {
  return request({
    url: '/mms/vipPrivilege/getVipPrivilegePageByAttributes',
    method: 'post',
    params:data
  })
}


export function saveOrModifyVipPrivilege(data) {
  return request({
    url: '/mms/vipPrivilege/saveOrModifyVipPrivilege',
    method: 'post',
    data:data
  })
}


export function removeVipPrivilege(vipPrivilegeId) {
  return request({
    url: '/mms/vipPrivilege/removeVipPrivilege/'+vipPrivilegeId,
    method: 'delete',

  })
}