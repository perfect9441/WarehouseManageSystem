import request from '@/utils/request'

export function getItemAttrById(itemAttrId) {
    return request({
        url: 'wms/itemAttr/getItemAttrById/' + itemAttrId,
        method: 'get',
    })
}

export function getItemAttrPage({ current, size }) {
    return request({
        url: 'wms/itemAttr/getItemAttrPage?current=' + current + '&size=' + size,
        method: 'get',
    })
}

export function getItemAttrPageByAttributes(params) {
    return request({
        url: 'wms/itemAttr/getItemAttrPageByAttributes',
        method: 'post',
        params: params
    })
}

export function removeItemAttr(itemAttrId) {
    return request({
        url: 'wms/itemAttr/removeItemAttr/' + itemAttrId,
        method: 'delete',
    })
}

export function saveOrModifyItemAttr(data) {
    return request({
        url: 'wms/itemAttr/saveOrModifyItemAttr',
        method: 'post',
        data: data
    })
}