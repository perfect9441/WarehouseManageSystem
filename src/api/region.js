import request from '@/utils/request'




export function getRegionPageByAttributes(data) {
  return request({
    url: '/rbac/region/getRegionPageByAttributes',
    method: 'post',
    params:data
  })
}

export function saveOrModifyRegion(data) {
  return request({
    url: '/rbac/region/saveOrModifyRegion',
    method: 'post',
    data:data
  })
}


export function removeRegion(regionId) {
  return request({
    url: '/rbac/region/removeRegion/'+regionId,
    method: 'delete',
  })
}





