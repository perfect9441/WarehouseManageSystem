import request from '@/utils/request'

export function getBrokenPactById(brokenPactId) {
    return request({
        url: 'wms/brokenPact/getBrokenPactById/' + brokenPactId,
        method: 'get',
    })
}

export function getBrokenPactPage({ current, size }) {
    return request({
        url: 'wms/brokenPact/getBrokenPactPage?current=' + current + '&size=' + size,
        method: 'get',
    })
}

export function getBrokenPactPageByAttributes(data) {
    return request({
        url: 'wms/brokenPact/getBrokenPactPageByAttributes',
        method: 'post',
        data:data
    })
}
export function removeBrokenPact(brokenPactId) {
    return request({
        url: 'wms/brokenPact/removeBrokenPact/' + brokenPactId,
        method: 'delete',
    })
}

export function saveOrModifyBrokenPact(data) {
    return request({
        url: 'wms/brokenPact/saveOrModifyBrokenPact',
        method: 'post',
        data: data
    })
}