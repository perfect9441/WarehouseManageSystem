/** When your routing table is too long, you can split it into small modules**/
import Layout from '@/layout'

const housebillRouter = {
    path: '/housebill',
    component: () => import('@/views/wms/storage/index'),
    alwaysShow: true,
    name: 'HouseBill-conf',
    meta: {
      title: '库房单据管理',
      roles:[]
    },
    children: [
        {
            path: 'receipt-manager/:id',
            component: () => import('@/views/wms/storage/bill/receipt'),
            name: 'ReceiptManager',
            meta: { title: '入库单管理', noCache: true, roles:[]},
          },
          {
            path: 'outbound-manager/:id',
            component: () => import('@/views/wms/storage/bill/outbound'),
            name: 'OutboundManager',
            meta: { title: '出库单管理', noCache: true, roles:[]},
          },
          {
            path: 'transfer-manager',
            component: () => import('@/views/wms/storage/bill/transfer'),
            name: 'TransferManager',
            meta: { title: '调库单管理', noCache: true, roles:[]},
          },
          {
            path: 'broken-manager',
            component: () => import('@/views/wms/storage/bill/broken'),
            name: 'BrokenManager',
            meta: { title: '破损退货单管理', noCache: true, roles:[]},
          },
     
    ]
  
  }
  
  export default housebillRouter