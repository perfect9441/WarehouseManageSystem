import request from '@/utils/request'

export function getCategoryPage({current,size}) {
    return request({
      url: 'wms/category/getCategoryPage?current=' + current + '&size=' + size,
      method: 'get',
    })
  }