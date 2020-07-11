import request from '@/utils/request'


export function getCouponPageByAttributes(data) {
    return request({
      url: '/mall/coupon/getCouponPageByAttributes',
      method: 'post',
      params:data
    })
  }

 
  export function removeCoupon(couponId) {
    return request({
      url: '/mall/coupon/removeCoupon/'+couponId,
      method: 'delete',
    })
  }



export function saveOrModifyCoupon(data) {
    return request({
      url: '/mall/coupon/saveOrModifyCoupon',
      method: 'post',
      data:data
    })
  }