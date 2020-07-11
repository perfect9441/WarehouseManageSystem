import request from '@/utils/request'

export function getItemDetailPageByAttributes(params) {
    return request({
        url: 'wms/itemDetail/getItemDetailPageByAttributes',
        method: 'post',
        params:params
    })
}

export function getItemDetailById(itemDetailId) {
    return request({
        url: 'wms/itemDetail/getItemDetailById/'+itemDetailId,
        method: 'get',
    })
}

export function removeItemDetail(itemDetailId) {
    return request({
        url: 'wms/itemDetail/removeItemDetail/'+itemDetailId,
        method: 'delete',
    })
}


export function saveOrModifyItemDetail(data) {
    return request({
        url: 'wms/itemDetail/saveOrModifyItemDetail',
        method: 'post',
        data:data
    })
}