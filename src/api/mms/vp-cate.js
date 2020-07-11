import request from '@/utils/request'






export function getVpCatePage() {
  return request({
    url: '/mms/vpCate/getVpCatePage',
    method: 'get',

  })
}


export function modifyVpCate(data) {
  return request({
    url: '/mms/vpCate/modifyVpCate',
    method: 'put',
    data:data
  })
}


