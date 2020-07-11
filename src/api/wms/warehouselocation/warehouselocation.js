import request from '@/utils/request'

export function getWarehouseLocationById(warehouseLocationId) {
  return request({
    url: 'wms/warehouseLocation/getWarehouseLocationById/' + warehouseLocationId,
    method: 'get',
  })
}

export function getWarehouseLocationPage({
  current,
  size
}) {
  return request({
    url: 'wms/warehouseLocation/getWarehouseLocationPage?current=' + current + '&size=' + size,
    method: 'get',
  })
}

export function getWarehouseLocationPageByAttributes(params) {
  return request({
    url: '/wms/warehouseLocation/getWarehouseLocationPageByAttributes',
    method: 'post',
    params: params
  })
}

export function saveOrModifyWarehouseLocation(data) {
  return request({
    url: '/wms/warehouseLocation/saveOrModifyWarehouseLocation',
    method: 'post',
    data: data
  })
}

export function saveOrModifyBatchWarehouseLocation(data) {
  return request({
    url: '/wms/warehouseLocation/saveOrModifyBatchWarehouseLocation',
    method: 'post',
    data: data
  })
}

export function removeWarehouseLocation(warehouseLocationId) {
  return request({
    url: '/wms/warehouseLocation/removeWarehouseLocation/' + warehouseLocationId,
    method: 'delete',
  })
}

export function removeBatchWarehouseLocation(data) {
    return request({
      url: '/wms/warehouseLocation/removeBatchWarehouseLocation' ,
      method: 'delete',
      data:data
    })
  }
