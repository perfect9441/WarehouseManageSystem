import request from '@/utils/request'



export function getVipById(vipId) {
  return request({
    url: '/mms/vip/getVipById/'+vipId,
    method: 'get',
  
  })
}

export function getVipPageByAttributes(data) {
  return request({
    url: '/mms/vip/getVipPageByAttributes',
    method: 'post',
    params:data
  })
}


export function saveOrModifyVip(data) {
  return request({
    url: '/mms/vip/saveOrModifyVip',
    method: 'post',
    data:data
  })
}


export function removeVip(vipId) {
  return request({
    url: '/mms/vip/removeVip/'+vipId,
    method: 'delete',

  })
}
