/** When your routing table is too long, you can split it into small modules**/
import Layout from '@/layout'

const houseConfRouter = {
    path: '/houseconf',
    component: () => import('@/views/wms/sysconf/index'),
    alwaysShow: true,
    name: 'House-conf',
    meta: {
      title: '仓库系统信息',
      roles:[]
    },
    children: [
      {
        path: 'House-manager',
        component: () => import('@/views/wms/sysconf/house-manage/index'),
        name: 'HouseManager',
        meta: { title: '仓库管理', noCache: true, roles:[]},
      },
      {
        path: 'House-info/:id',
        component: () => import('@/views/wms/sysconf/house-manage/house-info'),
        name: 'HouseInfo',
        hidden:true,
        meta: { title: '仓库信息编辑', noCache: true, roles:[]},
      }
    ]
  
  }
  
  export default houseConfRouter
  