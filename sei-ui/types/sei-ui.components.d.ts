import Vue from 'vue';
import { LangSelect } from './lang-select';
import { owndisk } from './owndisk';
import { XCard } from './xcard';
import { XCodeSql } from './xcode-sql';
import { XDialog } from './xdialog';
import { XDialogEdit } from './xdialog-edit';
import { XEchart } from './xechart';
import { XFormItem } from './xform-item';
import { XInput } from './xinput';
import { XLayoutMenu, XLayoutTopbar, XLayoutTags, XLayoutMain } from './xlayout';
export { XPanel } from './xpanel';
import { XQuery, XQueryItem } from './xquery';
import { XSelect } from './xselect';
import { XSelectColor } from './xselect-color';
import { XSelectIcon } from './xselect-icon';
import { XSelectTable } from './xselect-table';
import { XSplitter } from './xsplitter';
import { XTableEdit, XTableColumn } from './xtable-edit';
import { XTree } from './xtree';
import { XTreeTransfer } from './xtree-transfer';
import { XUeditor } from './xueditor';

import { dataSource } from './data-source';
import { login } from './login'
import { pagination } from './pagination';
import { style } from './style';

import { store } from './store';
import { router } from './router';
import { http } from './http';
import { tools } from './tools';


interface seiGlobalOptions{
    size?: string;
    transfer?: boolean | string;
}

interface seiInstallOptions extends seiGlobalOptions{
    locale?: any;
    i18n?: any;
}

declare const API: {
    version: string;
    locale: (l: any) => void;
    i18n: (fn: any) => void;
    install: (
        Vue: Vue,
        opts: seiInstallOptions
    ) => void;
    lang: (code: string) => void;

    http:any;
    dataSource:any;
};

export default API;

declare module 'vue/types/vue' {
    interface Vue {
        $SEIUI: seiGlobalOptions;
    }
}
