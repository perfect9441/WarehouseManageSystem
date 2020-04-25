import Layout from '@/layout'
import sysConfRouter from '@/router/modules/wms/sysconf/sysconf'
import productionConfRouter from '@/router/modules/wms/productionconf/productionconf'
// import dashboardRouter from '@/router/modules/wms/houseconf/houseconf'

const wmsRouter = {
  path: '/wms',
  component: Layout,
  name: 'Wms',
  breadcrumb:false,
  meta: {
    title: '仓库管理系统',
    component: Layout,
    icon: 'sysmanager',
    roles:['MODULES_SYS','MODULE_SYS_USER','MODULES_SYS_ORG','MODULES_SYS_AUTH','MODULES_SYS_ROLE']
  },
  children: [
    {
      path: 'dashboard-index',
      component: () => import('@/views/wms/dashboard/index'),
      name: 'dashboardIndex',
      meta: { title: '首页', noCache: true, roles:[]},
    },
    sysConfRouter,
    productionConfRouter
    
  ]

}

export default wmsRouter
