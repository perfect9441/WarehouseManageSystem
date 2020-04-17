/** When your routing table is too long, you can split it into small modules**/
import Layout from '@/layout'

const sysConfRouter = {
    path: '/sysconf',
    component: Layout,
    alwaysShow: true,
    name: 'Sys-conf',
    meta: {
      title: '系统信息',
      icon:'el-icon-s-home',
      roles:[]
    },
    children: [
      {
        path: 'House-manager',
        component: () => import('@/views/sysconf/house-manage/index'),
        name: 'HouseManager',
        meta: { title: '仓库配置', noCache: true, roles:[]},
        // children: [
        //   {
        //     path: 'vehicle_category-manager',
        //     component: () => import('@/views/erp/bus/baseData-manager/vehicle_category-manager/index'),
        //     name: 'vehicleCategoryManager',
        //     meta: { title: '', noCache: true, }
        //   },
        //   {
        //     path: 'vehicle_attribute-manager',
        //     component: () => import('@/views/erp/bus/baseData-manager/vehicle_attribute-manager/index'),
        //     name: 'vehicleAttributeManager',
        //     meta: { title: '属性设置', noCache: true, }
        //   },
        //   {
        //     path: 'vehicle_attr_value-manager',
        //     component: () => import('@/views/erp/bus/baseData-manager/vehicle_attr_value-manager/index'),
        //     name: 'vehicleAttrValueManager',
        //     meta: { title: '属性值设置', noCache: true,}
        //   }
        // ]
      },
      {
        path: 'drivers-manager',
        component: () => import('@/views/sysconf/company-manage/index'),
        name: 'driversManager',
        meta: { title: '公司管理', noCache: true, roles:['MODULES_ERP','MODULES_ERP_VEHICLE','MODULES_ERP_VEHICLE_DRIVER'] },
        // children: [
        //     {
        //       path: 'vehicle_category-manager',
        //       component: () => import('@/views/sysconf/company-manage/company-info'),
        //       name: 'vehicleCategoryManager',
        //       meta: { title: '', noCache: true, }
        //     },
        // ]
      },
      // {
      //   path: 'drivers-modify',
      //   component: () => import('@/views/erp/bus/drivers-manager/modify'),
      //   name: 'driversModify',
      //   hidden: true,
      //   meta: { title: '驾驶员编辑', noCache: true, roles:['MODULES_ERP','MODULES_ERP_VEHICLE','MODULES_ERP_VEHICLE_DRIVER'] }
      // },
      // {
      //   path: 'vehicle-manager',
      //   component: () => import('@/views/erp/bus/vehicle-manager/index'),
      //   name: 'vehicleManager',
      //   meta: { title: '车辆管理', noCache: true, roles:['MODULES_ERP','MODULES_ERP_VEHICLE','MODULES_ERP_VEHICLE_VEHICLE'] }
      // },
      // {
      //   path: 'vehicle-modify',
      //   component: () => import('@/views/erp/bus/vehicle-manager/modify'),
      //   name: 'vehicleModify',
      //   hidden: true,
      //   meta: { title: '车辆编辑', noCache: true, roles:['MODULES_ERP','MODULES_ERP_VEHICLE','MODULES_ERP_VEHICLE_VEHICLE'] }
      // },
      // {
      //   path: 'vehicleCheck-manager',
      //   component: () => import('@/views/erp/bus/vehicleCheck-manager/index'),
      //   name: 'vehicleCheckManager',
      //   meta: { title: '车辆审验管理', noCache: true, roles:['MODULES_ERP','MODULES_ERP_VEHICLE','MODULES_ERP_VEHICLE_VEHICLECHECK']}
      // },
      // {
      //   path: 'vehicleInsurance-manager',
      //   component: () => import('@/views/erp/bus/vehicleInsurance-manager/index'),
      //   name: 'vehicleInsuranceManager',
      //   meta: { title: '车辆保险管理', noCache: true, roles:['MODULES_ERP','MODULES_ERP_VEHICLE','MODULES_ERP_VEHICLE_VEHICLEINSURANCE']}
      // },
      // {
      //   path: 'vehicleStatus-manager',
      //   component: () => import('@/views/erp/bus/vehicleStatus-manager/index'),
      //   name: 'vehicleInsuranceManager',
      //   meta: { title: '车辆状态管理', noCache: true, roles:['MODULES_ERP','MODULES_ERP_VEHICLE','MODULES_ERP_VEHICLE_VEHICLEINSURANCE']}
      // }
    ]
  
  }
  
  export default sysConfRouter
  