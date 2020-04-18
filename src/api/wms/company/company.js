import request from '@/utils/request'

export function getCompanyPage({current,size}) {
  return request({
    url: '/wms/company/getCompanyPage?current='+current+'&size='+size,
    method: 'get',
  })
}


export function getCompanyById(companyiId) {
    return request({
      url: '/wms/company/getCompanyById?companyId='+companyiId,
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
