import request from '@/utils/request'

export function getStuffById(stuffId) {
  return request({
    url: 'wms/stuff/getStuffById/' + stuffId,
    method: 'get',
  })
}

export function getStuffPage({current,size}) {
  return request({
    url: 'wms/stuff/getStuffPage?current=' + current + '&size=' + size,
    method: 'get',
  })
}

export function saveOrModifyStuff(data) {
  return request({
    url: '/wms/stuff/saveOrModifyStuff',
    method: 'post',
    data: data
  })
}

export function getStuffPageByAttributes(data) {
  return request({
    url: '/wms/stuff/getStuffPageByAttributes',
    method: 'post',
    params: data
  })
}

export function removeStuff(stuffId) {
  return request({
    url: '/wms/stuff/removeStuff/'+stuffId,
    method: 'delete',
  })
}
