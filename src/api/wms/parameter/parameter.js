import request from '@/utils/request'

export function getPropById(propId) {
    return request({
        url: 'wms/prop/getPropById/' + propId,
        method: 'get',
    })
}
export function getPropPage({ current, size }) {
    return request({
        url: 'wms/prop/getPropPage?current=' + current + '&size=' + size,
        method: 'get',
    })
}

export function getPropPageByAttributes(params) {
    return request({
        url: 'wms/prop/getPropPageByAttributes',
        method: 'post',
        params: params
    })
}

export function removeProp(propId) {
    return request({
        url: 'wms/prop/removeProp/' + propId,
        method: 'delete',
    })
}

export function saveOrModifyProp(data) {
    return request({
        url: 'wms/prop/saveOrModifyProp',
        method: 'post',
        data: data
    })
}