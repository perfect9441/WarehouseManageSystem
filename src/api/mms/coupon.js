import request from '@/utils/request'






export function getMerCouponPageByAttributes(data) {
  return request({
    url: '/mms/merCoupon/getMerCouponPageByAttributes',
    method: 'post',
    params:data
  })
}

export function modifyMerCoupon(data) {
    return request({
      url: '/mms/merCoupon/modifyMerCoupon',
      method: 'put',
      data:data
    })
  }


