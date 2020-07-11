import request from '@/utils/request'

export function getBrokenBillById(brokenBillId) {
    return request({
        url: 'wms/brokenBill/getBrokenBillById/' + brokenBillId,
        method: 'get',
    })
}

export function getBrokenBillPage({ current, size }) {
    return request({
        url: 'wms/brokenBill/getBrokenBillPage?current=' + current + '&size=' + size,
        method: 'get',
    })
}

export function getBrokenBillPageByAttributes(params) {
    return request({
        url: 'wms/brokenBill/getBrokenBillPageByAttributes',
        method: 'post',
        params:params
    })
}

export function removeBatchBrokenBill(data) {
    return request({
        url: 'wms/brokenBill/removeBatchBrokenBill',
        method: 'delete',
        data:data
    })
}

export function removeBrokenBill(brokenBillId) {
    return request({
        url: 'wms/brokenBill/removeBrokenBill/' + brokenBillId,
        method: 'delete',
    })
}

export function saveOrModifyBrokenBill(data) {
    return request({
        url: 'wms/brokenBill/saveOrModifyBrokenBill',
        method: 'post',
        data: data
    })
}

export function saveOrModifyBatchBrokenBill(data) {
    return request({
        url: 'wms/brokenBill/saveOrModifyBatchBrokenBill',
        method: 'post',
        data: data
    })
}