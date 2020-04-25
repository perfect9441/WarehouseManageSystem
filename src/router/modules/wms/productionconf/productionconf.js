/** When your routing table is too long, you can split it into small modules**/
import Layout from '@/layout'

const productionConfRouter = {
    path: '/productionconf',
    component: () => import('@/views/wms/productionconf/index'),
    alwaysShow: true,
    name: 'Production-conf',
    meta: {
      title: '货物参数设置',
      roles:[]
    },
    children: [
      {
        path: 'category-manager',
        component: () => import('@/views/wms/productionconf/category/index'),
        name: 'CategoryManager',
        meta: { title: '分类设置', noCache: true, roles:[]},
      },
    //   {
    //     path: 'company-info/:id',
    //     component: () => import('@/views/wms/sysconf/company-manage/company-info'),
    //     name: 'CompanyInfo',
    //     hidden:true,
    //     meta: { title: '公司信息编辑', noCache: true, roles:[]},
    //   },
    //   {
    //     path: 'House-manager',
    //     component: () => import('@/views/wms/sysconf/house-manage/index'),
    //     name: 'HouseManager',
    //     meta: { title: '仓库管理', noCache: true, roles:[]},
    //   },
    //   {
    //     path: 'House-info/:id',
    //     component: () => import('@/views/wms/sysconf/house-manage/house-info'),
    //     name: 'HouseInfo',
    //     hidden:true,
    //     meta: { title: '仓库信息编辑', noCache: true, roles:[]},
    //   }
    ]
  
  }
  
  export default productionConfRouter