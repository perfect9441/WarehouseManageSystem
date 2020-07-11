import request from '@/utils/request'

export function getStorageById(storageId) {
    return request({
        url: 'wms/storage/getStorageById/' + storageId,
        method: 'get',
    })
}

export function getStoragePage({ current, size }) {
    return request({
        url: 'wms/storage/getStoragePage?current=' + current + '&size=' + size,
        method: 'get',
    })
}

export function getStoragePageByAttributes(params) {
    return request({
        url: 'wms/storage/getStoragePageByAttributes',
        method: 'post',
        params: params
    })
}

export function removeStorage(storageId) {
    return request({
        url: 'wms/storage/removeStorage/' + storageId,
        method: 'delete',
    })
}

export function saveOrModifyStorage(data) {
    return request({
        url: 'wms/storage/saveOrModifyStorage',
        method: 'post',
        data: data
    })
}

export function purchaseInStorage(data,warehouseId) {
    return request({
        url: 'wms/storage/purchaseInStorage/'+warehouseId,
        method: 'post',
        data: data
    })
}

export function pickOutStorage(data,warehouseId) {
    return request({
        url: 'wms/storage/pickOutStorage/'+warehouseId,
        method: 'post',
        data: data
    })
}

export function transferInStorage(data) {
    return request({
        url: 'wms/storage/transferInStorage',
        method: 'post',
        data: data
    })
}

export function transferOutStorage(data) {
    return request({
        url: 'wms/storage/transferOutStorage',
        method: 'post',
        data: data
    })
}

export function transferOnceStepStorage(data) {
    return request({
        url: 'wms/storage/transferOnceStepStorage',
        method: 'post',
        data: data
    })
}

export function brokenOutStorage(data) {
    return request({
        url: 'wms/storage/brokenOutStorage',
        method: 'post',
        data: data
    })
}

export function refundInStorage(data) {
    return request({
        url: 'wms/storage/refundInStorage',
        method: 'post',
        data: data
    })
}

export function setUpWarehouseLocation(data) {
    return request({
        url: 'wms/storage/setUpWarehouseLocation',
        method: 'post',
        data: data
    })
}
