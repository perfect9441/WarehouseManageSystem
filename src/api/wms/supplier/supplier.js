import request from '@/utils/request'

export function getSupplierById(supplierId) {
  return request({
    url: 'wms/supplier/getSupplierById/' + supplierId,
    method: 'get',
  })
}

export function getSupplierPage({current,size}) {
  return request({
    url: 'wms/supplier/getSupplierPage?current=' + current + '&size=' + size,
    method: 'get',
  })
}

export function saveOrModifySupplier(data) {
  return request({
    url: '/wms/supplier/saveOrModifySupplier',
    method: 'post',
    data: data
  })
}

export function getSupplierPageByAttributes(data) {
  return request({
    url: '/wms/supplier/getSupplierPageByAttributes',
    method: 'post',
    params: data
  })
}

export function removeSupplier(supplierId) {
  return request({
    url: '/wms/supplier/removeSupplier/'+supplierId,
    method: 'delete',
  })
}
