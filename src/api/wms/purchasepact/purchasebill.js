import request from '@/utils/request'


export function getPurchaseBillById(purchaseBillId) {
    return request({
        url: 'wms/purchaseBill/getPurchaseBillById/' + purchaseBillId,
        method: 'get',
    })
}

export function getPurchaseBillListWithShoudInNumber(params) {
    return request({
        url: 'wms/purchaseBill/getPurchaseBillListWithShoudInNumber',
        method: 'get',
        params:params
    })
}

export function getPurchaseBillPage({ current, size }) {
    return request({
        url: 'wms/purchaseBill/getPurchaseBillPage?current=' + current + '&size=' + size,
        method: 'get',
    })
}

export function getPurchaseBillPageByAttributes(params) {
    return request({
        url: 'wms/purchaseBill/getPurchaseBillPageByAttributes',
        method: 'post',
        params: params
    })
}

export function removePurchaseBill(purchaseBillId) {
    return request({
        url: 'wms/purchaseBill/removePurchaseBill/' + purchaseBillId,
        method: 'delete',
    })
}

export function removePurchaseBillsByPurchaseBillIdList(data) {
    return request({
        url: 'wms/purchaseBill/removePurchaseBillsByPurchaseBillIdList' ,
        method: 'delete',
        data:data
    })
}

export function saveOrModifyPurchaseBill(data) {
    return request({
        url: 'wms/purchaseBill/saveOrModifyPurchaseBill',
        method: 'post',
        data: data
    })
}

export function saveOrModifyBatchPurchaseBillList(data) {
    return request({
        url: 'wms/purchaseBill/saveOrModifyBatchPurchaseBillList',
        method: 'post',
        data: data
    })
}