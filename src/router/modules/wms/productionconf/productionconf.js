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
      {
        path: 'category-info/:id',
        component: () => import('@/views/wms/productionconf/category/category-info'),
        name: 'CategoryInfo',
        hidden:true,
        meta: { title: '分类信息管理', noCache: true, roles:[]},
      },
      {
        path: 'parameter-manager',
        component: () => import('@/views/wms/productionconf/parameterconf/parameterconf'),
        name: 'ParameterManager',
        meta: { title: '货物参数设置', noCache: true, roles:[]},
      },
      {
        path: 'parametervalue-manager/:id',
        component: () => import('@/views/wms/productionconf/parameterconf/parameterValueconf'),
        name: 'ParameterValueManager',
        hidden:true,
        meta: { title: '货物参数值设置', noCache: true, roles:[]},
      },
      {
        path: 'specification-manager',
        component: () => import('@/views/wms/productionconf/specificationconf/specificationconf'),
        name: 'SpecificationManager',
        meta: { title: '货物规格设置', noCache: true, roles:[]},
      },
      {
        path: 'specificationvalue-manager/:id',
        component: () => import('@/views/wms/productionconf/specificationconf/specificationValueconf'),
        name: 'SpecificationValueManager',
        hidden:true,
        meta: { title: '货物规格值设置', noCache: true, roles:[]},
      },
    ]
  
  }
  
  export default productionConfRouter