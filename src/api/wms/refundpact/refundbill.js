import request from '@/utils/request'

export function getRefundBillById(refundBillId) {
    return request({
        url: 'wms/refundBill/getRefundBillById/' + refundBillId,
        method: 'get',
    })
}

export function getRefundBillPage({ current, size }) {
    return request({
        url: 'wms/refundBill/getRefundBillPage?current=' + current + '&size=' + size,
        method: 'get',
    })
}

export function getRefundBillPageByAttributes(params) {
    return request({
        url: 'wms/refundBill/getRefundBillPageByAttributes' ,
        method: 'post',
        params:params
    })
}

export function removeRefundBill(refundBillId) {
    return request({
        url: 'wms/refundBill/removeRefundBill/' + refundBillId,
        method: 'delete',
    })
}

export function removeBatchRefundBill(data) {
    return request({
        url: 'wms/refundBill/removeBatchRefundBill' ,
        method: 'delete',
        data:data
    })
}

export function saveOrModifyRefundBill(data) {
    return request({
        url: 'wms/refundBill/saveOrModifyRefundBill',
        method: 'post',
        data: data
    })
}

export function saveOrModifyBatchRefundBill(data) {
    return request({
        url: 'wms/refundBill/saveOrModifyBatchRefundBill',
        method: 'post',
        data: data
    })
}