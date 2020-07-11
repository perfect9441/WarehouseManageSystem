import request from '@/utils/request'

export function getPropValuePageByAttributes(params) {
    return request({
        url: 'wms/propValue/getPropValuePageByAttributes',
        method: 'post',
        params:params
    })
}

export function getPropValueById(propValueId) {
    return request({
        url: 'wms/propValue/getPropValueById/'+propValueId,
        method: 'get',
    })
}

export function removePropValue(propValueId) {
    return request({
        url: 'wms/propValue/removePropValue/'+propValueId,
        method: 'delete',
    })
}

export function saveOrModifyPropValue(data) {
    return request({
        url: 'wms/propValue/saveOrModifyPropValue',
        method: 'post',
        data:data
    })
}