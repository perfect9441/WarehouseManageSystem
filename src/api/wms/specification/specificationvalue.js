import request from '@/utils/request'

export function getSpecificationValuePageByAttributes(params) {
    return request({
        url: 'wms/specificationValue/getSpecificationValuePageByAttributes',
        method: 'post',
        params:params
    })
}

export function getSpecificationValueById(specificationValueId) {
    return request({
        url: 'wms/specificationValue/getSpecificationValueById/'+specificationValueId,
        method: 'get',
    })
}

export function removeSpecificationValue(specificationValueId) {
    return request({
        url: 'wms/specificationValue/removeSpecificationValue/'+specificationValueId,
        method: 'delete',
    })
}

export function saveOrModifySpecificationValue(data) {
    return request({
        url: 'wms/specificationValue/saveOrModifySpecificationValue',
        method: 'post',
        data:data
    })
}