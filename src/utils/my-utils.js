import store from '@/store'


// export function dict_getPowerOrgIdBySysId(sysId) {
//   const powerOrgList = store.getters.userInfo.powerOrgList
//   let result = []
//   if (powerOrgList.length > 0) {
//     for (let i = 0; i < powerOrgList.length; i++) {
//       if (sysId == powerOrgList[i].sysId) {
//         result = powerOrgList[i].powerOrgList
//         break
//       }
//     }
//     return result
//   }

// }

// export function dict_getDictListByType(type) {
//   const dictList = store.getters.dict
//   // console.info('dictList')
//   // console.info(dictList)
//   let result = []
//   for(let key in dictList){
//       if (type == dictList[key].dictType) {
//         result.push(dictList[key])
//       }
//   }



//   console.info(result)
//   return result

// }

// export function dict_getDictListByTypeList(typeList) {
//   const dictList = store.getters.dict
//   console.info('dictList')
//   console.info(dictList)
//   let result = []
//   for(let i=0;i<typeList.length;i++){
//     for(let key in dictList){
//       if (typeList[i] == dictList[key].dictType) {
//         result.push(dictList[key])
//       }
//     }
//   }


//   console.info(result)
//   return result

// }
export function _getDictMap(dictList) {
  
  let result = {}
    for(let i=0 ; i<dictList.length;i++){
        result[dictList[i].dictCode]=dictList[i].dictName
    }
  return result
}

export function _getConfigMap(configList) {
  
  let result = {}
    for(let i=0 ; i<configList.length;i++){
        result[configList[i].paramKey]=configList[i].paramValue
    }
  return result
}