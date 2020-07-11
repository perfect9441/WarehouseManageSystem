import request from '@/utils/request'

export function getAddrById(addrId) {

	return request({
		url: '/mms/addr/getAddrById/'+addrId,
		method: 'get',

	})
}