import request from '@/utils/request'

export function getRecordInById(recordInId) {
    return request({
        url: 'wms/recordIn/getRecordInById/' + recordInId,
        method: 'get',
    })
}

export function getInPactByAttributes(params) {
    return request({
        url: 'wms/recordIn/getInPactByAttributes',
        method: 'post',
        params:params
    })
}

export function getRecordInPage({ current, size }) {
    return request({
        url: 'wms/recordIn/getRecordInPage?current=' + current + '&size=' + size,
        method: 'get',
    })
}

export function getRecordInPageByAttributes(params) {
    return request({
        url: 'wms/recordIn/getRecordInPageByAttributes',
        method: 'post',
        params:params
    })
}

export function removeRecordIn(recordInId) {
    return request({
        url: 'wms/recordIn/removeRecordIn/' + recordInId,
        method: 'delete',
    })
}

export function saveOrModifyBatchRecordIn(data) {
    return request({
        url: 'wms/recordIn/saveOrModifyBatchRecordIn',
        method: 'post',
        data: data
    })
}

export function saveOrModifyRecordIn(data) {
    return request({
        url: 'wms/recordIn/saveOrModifyRecordIn',
        method: 'post',
        data: data
    })
}