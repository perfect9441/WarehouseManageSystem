import Layout from '@/layout'

const mallRouter = {
  path: '/mall',
  component: Layout,
  name: 'Mall',
  breadcrumb: false,

  meta: {
    title: '商超中心',
    icon: 'sysmanager',
    roles: ['MODULES_MALL', 'MODULE_MALL_CFG', 'MODULE_MALL_MANAGER','MODULE_MALL_GOODS','MODULE_MALL_PROMOTE']
  },
  children: [

    {
      path: 'mall-config',
      component: () => import('@/views/mall/config-manager/index'),
      name: 'MallConfig',
      breadcrumb: false,
      meta: {
        title: '配置管理',
        noCache: true,
        roles: ['MODULES_MALL', 'MODULE_MALL_CFG']
      },
      children: [{
          path: 'mall-config-merchant-config',
          component: () => import('@/views/mall/config-manager/merchant-config/index'),
          name: 'MallConfigMerchantConfig',
          meta: {
            title: '门店配置',
            noCache: true
          }
        },
        {
          path: 'mall-config-order-config',
          component: () => import('@/views/mall/config-manager/order-config/index'),
          name: 'MallConfigOrderConfig',
          meta: {
            title: '订单配置',
            noCache: true
          }
        },
       

      ]
    },
    {
        path: 'mall-manager',
        component: () => import('@/views/mall/mall-manager/index'),
        name: 'MallManager',
        breadcrumb: false,
        meta: {
          title: '商场管理',
          noCache: true,
          roles: ['MODULES_MALL', 'MODULE_MALL_MANAGER']
        },
        children: [{
            path: 'mall-manager-category-manager',
            component: () => import('@/views/mall/mall-manager/category-manager/index'),
            name: 'MallManagerCategoryManager',
            meta: {
              title: '商品类目管理',
              noCache: true
            }
          },
          {
            path: 'mall-manager-prop-manager',
            component: () => import('@/views/mall/mall-manager/prop-manager/index'),
            name: 'MallManagerPropManager',
            meta: {
              title: '商品属性管理',
              noCache: true
            }
          },
          {
            path: 'mall-manager-prop-value/:id',
            hidden: true ,
            component: () => import('@/views/mall/mall-manager/prop-manager/detail'),
            name: 'MallManagerPropValueManager',
            meta: {
              title: '商品属性值',
              noCache: true
            }
          },
          {
            path: 'mall-manager-spec-manager',
            component: () => import('@/views/mall/mall-manager/spec-manager/index'),
            name: 'MallManagerSpecManager',
            meta: {
              title: '商品规格管理',
              noCache: true
            }
          },
          {
            path: 'mall-manager-spec-value/:id',
            hidden: true ,
            component: () => import('@/views/mall/mall-manager/spec-manager/detail'),
            name: 'MallManagerSpecValueManager',
            meta: {
              title: '规格详情',
              noCache: true
            }
          },
          {
            path: 'mall-manager-brand-manager',
            component: () => import('@/views/mall/mall-manager/brand-manager/index'),
            name: 'MallManagerBrandManager',
            meta: {
              title: '品牌管理',
              noCache: true
            }
          },
          {
            path: 'mall-manager-order-manager',
            component: () => import('@/views/mall/mall-manager/order-manager/index'),
            name: 'MallManagerOrderManager',
            meta: {
              title: '订单管理',
              noCache: true
            }
          },
        
  
        ]
      },
      {
        path: 'goods-manager',
        component: () => import('@/views/mall/goods-manager/index'),
        name: 'MallGoodsManager',
        breadcrumb: false,
        meta: {
          title: '商品管理',
          noCache: true,
          roles: ['MODULES_MALL', 'MODULE_MALL_GOODS']
        },
        children: [{
            path: 'goods-manager-goods-list',
            component: () => import('@/views/mall/goods-manager/goods-list/index'),
            name: 'MallGoodsManagerGoodsList',
            meta: {
              title: '商品列表',
              noCache: true
            }
          },
          {
            path: 'goods-manager-goods-edit/:id',
            component: () => import('@/views/mall/goods-manager/goods-edit/index'),
            name: 'MallGoodsManagerGoodsEdit',
            hidden: true   ,
            meta: {
              title: '商品编辑',
              noCache: true
            }
          },
          {
            path: 'goods-manager-goods-putaway',
            component: () => import('@/views/mall/goods-manager/goods-putaway/index'),
            name: 'MallGoodsManagerGoodsPutaway',
            meta: {
              title: '商品上架',
              noCache: true
            }
          },
        
  
        ]
      },
      {
        path: 'promote-manager',
        component: () => import('@/views/mall/promote-manager/index'),
        name: 'PromoteManager',
        breadcrumb: false,
        meta: {
          title: '推广管理',
          noCache: true,
          roles: ['MODULES_MALL', 'MODULE_MALL_PROMOTE']
        },
        children: [{
            path: 'promote-manager-coupon-manager',
            component: () => import('@/views/mall/promote-manager/coupon-manager/index'),
            name: 'PromoteManagerCouponManager',
            meta: {
              title: '优惠券管理',
              noCache: true
            }
          },
          {
            path: 'promote-manager-coupon-edit',
            component: () => import('@/views/mall/promote-manager/coupon-manager/edit'),
            name: 'PromoteManagerCouponEdit',
            meta: {
              title: '新增优惠券',
              noCache: true
            }
          },
          {
            path: 'promote-manager-ad-manager',
            component: () => import('@/views/mall/promote-manager/ad-manager/index'),
            name: 'PromoteManagerAdManager',
            meta: {
              title: '广告管理',
              noCache: true
            }
          },
        
  
        ]
      },



  ]

}

export default mallRouter
