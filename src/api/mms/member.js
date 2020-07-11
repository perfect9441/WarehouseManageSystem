import request from '@/utils/request'






//更换接口
export function getMemberPageByAttributes(data) {
  return request({
    url: '/mms/member/getMemberPageByAttributes',
    method: 'post',
    params:data
  })
}

export function modifyMember(data) {
    return request({
      url: '/mms/member/modifyMember',
      method: 'post',
      data:data
    })
  }


