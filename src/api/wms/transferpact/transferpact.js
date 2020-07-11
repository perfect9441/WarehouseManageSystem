import request from '@/utils/request'

export function getTransferPactById(transferPactId) {
    return request({
        url: 'wms/transferPact/getTransferPactById/' + transferPactId,
        method: 'get',
    })
}

export function getTransferPactPage({ current, size }) {
    return request({
        url: 'wms/transferPact/getTransferPactPage?current=' + current + '&size=' + size,
        method: 'get',
    })
}

export function getTransferPactPageByAttributes(params) {
    return request({
        url: 'wms/transferPact/getTransferPactPageByAttributes',
        method: 'post',
        params: params
    })
}

export function removeTransferPact(transferPactId) {
    return request({
        url: 'wms/transferPact/removeTransferPact/' + transferPactId,
        method: 'delete',
    })
}

export function saveOrModifyTransferPact(data) {
    return request({
        url: 'wms/transferPact/saveOrModifyTransferPact',
        method: 'post',
        data: data
    })
}