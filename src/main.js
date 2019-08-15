import Vue from 'vue'
import App from './App.vue'
import Router from 'vue-router'
import('sei-ui/src/directives');

// import 'element-ui/lib/theme-chalk/index.css';
// import element from 'element-ui';
import './element-ui';
import './mock.js';

import {store, http, router} from 'sei-ui';

Vue.use(Router);
Vue.prototype.$ELEMENT = {size: 'small'};
// Vue.use(element, {size: 'small'});

Vue.prototype.$baseURL = process.env.NODE_ENV === 'development' ? '/api' : '';
Vue.prototype.$routerCall = (v) => v && import('@/'+v); /* 必须保留 */

/** 更改登录页面和主页路径 */
// router.setInitPage('views/login','views/index');

/** 设置项目图标及名称,sysid指定使用哪个项目,不设置则在模块中有系统选择框 */
Vue.prototype.$project = {
    logo: require('./views/img/logo.png'),
    name: '产学研合作信息管理系统',
    sysid: 'cxy'
};

if (process.env.NODE_ENV === 'development') {
    http.setEvn({
        baseURL: '/api',
        crossDomain: true,
        withCredentials: true,
        timeout: 15000
    });
}

Vue.config.productionTip = false;

new Vue({
    store,
    router: router.router,
    render: h => h(App)
}).$mount('#app');
