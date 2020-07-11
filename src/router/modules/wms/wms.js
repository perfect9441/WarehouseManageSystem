import Layout from '@/layout'
import sysConfRouter from '@/router/modules/wms/sysconf/sysconf'
import productionConfRouter from '@/router/modules/wms/productionconf/productionconf'
import bjstorageRouter from '@/router/modules/wms/storage/bjstorage'
import cpstorageRouter from '@/router/modules/wms/storage/cpstorage'
import housebillRouter from '@/router/modules/wms/housebill/housebill'
import billRouter from '@/router/modules/wms/bill/bill'
import tianchengBillRouter from '@/router/modules/wms/tianchengbill/tianchengbill'
const wmsRouter = {
  path: '/wms',
  component: Layout,
  name: 'Wms',
  breadcrumb:false,
  meta: {
    title: '仓储中心',
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
    productionConfRouter,
    bjstorageRouter,
    cpstorageRouter,
    housebillRouter,
    billRouter,
    tianchengBillRouter
    
  ]

}

export default wmsRouter
