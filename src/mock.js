import Mock from 'mockjs';

Mock.mock('/api/user/getMenu', 'post', () => {
    return {
        code: 1,
        data: {
            rows: [
                {
                    name: '项目管理',
                    icon: 'el-icon-setting',
                    path: '/cxy',
                    component: 'views/index',
                    children: [{
                        name: '首页',
                        icon: 'el-icon-menu',
                        path: '/index/dashboard',
                        component: 'views/dashboard'
                    }, {
                        name: '实习实训基地',
                        icon: 'el-icon-time',
                        path: '/cxy_qt/cxy_import_shixishixun',
                        component: 'views/cxy/cxy_import_shixishixun'
                    }]
                }, {
                    name: '系统设置',
                    icon: 'el-icon-setting',
                    path: '/sys_base',
                    component: 'views/index',
                    children: [{
                        name: '机构设置',
                        icon: 'el-icon-time',
                        path: '/sys_base/sys_org',
                        component: 'views/sys_base/sys_org'
                    }, {
                        name: '用户设置',
                        icon: 'el-icon-time',
                        path: '/sys_base/sys_user',
                        component: 'views/sys_base/sys_user'
                    }, {
                        name: '角色设置',
                        icon: 'el-icon-time',
                        path: '/sys_base/sys_role',
                        component: 'views/sys_base/sys_role'
                    }, {
                        name: '权限设置',
                        icon: 'el-icon-time',
                        path: '/sys_base/sys_privilege',
                        component: 'views/sys_base/sys_privilege'
                    }, {
                        name: '菜单设置',
                        icon: 'el-icon-time',
                        path: '/sys_base/sys_menu',
                        component: 'views/sys_base/sys_menu'
                    }]
                }, {
                    name: '系统维护',
                    icon: 'el-icon-time',
                    path: '/sys_maintain',
                    component: 'views/index',
                    children: [{
                        name: '子系统设置',
                        icon: 'el-icon-time',
                        path: '/sys_maintain/sys_system',
                        component: 'views/sys_base/sys_system'
                    }, {
                        name: '模块设置',
                        icon: 'el-icon-time',
                        path: '/sys_maintain/sys_module',
                        component: 'views/sys_base/sys_module'
                    }, {
                        name: '表设置',
                        icon: 'el-icon-time',
                        path: '/sys_maintain/sys_table',
                        component: 'views/sys_base/sys_table'
                    }, {
                        name: '字典定义',
                        icon: 'el-icon-time',
                        path: '/sys_maintain/sys_dic',
                        component: 'views/sys_base/sys_dic'
                    }, {
                        name: '数据源设置',
                        icon: 'el-icon-time',
                        path: '/sys_maintain/sys_sql',
                        component: 'views/sys_base/sys_sql'
                    }, {
                        name: '菜单模板',
                        icon: 'el-icon-time',
                        path: '/sys_maintain/sys_menu_base',
                        component: 'views/sys_base/sys_menu_base'
                    }, {
                        name: '导入模板',
                        icon: 'el-icon-time',
                        path: '/sys_maintain/sys_import',
                        component: 'views/sys_base/sys_import'
                    }, {
                        name: '缓存清理',
                        icon: 'el-icon-time',
                        path: '/sys_maintain/sys_clear-cache',
                        component: 'views/sys_base/sys_clear-cache'
                    }, {
                        name: '日志管理',
                        icon: 'el-icon-time',
                        path: '/sys_maintain/sys_log',
                        component: 'views/sys_base/sys_log'
                    }]
                }]
            }
        }
    }
);
