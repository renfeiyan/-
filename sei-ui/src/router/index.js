import Vue from 'vue'
import Router from 'vue-router'
import store from '../store';
import http from '../utils/http';
import tools from '../utils/tools';

/**
 * 遍历后台传来的路由字符串,转换为组件对象
 * @param asyncRouterMap
 * @returns {*}
 */
function filterAsyncRouter(asyncRouterMap) {
    return asyncRouterMap.filter(route => {
        if (route.component) {
            let v = route.component;
            route.component = () => Vue.prototype.$routerCall(v);
        }
        if (route.children && route.children.length) {
            route.children = filterAsyncRouter(route.children)
        }
        return true
    });
}

let initPage = {
    login: 'views/login',
    index: 'views/index',
    noPrivilege: 'views/noPrivilege'
};

/**
 * 设置登录和主页界面路径
 * @param login
 * @param index
 */
const setInitPage = (login, index) => {
    if (login) {
        initPage.login = login;
    }
    if (index) {
        initPage.index = index;
    }
};

const login = () => Vue.prototype.$routerCall(initPage.login);
const index = () => Vue.prototype.$routerCall(initPage.index);
const noPrivilege = () => Vue.prototype.$routerCall(initPage.noPrivilege);
/**
 * 路由检查
 */
const router = new Router({
    // esModule: false,
    // mode: 'history',
    mode: 'hash',
    routes: [
        {
            path: '/login',
            name: '登录',
            component: login
        }, {
            path: '/',
            component: index,
            children: [{
                path: '/index/noPrivilege',
                component: noPrivilege
            }]
        }
    ]
});

router.beforeEach((to, from, next) => {
    if (!store.state.controlStyle.menu && to.fullPath !=='/login') {
        http.post('/user/getMenu', {}).then(res => {
            if (res && res.code==1) {
                let v = tools.towToTree(res.data.rows, {pid: '_pid', id: 'muid'});
                let menu = filterAsyncRouter(v);
                // let menu = filterAsyncRouter(res.data);
                store.commit('setMenu', menu);
                router.addRoutes(menu);
                next({...to, replace: true})
            }
        }).catch(() => {
            next({replace: true})
        });
    } else {
        next({replace: true})
    }
});


export default {
    setInitPage,
    router
}
