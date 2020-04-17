import Layout from '@/layout'

const systemRouter = {
  path: '/system',
  component: Layout,
  name: 'System',
  breadcrumb:false,
  meta: {
    title: '入库管理',
    icon: 'sysmanager',
    roles:['MODULES_SYS','MODULE_SYS_USER','MODULES_SYS_ORG','MODULES_SYS_AUTH','MODULES_SYS_ROLE']
  },
  children: [
    {
      path: 'user-manager',
      component: () => import('@/views/system/user-manager/index'),
      name: 'UserManager',
      meta: { title: '入库单填写', noCache: true ,roles:['MODULES_SYS','MODULE_SYS_USER'] }
    },
    {
      path: 'org-manager',
      component: () => import('@/views/system/org-manager/index'),
      name: 'OrgManager',
      meta: { title: '入库单审批', noCache: true ,roles:['MODULES_SYS','MODULES_SYS_ORG'] }
    },
    {
      path: 'power-manager',
      component: () => import('@/views/system/power-manager/index'),
      name: 'PowerManager',
      meta: { title: '货物入库操作', noCache: true  ,roles:['MODULES_SYS','MODULES_SYS_AUTH']}
    },
    {
      path: 'role-manager',
      component: () => import('@/views/system/role-manager/index'),
      name: 'RoleManager',
      meta: { title: '数据报表', noCache: true  ,roles:['MODULES_SYS','MODULES_SYS_ROLE']}
    },
    
    
  ]

}

export default systemRouter
