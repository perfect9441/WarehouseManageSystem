import request from '@/utils/request'

export function getCompanyPage({current,size}) {
  return request({
    url: '/wms/company/getCompanyPage?current='+current+'&size='+size,
    method: 'get',
  })
}

export function getCompanyPageCarryParentCompany({current,size}) {
  return request({
    url: '/wms/company/getCompanyPageCarryParentCompany?current='+current+'&size='+size,
    method: 'get',
  })
}

export function getParentCompanyByChildCompanyId(childcompanyid) {
  return request({
    url: '/wms/company/getParentCompanyByChildCompanyId/'+childcompanyid,
    method: 'get',
  })
}

export function getChildCompanyListByCompanyId(companyid) {
  return request({
    url: '/wms/company/getChildCompanyListByCompanyId/'+companyid,
    method: 'get',
  })
}

export function getCompanyById(companyiId) {
    return request({
      url: 'wms/company/getCompanyById/'+companyiId,
      method: 'get',
    })
  }


export function saveOrModifyCompany(data) {
    return request({
      url: '/wms/company/saveOrModifyCompany',
      method: 'post',
      data:data
    })
  }

  
export function getCompanyPageByAttributes(data) {
  return request({
    url: '/wms/company/getCompanyPageByAttributes',
    method: 'post',
    params:data
  })
}


