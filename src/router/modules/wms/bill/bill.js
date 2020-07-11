/** When your routing table is too long, you can split it into small modules**/
import Layout from '@/layout'

const billRouter = {
    path: '/bill',
    component: () => import('@/views/wms/bill/index'),
    alwaysShow: true,
    name: 'Bill-conf',
    meta: {
      title: '客户单据管理',
      roles:[]
    },
    children: [
      {
        path: 'purchase-manager',
        component: () => import('@/views/wms/bill/purchase/index'),
        name: 'PurchaseManager',
        meta: { title: '采购单管理', noCache: true, roles:[]},
      },
      {
        path: 'pick-manager',
        component: () => import('@/views/wms/bill/pick/index'),
        name: 'PickeManager',
        meta: { title: '销售单管理', noCache: true, roles:[]},
      },
      {
        path: 'refund-manager/:id',
        component: () => import('@/views/wms/bill/refund/index'),
        name: 'RefundManager',
        meta: { title: '客户退货管理', noCache: true, roles:[]},
      },
     
    ]
  
  }
  
  export default billRouter