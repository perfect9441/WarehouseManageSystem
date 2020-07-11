import request from '@/utils/request'

export function getOutPactById(outPactId) {
    return request({
        url: 'wms/outPact/getOutPactById/' + outPactId,
        method: 'get',
    })
}

export function getOutPactPage({ current, size }) {
    return request({
        url: 'wms/outPact/getOutPactPage?current=' + current + '&size=' + size,
        method: 'get',
    })
}

export function getOutPactPageByAttributes(params) {
    return request({
        url: 'wms/outPact/getOutPactPageByAttributes',
        method: 'get',
        params:params
    })
}

export function removeOutPact(outPactId) {
    return request({
        url: 'wms/outPact/removeOutPact/' + outPactId,
        method: 'delete',
    })
}

export function saveOrModifyOutPact(data) {
    return request({
        url: 'wms/outPact/saveOrModifyOutPact',
        method: 'post',
        data: data
    })
}