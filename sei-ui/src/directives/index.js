import Vue from 'vue';
import dbUtil from '../utils/dbUtil';
import lodash from 'lodash/lang';
import tools from '../utils/tools';

/**
 * 字典翻译
 * value:值
 * name:字典名称
 */
Vue.filter('dic', function(value, name) {
    return dbUtil.getDicItem(name, value);
});

/**
 * 字典翻译,获取树型结构的ID的名称
 */
Vue.filter('dic_tree', function(value, name) {
    return dbUtil.getDicItem(name, value, false);
});

/**
 * 字典翻译,获取树型结构的父ID的名称
 */
Vue.filter('dic_ptree', function(value, name) {
    return dbUtil.getDicItem(name, value, true);
});

/**
 * 数据校验指令
 */
Vue.directive('rules', {
    bind: function (el, binding, vnode) {
        if (binding.expression) {
            let rules = lodash.castArray(eval('(' + binding.expression + ')'));
            let vm = vnode.componentInstance;
            let dbComponent = vm.$parent;
            while (dbComponent && (!dbComponent.dataSource || dbComponent.actionType == null)) {
                dbComponent = dbComponent.$parent;
            }
            let ds = dbComponent && dbComponent.dataSourceX;
            if (!ds){
                return;
            }
            let currEditSelection = dbComponent.currEditSelection;
            if (vnode.data.model && vnode.data.model.expression) {
                let field = tools.getLastSplitString(vnode.data.model.expression, '.');
                if (!ds.save || !ds.save.validate || !ds.save.validate.rulesRun || !ds.save.validate.rulesRun[field]) {
                    tools.setComponentRuleActon(ds, vm, currEditSelection, field, rules);
                }
            } else if (vm.$options._componentTag === 'x-table-column' || vm.$options._componentTag === 'x-form-item'){
                let field = vm.prop;
                if (ds) {
                    if (vm.$options._componentTag === 'x-table-column') {
                        !ds.save && (ds.save = {validate: {rules: {}}});
                        !ds.save.validate && (ds.save.validate.rules = {});
                        !ds.save.validate.rules && (ds.save.validate.rules = {});
                        ds.save.validate.rules[field] = rules;
                    } else {
                        vm.$nextTick(() => {
                            let v = tools.findInputComponent(vm, field);
                            v && tools.setComponentRuleActon(ds, v, currEditSelection, field, rules);
                        })
                    }
                }
            }
        } else {
            console.error('数据校验指令无表达式。')
        }
    }
});
