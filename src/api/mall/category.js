import request from '@/utils/request'


export function getCategoryPageByAttributes(data) {
    return request({
      url: '/mall/category/getCategoryPageByAttributes',
      method: 'post',
      params:data
    })
  }


  export function removeCategory(categoryId) {
    return request({
      url: '/mall/category/removeCategory/'+categoryId,
      method: 'delete',
    })
  }



export function saveOrModifyCategory(data) {
    return request({
      url: '/mall/category/saveOrModifyCategory',
      method: 'post',
      data:data
    })
  }