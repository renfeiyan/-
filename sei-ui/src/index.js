import LangSelect from './components/lang-select';
import XCard from './components/x-card';
import XCodeSql from './components/x-code-sql';
import XDialog from './components/x-dialog';
import XDialogEdit from './components/x-dialog-edit';
import XEchart from './components/x-echart';
import XFormItem from './components/x-form-item';
import XInput from './components/x-input';
import {XLayoutMain, XLayoutMenu, XLayoutTopbar, XLayoutTags} from './components/x-layout';
import XPanel from './components/x-panel';
import {XQuery, XQueryItem} from './components/x-query';
import XSelect from './components/x-select';
import XSelectColor from './components/x-select-color';
import XSelectIcon from './components/x-select-icon';
import XSelectTable from './components/x-select-table';
import XSplitter from './components/x-splitter';
import {XTableEdit, XTableColumn} from './components/x-table-edit';
import XTree from './components/x-tree';
import XTreeTransfer from './components/x-tree-transfer';
import XUeditor from './components/x-ueditor';
import XStatus from './components/x-status';
import XUpload from './components/x-upload';

import SysOwnDisk from './components/sys-own-disk';
import SysSystem from './components/sys-system';
import SysModule from './components/sys-module';
import SysRole from './components/sys-role';
import SysDic from './components/sys-dic';
import SysOrg from './components/sys-org';
import SysSQL from './components/sys-sql';
import SysMenuBase from './components/sys-menu-base';
import SysMenu from './components/sys-menu';
import SysUser from './components/sys-user';
import SysPrivilege from './components/sys-privilege';
import SysLog from './components/sys-log';
import SysTable from './components/sys-table';
import SysImport from './components/sys-import';
import SysClearCache from './components/sys-clear-cache';
import SysNoPrivilege from './components/sys-no-privilege';
import SysNews from './components/sys-news';
import XQuill from './components/x-quill';
import XDrawer from './components/x-drawer';

import locale from './locale/index';
import dbUtil from './utils/dbUtil';
import http from './utils/http';
import tools from './utils/tools';
import dataSource from './components/support/data-source';
import login from './components/support/login'
import pagination from './components/support/pagination';
import store from './store';
import router from './router';

const components = {
    LangSelect,
    XCard,
    XCodeSql,
    XDialog,
    XDialogEdit,
    XEchart,
    XFormItem,
    XInput,
    XLayoutMenu,
    XLayoutTopbar,
    XLayoutTags,
    XLayoutMain,
    XPanel,
    XQuery,
    XQueryItem,
    XSelect,
    XSelectColor,
    XSelectIcon,
    XSelectTable,
    XSplitter,
    XTableEdit,
    XTableColumn,
    XTree,
    XTreeTransfer,
    XUeditor,
    XStatus,
    XQuill,
    XUpload,
    XDrawer,

    SysOwnDisk,
    SysSystem,
    SysModule,
    SysRole,
    SysDic,
    SysOrg,
    SysSQL,
    SysMenuBase,
    SysMenu,
    SysUser,
    SysPrivilege,
    SysLog,
    SysTable,
    SysImport,
    SysClearCache,
    SysNoPrivilege,
    SysNews,

    dataSource,
    pagination,
    login
};

const install = function(Vue, opts = {}) {
    if (install.installed) {
        return;
    }
    locale.use(opts.locale);
    locale.i18n(opts.i18n);

    Object.keys(components).forEach(key => {
        Vue.component(key, components[key]);
    });

    Vue.prototype.$SEIUI = {
        size: opts.size || ''
    };

    import('./directives');

    install.installed = true;
};

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

const API = {
    version: process.env.VERSION,
    locale: locale.use,
    i18n: locale.i18n,
    install,
    dbUtil,
    http,
    tools,
    dataSource,
    pagination,
    login,
    store,
    router,
    ...components
};

API.lang = (code) => {
    const langObject = window['sei-ui/locale'].default;
    if (code === langObject.i.locale) {
        locale.use(langObject);
    } else {
        console.log(`${code} 语言包未加载。`);
    }
};

export default API;
