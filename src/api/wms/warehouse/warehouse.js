import request from '@/utils/request'

export function getWarehouseById(worehouseId) {
  return request({
    url: 'wms/warehouse/getWarehouseById/' + worehouseId,
    method: 'get',
  })
}

export function getWarehousePage({current,size}) {
  return request({
    url: 'wms/warehouse/getWarehousePage?current=' + current + '&size=' + size,
    method: 'get',
  })
}

export function getWarehousePageCarryCompany({current,size}) {
  return request({
    url: 'wms/warehouse/getWarehousePageCarryCompany?current=' + current + '&size=' + size,
    method: 'get',
  })
}

export function saveOrModifyWarehouse(data) {
  return request({
    url: '/wms/warehouse/saveOrModifyWarehouse',
    method: 'post',
    data: data
  })
}


export function getWarehousePageByAttributes(data) {
  return request({
    url: '/wms/warehouse/getWarehousePageByAttributes',
    method: 'post',
    params: data
  })
}
