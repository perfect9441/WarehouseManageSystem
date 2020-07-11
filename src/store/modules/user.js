
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'
import {
  onLogin
} from '@/utils/AuthProvider'
import {
  resetRouter
} from '@/router'
import {
  getAdminByPrincipal
} from '@/api/user'
import Vue from 'vue'




const state = {
  token: '',
  name: '',
  avatar: '',
  roles: [],
  dict: {},
  userInfo: {},

}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_DICT: (state, dict) => {
    state.dict = dict
  },
}

const actions = {
  // user login
  login({
    commit
  }, userInfo) {
    const {
      username,
      password
    } = userInfo
    let info = {}
    info.grant_type = 'password'
    info.username = username.trim()
    info.password = password

    return new Promise((resolve, reject) => {
      onLogin(info).then(response => {
        let data = response
        console.info('login-success')
        console.info(response)
        
        setToken('empname', info.username)
        resolve()
      }).catch(error => {
        console.info('login-err')
        console.info(error)
        reject(error)
      })

    })
  },

  // get user info
  getInfo({ 
    commit,
    state,
    dispatch
  }) {
    return new Promise(async (resolve, reject) => {

    
      let adminToken = {
        roles: ['ADMIN'],
        introduction: 'I am a super administrator',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'Super Admin',
        username:'admin'
      }
      let editorToken = {
        roles: ['editor'],
        introduction: 'I am an editor',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'Normal Editor'
      }
      let userInfo={}
      commit('SET_AVATAR', adminToken.avatar)
      commit('SET_ROLES', adminToken.roles)
     
       await  getAdminByPrincipal().then(res=>{
        console.info('getAdminByPrincipal')
        console.info(res)
        commit('SET_USERINFO', res.data)
        
      })
      //连接websocket
      Vue.prototype.$connect()
      Vue.prototype.$store.dispatch('websocket/_GetUnReadMsgList')
      // await getEmpByEmpName(getToken('empname')).then(res => {
      //   console.info('getEmpByEmpName')
      //   console.info(res)
      //   commit('SET_NAME', res.data.empNickname)
      //   if (res.data.avator) {
      //     commit('SET_AVATAR', getDownloadFilePath()+res.data.avator)
      //     console.info('avator')
      //     console.info(state.avatar)

      //   } else {
      //     commit('SET_AVATAR', adminToken.avatar)
      //   }

      //   userInfo=res.data
      //   commit('SET_USERINFO', res.data)

      // }).catch(err=>{
      //   reject(err)
      // })

      //TODO:获取Role

      // await getPowerSetByUserName(getToken('empname')).then(res=>{
      //   console.info('getPowerSetByEmpName')
      //   console.info(res)
      //   let tempRole=[]
      //   for(let i=0;i<res.data.length;i++){
      //     tempRole.push(res.data[i].pwName)
      //   }
      //   if(tempRole.length!=0){
      //     commit('SET_ROLES', tempRole)
      //   }else{
  
      //     //当用户的
      //     commit('SET_ROLES', ['putong'])
          
  
      //   }
       
      // }).catch(err=>{
      //   reject(err)
      // })


      
      
      


      // await getDictPage().then(res => {
      //   console.info('getDictPage')
      //   console.info(res)
      //   let item = {}
      //   for (let i = 0; i < res.data.records.length; i++) {
      //     item[res.data.records[i].dictCode] = {
      //       dictCode: res.data.records[i].dictCode,
      //       dictName: res.data.records[i].dictName,
      //       dictType: res.data.records[i].dictType,
      //       dictDesc: res.data.records[i].dictDesc,
      //       dictValue: res.data.records[i].dictValue,
      //     }
      //   }
      //   commit('SET_DICT', item)
      //   // console.info('SET_DICT')
      //   // console.info(item)
      // }).catch(err=>{
      //   reject(err)
      // })
      let info={
        roles:state.roles
      }
      resolve(info)




    })
  },

  // user logout
  logout({
    commit,
    dispatch,
    state
  }) {
    return new Promise((resolve, reject) => {

      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken('access_token')
      removeToken('empname')
      resetRouter()
      dispatch('tagsView/delAllViews', null, { root: true })
      Vue.prototype.$disconnect()
      resolve()
      
    })
  },

  // remove token
  resetToken({
    commit
  }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken('access_token')
      removeToken('empname')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
