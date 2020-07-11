import request from '@/utils/request'

export function getRefundPactById(refundPactId) {
    return request({
        url: 'wms/refundPact/getRefundPactById/' + refundPactId,
        method: 'get',
    })
}

export function getRefundPactPageByAttributes(params) {
    return request({
        url: 'wms/refundPact/getRefundPactPageByAttributes',
        method: 'post',
        params:params
    })
}

export function getRefundPactPage({ current, size }) {
    return request({
        url: 'wms/refundPact/getRefundPactPage?current=' + current + '&size=' + size,
        method: 'get',
    })
}

export function removeRefundPact(refundPactId) {
    return request({
        url: 'wms/refundPact/removeRefundPact/' + refundPactId,
        method: 'delete',
    })
}

export function saveOrModifyRefundPact(data) {
    return request({
        url: 'wms/refundPact/saveOrModifyRefundPact',
        method: 'post',
        data: data
    })
}