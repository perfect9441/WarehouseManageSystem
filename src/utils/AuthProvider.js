const qs = require('qs');
import {getToken, setToken, removeToken} from '@/utils/auth'
import axios from 'axios'

function token(data) {
  return axios({
    url: process.env.VUE_APP_BASE_API + '/token/oauth/token',
    method: 'post',
    data: qs.stringify(data),
    auth: {
      username: '18209477705',
      password: '123456'
    },
  })
}

export function refreshToken(data) {
  return axios({
    url: process.env.VUE_APP_BASE_API + '/token/oauth/token',
    method: 'post',
    data: qs.stringify(data),
    auth: {
      username: '18209477705',
      password: '123456'
    },
  })
}

export function onLogin(data) {

  return new Promise(function (resolve, reject) {
    token(data).then(res => {
      console.info('onLogin')
      console.info(res)
      if(res.data.access_token){
        saveTokens(res.data.access_token, res.data.refresh_token, res.data.expires_in);
        resolve(res)
      }else{
        reject(res)
      }
    
    }).catch(err=>{
      console.info(err)
      reject(err)
    })
  })
}

/*刷新时删除已有的access_token防止再次刷新*/
function setWait() {
  removeToken('access_token');

}


function saveTokens(access_token, refresh_token, expires_in) {
  // console.info('saveTokens')
  setToken('access_token', access_token)
  setToken('refresh_token', refresh_token)
  let exp = new Date();
  let expires_ins = exp.getTime() + expires_in * 1000 - 30000;
  setToken('expires_in', expires_ins)

}

function onRefreshToken() {
  setWait();
  return new Promise(function (resolve, reject) {

    let data = {
      grant_type: 'refresh_token',
      refresh_token: getToken('refresh_token')
    }
    refreshToken(data).then(res => {
     
      console.info('refreshToken')
      console.info(res)
      saveTokens(res.data.access_token, res.data.refresh_token, res.data.expires_in);
      resolve(res.data.access_token)
    }).catch(err => {
      //refreshtoken过期
      console.info('refreshtoken过期')
      reject(false)
    })

  })
}

export function getAccessToken() {
  let date = new Date();
  let dt = date.getTime();
  let expires_in = getToken('expires_in');
  // let expires_in = 100;
  // TODO:处理503错误,过期刷新不起作用
  if ((!expires_in || dt >= expires_in) && getToken('access_token')) {
    //access_token 过期刷新
    console.info('access_token 过期刷新')
    return onRefreshToken();
  } else if (!getToken('access_token')) {
    //正在进行refresh，等待两秒钟后刷新access_token后再进行
    return new Promise((resolve, reject) => {
      console.info('等待2秒')
     
      setTimeout(() => {
        if(getToken('access_token')){
          console.info('获取token成功')
          resolve(getToken('access_token'))
        }else{
          console.info('获取token失败')
          reject(false)
        }
        
      }, 2000)
    })
  } else {
    return new Promise((resolve, reject) => {
      // console.info('成功获取token')
      // console.info(getToken('access_token'))
      resolve(getToken('access_token'))
    })
  }

}


// module.exports = {
//   onLogin: onLogin,
//   getAccessToken: getAccessToken
// }
