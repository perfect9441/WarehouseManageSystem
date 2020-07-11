/** When your routing table is too long, you can split it into small modules**/
import Layout from '@/layout'

const tainchengbillRouter = {
    path: '/tianchengbill',
    component: () => import('@/views/wms/tianchengbill/index'),
    alwaysShow: true,
    name: 'TianchengBill-conf',
    meta: {
      title: '天成彩铝单据',
      roles:[]
    },
    children: [
      {
        path: 'receivepact-manager',
        component: () => import('@/views/wms/tianchengbill/receivepact/index'),
        name: 'ReceivepactManager',
        meta: { title: '成品入库磅码单', noCache: true, roles:[]},
      },
     
    ]
  
  }
  
  export default tainchengbillRouter