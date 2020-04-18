import Layout from '@/layout'

const yourRouter = {
  path: '/yourRouter',
  component: Layout,
  name: 'yourRouter',
  breadcrumb:false,
  meta: {
    title: '系统管理',
    icon: 'sysmanager',
    roles:['MODULES_SYS','MODULE_SYS_USER','MODULES_SYS_ORG','MODULES_SYS_AUTH','MODULES_SYS_ROLE','MODULES_SYS_APP']
  },
  children: [
    {
      path: 'user-manager',
      component: () => import('@/views/system/index'),
      name: 'UserManager',
      meta: { title: '系统用户配置', noCache: true ,roles:['MODULES_SYS','MODULE_SYS_USER'] }
    },
    
    
    
  ]

}

export default yourRouter
