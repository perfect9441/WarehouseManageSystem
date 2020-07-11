import request from '@/utils/request'
import axios from 'axios'

export function getDownLoadImagePath() {
  return process.env.VUE_APP_BASE_API + '/open/fastDFS/downloadThumbImage?fileUrl='
}

export function getUploadImagePath() {
  return process.env.VUE_APP_BASE_API + '/open/fastDFS/uploadImageAndCrtThumbImage/'
}




export function uploadImageAndCrtThumbImage(file, filename) {
  return new Promise((resolve, reject) => {
    let param = new FormData()
    param.append('image-file', file, filename)
    let config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };
    axios.post(process.env.VUE_APP_BASE_API + '/open/fastDFS/uploadImageAndCrtThumbImage/', param, config)
      .then(response => {
        resolve(response)
      })
      .catch(err=>{
          reject(err)
      })
  })
}
