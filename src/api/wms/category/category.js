import request from '@/utils/request'

export function getCategoryPage({current,size}) {
    return request({
      url: 'wms/category/getCategoryPage?current=' + current + '&size=' + size,
      method: 'get',
    })
  }

  export function getCategoryPageCarryParentCategory({current,size}) {
    return request({
      url: 'wms/category/getCategoryPageCarryParentCategory?current=' + current + '&size=' + size,
      method: 'get',
    })
  }

  export function getChildCategoryListById(categoryId) {
    return request({
      url: 'wms/category/getChildCategoryListById/' + categoryId,
      method: 'get',
    })
  }

  export function getCategoryById(categoryId) {
    return request({
      url: 'wms/category/getCategoryById/' + categoryId,
      method: 'get',
    })
  }

  export function saveOrModifyCategory(data) {
    return request({
      url: 'wms/category/saveOrModifyCategory',
      method: 'post',
      data:data
    })
  }

export function getCategoryPageByAttributes(data) {
  return request({
    url: 'wms/category/getCategoryPageByAttributes',
    method: 'post',
    params:data
  })
}

export function getParentCategoryByChildCategoryId(childCategoryId) {
  return request({
    url: 'wms/category/getParentCategoryByChildCategoryId/' + childCategoryId,
    method: 'get',
  })
}

removeCategory
export function removeCategory(categoryId) {
  return request({
    url: 'wms/category/removeCategory/' + categoryId,
    method: 'delete',
  })
}
