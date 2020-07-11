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
        hidden:true,
        meta: { title: '公司管理', noCache: true, roles:[]},
      },
      {
        path: 'company-info/:id',
        component: () => import('@/views/wms/sysconf/company-manage/company-info'),
        name: 'CompanyInfo',
        hidden:true,
        meta: { title: '公司信息编辑', noCache: true, roles:[]},
      },
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
      },
      {
        path: 'Houselocation-manager',
        component: () => import('@/views/wms/sysconf/houselocation-manage/index'),
        name: 'HouselocationManager',
        meta: { title: '仓库货位管理', noCache: true, roles:[]},
      },
      {
        path: 'Supplier-manager',
        component: () => import('@/views/wms/sysconf/supplier-manage/index'),
        name: 'SupplierManager',
        meta: { title: '供应商管理', noCache: true, roles:[]},
      },
      {
        path: 'Stuff-manager',
        component: () => import('@/views/wms/sysconf/stuff-manage/index'),
        name: 'StuffManager',
        meta: { title: '员工管理', noCache: true, roles:[]},
      },
    ]
  
  }
  
  export default sysConfRouter
  