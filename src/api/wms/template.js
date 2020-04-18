import request from '@/utils/request'



export function saveOrModifyChannel(data) {
  return request({
    url: '/lmm/channel/saveOrModifyChannel',
    method: 'post',
    data:data
  })
}

export function getChannelListBychannelType(channelType) {
    return request({
      url: '/lmm/channel/getChannelListBychannelType/'+channelType,
      method: 'get',
    
    })
  }

  export function getOrgPage(params) {
    return request({
      url: '/lmm/org/getOrgPage',
      method: 'get',
      params:params //params自动解析query参数
    })
  }