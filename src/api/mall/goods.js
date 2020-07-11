import request from '@/utils/request'


export function saveOrModifyGoodsAndOthers(data) {
  return request({
    url: '/mall/biz/saveOrModifyGoodsAndOthers',
    method: 'post',
    data:data
  })
}


export function getGoodsPageByAttributes(data) {
    return request({
      url: '/mall/goods/getGoodsPageByAttributes',
      method: 'post',
      params:data
    })
  }

  export function getGoodsById(goodsId) {
    return request({
      url: '/mall/goods/getGoodsById/'+goodsId,
      method: 'get',
    })
  }
 
  export function removeGoods(goodsId) {
    return request({
      url: '/mall/goods/removeGoods/'+goodsId,
      method: 'delete',
    })
  }


export function saveOrModifyGoods(data) {
    return request({
      url: '/mall/goods/saveOrModifyGoods',
      method: 'post',
      data:data
    })
  }


export function getGoodsAndOthersByGoodsId(goodsId) {
  return request({
    url: '/mall/biz/getGoodsAndOthersByGoodsId?goodsId='+goodsId,
    method: 'get',
  })
}


export function modifyGoodsDetail(data) {
  return request({
    url: '/mall/goodsDetail/modifyGoodsDetail',
    method: 'put',
    data:data
  })
}
export function removeGoodsResource(goodsResourceId) {
  return request({
    url: '/mall/goodsResource/removeGoodsResource/'+goodsResourceId,
    method: 'delete',
  })
}

export function saveGoodsResource(data) {
  return request({
    url: '/mall/goodsResource/saveGoodsResource',
    method: 'post',
    data:data
  })
}

export function saveGoodsAttrForGoods(goodsId,data) {
  return request({
    url: '/mall/goodsAttr/saveGoodsAttrForGoods/'+goodsId,
    method: 'post',
    data:data
  })
}
export function removeGoodsAttrByGoodsIdAndPropValueId(goodsId,propValueId) {
  return request({
    url: '/mall/goodsAttr/removeGoodsAttrByGoodsIdAndPropValueId/'+goodsId+'/'+propValueId,
    method: 'delete',
  })
}


