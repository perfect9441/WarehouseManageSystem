import request from '@/utils/request'

export function getPickBillById(pickBillId) {
    return request({
        url: 'wms/pickBill/getPickBillById/' + pickBillId,
        method: 'get',
    })
}

export function getPickBillPage({ current, size }) {
    return request({
        url: 'wms/pickBill/getPickBillPage?current=' + current + '&size=' + size,
        method: 'get',
    })
}

export function getPickBillPageByAttributes(params) {
    return request({
        url: 'wms/pickBill/getPickBillPageByAttributes',
        method: 'post',
        params: params
    })
}

export function removeBatchPickBill(data) {
    return request({
        url: 'wms/pickBill/removeBatchPickBill',
        method: 'delete',
        data:data
    })
}

export function removePickBill(pickBillId) {
    return request({
        url: 'wms/pickBill/removePickBill/' + pickBillId,
        method: 'delete',
    })
}

export function saveOrModifyBatchPickBill(data) {
    return request({
        url: 'wms/pickBill/saveOrModifyBatchPickBill',
        method: 'post',
        data: data
    })
}

export function saveOrModifyPickBill(data) {
    return request({
        url: 'wms/pickBill/saveOrModifyPickBill',
        method: 'post',
        data: data
    })
}

export function getPickBillListWithAllowedOutNumber(params) {
    return request({
        url: 'wms/pickBill/getPickBillListWithAllowedOutNumber',
        method: 'get',
        params:params
    })
}
