import request from '@/utils/request'

export function getItemById(itemId) {
    return request({
        url: 'wms/item/getItemById/' + itemId,
        method: 'get',
    })
}

export function getItemPage({ current, size }) {
    return request({
        url: 'wms/item/getItemPage?current=' + current + '&size=' + size,
        method: 'get',
    })
}

export function getItemPageByAttributes(params) {
    return request({
        url: 'wms/item/getItemPageByAttributes',
        method: 'post',
        params: params
    })
}

export function removeProp(itemId) {
    return request({
        url: 'wms/item/removeItem/' + itemId,
        method: 'delete',
    })
}

export function saveOrModifyItem(data) {
    return request({
        url: 'wms/item/saveOrModifyItem',
        method: 'post',
        data: data
    })
}