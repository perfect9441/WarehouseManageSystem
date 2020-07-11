import request from '@/utils/request'

export function getSpecificationById(specificationId) {
    return request({
        url: 'wms/specification/getSpecificationById/' + specificationId,
        method: 'get',
    })
}

export function getSpecificationPage({ current, size }) {
    return request({
        url: 'wms/specification/getSpecificationPage?current=' + current + '&size=' + size,
        method: 'get',
    })
}

export function getSpecificationPageByAttributes(params) {
    return request({
        url: 'wms/specification/getSpecificationPageByAttributes',
        method: 'post',
        params: params
    })
}

export function removeSpecification(specificationId) {
    return request({
        url: 'wms/specification/removeSpecification/' + specificationId,
        method: 'delete',
    })
}

export function saveOrModifySpecification(data) {
    return request({
        url: 'wms/specification/saveOrModifySpecification',
        method: 'post',
        data: data
    })
}