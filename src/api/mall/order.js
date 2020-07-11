import request from '@/utils/request'


export function getOrderPageByAttributes(data) {
    return request({
      url: '/mall/order/getOrderPageByAttributes',
      method: 'post',
      params:data
    })
  }

  export function getOrderWithOrderItemAndGoodsDetail(orderId) {
    
	return request({
		url: '/mall/order/getOrderWithOrderItemAndGoodsDetail/'+orderId,
		method: 'get',
	
	})
}