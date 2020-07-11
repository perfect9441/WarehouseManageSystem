import request from '@/utils/request'

export function getOutPactrByAttributes(params) {
    return request({
        url: 'wms/recordOut/getOutPactrByAttributes',
        method: 'post',
        params:params
    })
}

export function getRecordOutById(recordOutId) {
    return request({
        url: 'wms/recordOut/getRecordOutById/' + recordOutId,
        method: 'get',
    })
}

export function getRecordOutPage({ current, size }) {
    return request({
        url: 'wms/recordOut/getRecordOutPage?current=' + current + '&size=' + size,
        method: 'get',
    })
}

export function getRecordOutPageByAttributes(params) {
    return request({
        url: 'wms/recordOut/getRecordOutPageByAttributes',
        method: 'post',
        params:params
    })
}

export function removeRecordOut(recordOutId) {
    return request({
        url: 'wms/recordOut/removeRecordOut/' + recordOutId,
        method: 'delete',
    })
}

export function saveOrModifyRecordOut(data) {
    return request({
        url: 'wms/recordOut/saveOrModifyRecordOut',
        method: 'post',
        data: data
    })
}