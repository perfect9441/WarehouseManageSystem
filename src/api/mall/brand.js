import request from '@/utils/request'

export function getBrandPageByAttributes(data) {
    return request({
      url: '/mall/brand/getBrandPageByAttributes',
      method: 'post',
      params:data
    })
  }
  

  export function getBrandById(brandId) {
    return request({
      url: '/mall/brand/getBrandById/'+brandId,
      method: 'get',
    })
  }

  export function removeBrand(brandId) {
    return request({
      url: '/mall/brand/removeBrand/'+brandId,
      method: 'delete',
    })
  }


export function saveOrModifyBrand(data) {
    return request({
      url: '/mall/brand/saveOrModifyBrand',
      method: 'post',
      data:data
    })
  }