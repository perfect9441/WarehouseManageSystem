import request from '@/utils/request'

export function getTransferBillById(transferBillId) {
    return request({
        url: 'wms/transferBill/getTransferBillById/' + transferBillId,
        method: 'get',
    })
}

export function getTransferBillPage({ current, size }) {
    return request({
        url: 'wms/transferBill/getTransferBillPage?current=' + current + '&size=' + size,
        method: 'get',
    })
}

export function getTransferBillPageByAttributes(params) {
    return request({
        url: 'wms/transferBill/getTransferBillPageByAttributes',
        method: 'post',
        params: params
    })
}

export function removeBatchTransferBill(data) {
    return request({
        url: 'wms/transferBill/removeBatchTransferBill',
        method: 'delete',
        data:data
    })
}

export function removeTransferBill(transferBillId) {
    return request({
        url: 'wms/transferBill/removeTransferBill/' + transferBillId,
        method: 'delete',
    })
}

export function saveOrModifyBatchTransferBill(data) {
    return request({
        url: 'wms/transferBill/saveOrModifyBatchTransferBill',
        method: 'post',
        data: data
    })
}

export function saveOrModifyTransferBill(data) {
    return request({
        url: 'wms/transferBill/saveOrModifyTransferBill',
        method: 'post',
        data: data
    })
}

export function getTransferBillListWithAllowedOutNumber(params) {
    return request({
        url: 'wms/transferBill/getTransferBillListWithAllowedOutNumber',
        method: 'get',
        params:params
    })
}
