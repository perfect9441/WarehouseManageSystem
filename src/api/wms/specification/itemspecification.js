import request from '@/utils/request'

export function getItemSpecById(itemSpecId) {
    return request({
        url: 'wms/itemSpec/getItemSpecById/' + itemSpecId,
        method: 'get',
    })
}

export function getItemSpecPage({ current, size }) {
    return request({
        url: 'wms/itemSpec/getItemSpecPage?current=' + current + '&size=' + size,
        method: 'get',
    })
}

export function getItemSpecPageByAttributes(params) {
    return request({
        url: 'wms/itemSpec/getItemSpecPageByAttributes',
        method: 'post',
        params: params
    })
}

export function removeItemSpec(itemSpecId) {
    return request({
        url: 'wms/itemSpec/removeItemSpec/' + itemSpecId,
        method: 'delete',
    })
}

export function saveOrModifyItemSpec(data) {
    return request({
        url: 'wms/itemSpec/saveOrModifyItemSpec',
        method: 'post',
        data: data
    })
}