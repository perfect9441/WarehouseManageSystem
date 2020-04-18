/** When your routing table is too long, you can split it into small modules**/
import Layout from '@/layout'

const sysConfRouter = {
    path: '/sysconf',
    component: () => import('@/views/wms/sysconf/index'),
    alwaysShow: true,
    name: 'Sys-conf',
    meta: {
      title: '仓库系统信息',
      roles:[]
    },
    children: [
      {
        path: 'company-manager',
        component: () => import('@/views/wms/sysconf/company-manage/index'),
        name: 'CompanyManager',
        meta: { title: '公司管理', noCache: true, roles:[]},
      },
      {
        path: 'company-info/:id',
        component: () => import('@/views/wms/sysconf/company-manage/company-info'),
        name: 'CompanyInfo',
        hidden:true,
        meta: { title: '公司信息编辑', noCache: true, roles:[]},
      }
    ]
  
  }
  
  export default sysConfRouter
  