import Layout from '@/layout'

const mmsRouter = {
  path: '/mms',
  component: Layout,
  name: 'Mms',
  breadcrumb:false,

  meta: {
    title: '会员中心',
    icon: 'sysmanager',
    roles:['MODULES_MMS','MODULE_MMS_MEM','MODULE_MMS_VIP']
  },
  children: [
    {
      path: 'member-manager',
      component: () => import('@/views/mms/member-manager/index'),
      name: 'MemberManager',
      meta: { title: '会员管理', noCache: true ,roles:['MODULES_MMS','MODULE_MMS_MEM'] }
    },
    {
      path: 'mem-coupon-manager',
      component: () => import('@/views/mms/coupon-manager/index'),
      name: 'MemCouponManager',
      meta: { title: '会员优惠券', noCache: true ,roles:['MODULES_MMS','MODULE_MMS_COU'] }
    },
    {
      path: 'vip',
      component: () => import('@/views/mms/vip/index'),
      name: 'vip',
      breadcrumb:false,
      meta: { title: '会员等级', noCache: true ,roles:['MODULES_MMS','MODULE_MMS_VIP'] },
      children:[
        {
          path: 'vip-manager',
          component: () => import('@/views/mms/vip/vip-manager/index'),
          name: 'VipManager',
          meta: { title: '会员等级管理', noCache: true  }
        },
        {
          path: 'vip-privilege-manager/:id',
          component: () => import('@/views/mms/vip/vip-privilege-manager/index'),
          name: 'VipPrivilegeManager',
          hidden: true,    
          meta: { title: '等级权益详情', noCache: true  }
        },
        {
          path: 'vip-privilege-cate-manager',
          component: () => import('@/views/mms/vip/vp-cate-manager/index'),
          name: 'VipPrivilegeCateManager',
          meta: { title: '会员权益管理', noCache: true  }
        },
        {
          path: 'vip-rule-manager/:id',
          component: () => import('@/views/mms/vip/vip-rule-manager/index'),
          name: 'VipRuleManager',
          hidden: true,  
          meta: { title: '会员规则管理', noCache: true  }
        },
      ]
    },
   
    
    
  ]

}

export default mmsRouter
