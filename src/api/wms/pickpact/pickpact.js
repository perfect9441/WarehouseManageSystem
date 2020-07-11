import request from '@/utils/request'


export function getPickPactById(pickPactId) {
    return request({
        url: 'wms/pickPact/getPickPactById/' + pickPactId,
        method: 'get',
    })
}

export function getPickPactPage({ current, size }) {
    return request({
        url: 'wms/pickPact/getPickPactPage?current=' + current + '&size=' + size,
        method: 'get',
    })
}

export function getPickPactPageByAttributes(params) {
    return request({
        url: 'wms/pickPact/getPickPactPageByAttributes',
        method: 'post',
        params: params
    })
}

export function removePickPact(pickPactId) {
    return request({
        url: 'wms/pickPact/removePickPact/' + pickPactId,
        method: 'delete',
    })
}

export function saveOrModifyPickPact(data) {
    return request({
        url: 'wms/pickPact/saveOrModifyPickPact',
        method: 'post',
        data: data
    })
}