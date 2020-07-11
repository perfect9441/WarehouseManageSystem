/** When your routing table is too long, you can split it into small modules**/
import Layout from '@/layout'

const cpstorageRouter = {
    path: '/cpstorage',
    component: () => import('@/views/wms/storage/index'),
    alwaysShow: true,
    name: 'CPStorage-conf',
    meta: {
      title: '产品仓库管理',
      roles:[]
    },
    children: [
      {
        path: 'goods-manager',
        component: () => import('@/views/wms/storage/goods/cpitemmanager'),
        name: 'CPGoodsManager',
        meta: { title: '商品管理', noCache: true, roles:[]},
      },
      {
        path: 'goodsdetial-manager/:id',
        component: () => import('@/views/wms/storage/goods/cpitemdetailmanager'),
        name: 'CPGoodsDetialInfo',
        hidden:true,
        meta: { title: '货物管理', noCache: true, roles:[]},
      },
      {
        path: 'goodsdetialprop-manager/:id',
        component: () => import('@/views/wms/storage/goods/cpitemdetailpropmanager'),
        name: 'CPGoodsDetialPropInfo',
        hidden:true,
        meta: { title: '货物参数管理', noCache: true, roles:[]},
      },
      {
        path: 'goodslist-manager',
        component: () => import('@/views/wms/storage/stock/cpgoodsList'),
        name: 'CPGoodsListManager',
        meta: { title: '库存查询', noCache: true, roles:[]},
      },
      // {
      //   path: 'receipt-manager/:id',
      //   component: () => import('@/views/wms/storage/bill/receipt'),
      //   name: 'ReceiptManager',
      //   meta: { title: '入库单管理', noCache: true, roles:[]},
      // },
      // {
      //   path: 'outbound-manager/:id',
      //   component: () => import('@/views/wms/storage/bill/outbound'),
      //   name: 'OutboundManager',
      //   meta: { title: '出库单管理', noCache: true, roles:[]},
      // },
      // {
      //   path: 'transfer-manager',
      //   component: () => import('@/views/wms/storage/bill/transfer'),
      //   name: 'TransferManager',
      //   meta: { title: '调库单管理', noCache: true, roles:[]},
      // },
      // {
      //   path: 'broken-manager',
      //   component: () => import('@/views/wms/storage/bill/broken'),
      //   name: 'BrokenManager',
      //   meta: { title: '破损退货单管理', noCache: true, roles:[]},
      // },
    //   {
    //     path: 'parametervalue-manager/:id',
    //     component: () => import('@/views/wms/storage/parameterconf/parameterValueconf'),
    //     name: 'ParameterValueManager',
    //     hidden:true,
    //     meta: { title: '商品参数值设置', noCache: true, roles:[]},
    //   },
    //   {
    //     path: 'specification-manager',
    //     component: () => import('@/views/wms/storage/specificationconf/specificationconf'),
    //     name: 'SpecificationManager',
    //     meta: { title: '商品规格设置', noCache: true, roles:[]},
    //   },
    //   {
    //     path: 'specificationvalue-manager/:id',
    //     component: () => import('@/views/wms/storage/specificationconf/specificationValueconf'),
    //     name: 'SpecificationValueManager',
    //     hidden:true,
    //     meta: { title: '商品规格值设置', noCache: true, roles:[]},
    //   },
    ]
  
  }
  
  export default cpstorageRouter