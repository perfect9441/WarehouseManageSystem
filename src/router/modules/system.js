import Layout from '@/layout'

const systemRouter = {
  path: '/system',
  component: Layout,
  name: 'System',
  breadcrumb:false,
  meta: {
    title: '系统管理',
    icon: 'sysmanager',
    roles:['MODULES_SYS','MODULE_SYS_USER','MODULES_SYS_ORG','MODULES_SYS_AUTH','MODULES_SYS_ROLE']
  },
  children: [
    {
      path: 'user-manager',
      component: () => import('@/views/system/user-manager/index'),
      name: 'UserManager',
      meta: { title: '用户管理', noCache: true ,roles:['MODULES_SYS','MODULE_SYS_USER'] }
    },
    {
      path: 'org-manager',
      component: () => import('@/views/system/org-manager/index'),
      name: 'OrgManager',
      meta: { title: '组织管理', noCache: true ,roles:['MODULES_SYS','MODULES_SYS_ORG'] }
    },
    {
      path: 'power-manager',
      component: () => import('@/views/system/power-manager/index'),
      name: 'PowerManager',
      meta: { title: '权限管理', noCache: true  ,roles:['MODULES_SYS','MODULES_SYS_AUTH']}
    },
    {
      path: 'role-manager',
      component: () => import('@/views/system/role-manager/index'),
      name: 'RoleManager',
      meta: { title: '规则设定', noCache: true  ,roles:['MODULES_SYS','MODULES_SYS_ROLE']}
    },
    
    
  ]

}

export default systemRouter
