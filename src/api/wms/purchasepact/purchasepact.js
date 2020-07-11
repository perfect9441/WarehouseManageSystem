import request from '@/utils/request'


export function getPurchasePactById(purchasePactId) {
    return request({
        url: 'wms/purchasePact/getPurchasePactById/' + purchasePactId,
        method: 'get',
    })
}

export function getPurchasePactPage({ current, size }) {
    return request({
        url: 'wms/purchasePact/getPurchasePactPage?current=' + current + '&size=' + size,
        method: 'get',
    })
}

export function getPurchasePactPageByAttributes(params) {
    return request({
        url: 'wms/purchasePact/getPurchasePactPageByAttributes',
        method: 'post',
        params: params
    })
}

export function removePurchasePact(purchasePactId) {
    return request({
        url: 'wms/purchasePact/removePurchasePact/' + purchasePactId,
        method: 'delete',
    })
}

export function saveOrModifyPurchasePact(data) {
    return request({
        url: 'wms/purchasePact/saveOrModifyPurchasePact',
        method: 'post',
        data: data
    })
}