// using with vue-i18n in CDN
/*eslint-disable */
import Vue from 'vue';
const isServer = Vue.prototype.$isServer;

export default function (lang) {
    if (!isServer) {
        if (typeof window.SEIUI !== 'undefined') {
            if (!('langs' in SEIUI)) {
                SEIUI.langs = {};
            }
            SEIUI.langs[lang.i.locale] = lang;
        }
    }
};
