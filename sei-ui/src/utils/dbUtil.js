import http from './http';
import {Message} from 'element-ui';
import store from '../store';
import tools from './tools';
import lodash from 'lodash/lang';

/**
 * 获得增删改查操作的json头部
 * @param DataSource
 * @returns {null}
 */
const buildHead = (dataSource) => {
    if (dataSource && dataSource.head) {
        return tools.cloneDeep(dataSource.head);
    }
    return null;
};

/**
 * 获得查询字段,如果是所有字段则为null
 * @returns {string || null}
 */
const buildQueryFields = (dataSource) => {
    let v = dataSource.option;
    if (!v || !v.fields || v.fields === '*') {
        return null;
    }
    let fields = new Set(v.fields.split(','));
    v.keyField && v.keyField !== true && fields.add(v.keyField);
    v = dataSource.data;
    if (v) {
        v.pid && fields.add(v.pid);
        v.id && fields.add(v.id);
        v.label && fields.add(v.label);
    }
    if (fields.size > 0) {
        return Array.from(fields).join(',');
    } else {
        return null;
    }
};

/**
 * 构建查询JSON对象
 * @param isPage: 是否需要分页, 当查看/修改一条数据时应设为false
 * @param dataSource
 * @param filter: 附加过滤条件
 * @param isBuildHead: 是否绑定头部,在保存并同时查询时不需要,因为保存时已经有头部了
 * @returns {boolean|*}
 */
const buildQueryJson = (isPage = true, dataSource, filter, isBuildHead = true) => {
    let parms = isBuildHead && buildHead(dataSource);
    if (parms || !isBuildHead) {
        parms = isBuildHead ? {head: parms} : {};
        let option = {};
        let v = dataSource.option;
        if (v) {
            v.hasOwnProperty('load') && v.load === false && (option.load = false);
            v.hasOwnProperty('isPrivilege') && v.isPrivilege === false && (option.isPrivilege = false);
            v.keyField === true && (option.keyField = true);
            v = v.privilege;
            if (v) {
                if (v instanceof Array) {
                    option.privilege = v;
                } else if (!lodash.isBoolean(v)) {
                    option.privilege = v.split(',');
                } else {
                    option.privilege = [];
                }
            }
        }
        dataSource.att && (option.att = lodash.cloneDeep(dataSource.att));
        v = buildQueryFields(dataSource);
        v && (option.fields = v);
        v = dataSource.query;
        if (v) {
            v.group && (option.group = v.group);
            v.order && (option.order = v.order);
            v.merge && (option.merge = lodash.cloneDeep(v.merge));
            v.filter && (option.filter = lodash.cloneDeep(v.filter));
            if (v.queryFilter) {
                if (!option.filter) {
                    option.filter = v.queryFilter;
                } else {
                    option.filter = option.filter.concat(v.queryFilter);
                }
            }
            if (isPage) {
                v = v.pagination;
                if (v) {
                    v.hasOwnProperty('page') && (option.page = v.page);
                    v.hasOwnProperty('size') && (option.size = v.size);
                    v.lastId && (option.lastId = v.lastId);
                }
            }
        }
        if (filter) {
            filter = lodash.castArray(filter);
            !option.filter && (option.filter = []);
            option.filter.push.apply(option.filter, filter);
        }
        !tools.isEmpty(option) && (parms.option = option);
    }
    return parms;
};

/**
 *
 * @param action: 保存时的动作:add,edit,del
 * @param dataSource
 * @param rows: 需要保存的数据行(单个JSON或者JSON数组)
 * @returns {null|{head: *, data: Array}[]}
 */
const buildSaveJson = (action, dataSource, rows) => {
    let saveJson = rows && buildHead(dataSource);
    if (saveJson) {
        saveJson = {head: saveJson, data: []};
        dataSource.att && (saveJson.att = lodash.cloneDeep(dataSource.att));
        rows = lodash.castArray(rows);
        let dataItem = {action: action, rows: []};
        let noSaveFields = dataSource.save && dataSource.save.noSaveFields;
        noSaveFields = (tools.isString(noSaveFields) ? noSaveFields.split(',') : noSaveFields) || [];
        let keyField = dataSource.option && dataSource.option.keyField;
        let option = dataSource.save && dataSource.save[action];

        let serverEvn = option && option.serverEvn && JSON.stringify(option.serverEvn);
        let r = 0; /* 无serverEvn */
        if (serverEvn) {
            r = serverEvn.indexOf('#{') >= 0 ? 2 : 1;
        }
        let rowEvn = dataSource.save && dataSource.save.rowEvn;
        for (let v of rows) {
            rowEvn && rowEvn(v);
            let row = {};
            option && option.filter && (row.filter = JSON.parse(tools.regExpReplace(JSON.stringify(option.filter), /(?<=#\{)(.*?)(?=\})/g, (vv) => v[vv.split('.')[1] || vv.split('.')[0]])));
            if (r === 2) {
                if (action === 'edit') {
                    for (let o of option.serverEvn) {
                        for (let m of o.field) {
                            if (v[m]) {
                                row.serverEvn = JSON.parse(tools.regExpReplace(JSON.stringify(o.serverEvn), /(?<=#\{)(.*?)(?=\})/g, (vv) => v[vv.split('.')[1] || vv.split('.')[0]] || ''));
                                break;
                            }
                        }
                    }
                } else {
                    row.serverEvn = JSON.parse(tools.regExpReplace(serverEvn, /(?<=#\{)(.*?)(?=\})/g, (vv) => v[vv.split('.')[1] || vv.split('.')[0]]));
                    if (serverEvn.indexOf('&{') >= 0) { /*  处理多行 */
                        row.serverEvn.forEach(v0 => {
                            v0.data.forEach((v1) => {
                                v1.rows.forEach((v2) => {
                                    for (let key in v2.row) {
                                        if (v2.row[key].indexOf('&{') >=0){
                                            let field = v2.row[key].substring(2, v2.row[key].length - 1);
                                            if (lodash.isArray(v[field])) {
                                                v[field].forEach((v3, index) => {
                                                    if (index == 0){
                                                        v2.row[key] = v3;
                                                    } else {
                                                        let vv = lodash.cloneDeep(v2);
                                                        vv.row[key] = v3;
                                                        v1.rows.push(vv);
                                                    }
                                                })
                                            } else {
                                                v2.row[key] = v[field];
                                            }
                                        }
                                    }
                                })
                            })
                        });
                    }
                }
            }
            if (action === 'del') {
                row.keyVal = v[keyField];
            } else {
                noSaveFields.forEach(o => delete v[o]);
                if (action === 'edit') {
                    if (v._oldKeyFieldVal === null || v._oldKeyFieldVal === undefined) {
                        row.keyVal = v[keyField]
                    } else {
                        row.keyVal = v._oldKeyFieldVal
                    }
                    delete v._oldKeyFieldVal;
                }
                row.row = v;
            }
            dataSource && dataSource.option && dataSource.option.attFile && (row.attFile = lodash.castArray(dataSource.option.attFile));
            dataItem.rows.push(row);
        }
        r === 1 && (dataItem.serverEvn = option.serverEvn);
        if (option) {
            option.head && (dataItem.head = lodash.cloneDeep(option.head));
            option.url && (saveJson.url = option.url);
            option.key && (dataItem.option = {key: true});
            option.noSaveFields && noSaveFields.push.apply(noSaveFields, option.noSaveFields);
        }
        saveJson.data.push(dataItem);
        return [saveJson];
    }
    return null;
};

/**
 * 查询后对获得的数据进行处理
 * @param dataSource
 * @param queryJson
 * @param queryData
 * @returns {{keyField}}
 */
const queryAfter = (dataSource, queryJson, queryData) => {
    if (dataSource.option && dataSource.option.privilege && !dataSource.dependent) {
        delete dataSource.option.privilege;
    }
    if (!queryData) {
        queryData = {rows: []}
    } else {
        if (queryData.keyField) {
            if (dataSource.option) {
                dataSource.option.keyField = queryData.keyField;
            } else {
                dataSource.option = {keyField: queryData.keyField};
            }
        }
    }
    let data = dataSource.data;
    if (data) {
        if (data.addData) {
            data.addData = data.addData instanceof Array ? data.addData : [data.addData];
            queryData.rows.push.apply(queryData.rows, data.addData);
        }
        if (queryData.rows && queryData.rows.length > 0) {
            if (data.map == 0) {
                let id = dataSource.data.option.id, label = dataSource.data.option.label;
                queryData.rows = queryData.rows.map(item => {
                    let v={};
                    v[id] = item;
                    v[label] = item;
                    return v;
                });
            }
            if (data.tree === 2) {
                /* 父子2条记录的情况 */
                queryData.rows = tools.towToTree(queryData.rows, data.option, dataSource.option.dataConver, data.rowEvn);
            } else if (data.tree == 1) {
                /* 父子1条记录的情况 */
                queryData.rows = tools.oneToTree(queryData.rows, data.option, dataSource.option.dataConver, data.rowEvn);
            } else {
                if (dataSource.option && dataSource.option.dataConver || data.rowEvn) {
                    let v1 = dataSource.option && dataSource.option.dataConver, v2 = data.rowEvn;
                    queryData.rows.forEach(v => {
                        v1 && tools.dataConver(v, v1);
                        v2 && v2(v);
                    });
                }
            }
        }
    }
    let dic = dataSource.option && dataSource.option.dic;
    if (dic && !store.state.dic[dic]) {
        let option = lodash.cloneDeep(data);
        option && option.addData && delete option.addData;
        option && option.rowEvn && delete option.rowEvn;
        (option || (option = {})).keyField = queryData && queryData.keyField || '';
        store.commit('setDicData', {name: dic, data: {queryJson: queryJson, option: option, data: queryData}});
    }
    return queryData;
};

/**
 * 增删改数据操作,注意edit操作时需要附加一个字段 _oldKeyFieldVal 存放该记录的旧主键值
 * @param action: add,edit,del
 * @param dataSource
 * @param rows: 要服务器操作的数据,JSON或JSON数组,包括原始字段值和新值
 * @param beforeCallback
 * @param afterCallback
 * @param isReload: 是否在保存后立即查询并返回查询数据
 * @returns {Promise<T|*>}
 */
const doSaveAction = async (action, dataSource, rows, beforeCallback, afterCallback, isReload = true) => {
    let saveJson = buildSaveJson(action, dataSource, rows);
    if (saveJson) {
        let url = saveJson[0].url || '/data/save';
        delete saveJson[0].url;
        if (isReload) {
            saveJson[0].query = buildQueryJson(true, dataSource, null, false);
        }
        let v;
        if ((v = dataSource.webEvn) && v.beforeSaveEvn && v.beforeSaveEvn(action, rows) === false) {
            return false;
        }
        let o = 'before' + tools.capitalize(action) + 'SaveEvn';
        if ((v = dataSource.webEvn) && v[o] && v[o](saveJson) === false) {
            return false;
        }
        if (beforeCallback && beforeCallback(saveJson, action) === false) {
            return false;
        }
        // console.log(saveJson);
        return await http.post(url, saveJson, true, true).then((res) => {
            if (res && res.code == 1) {
                (v = dataSource.option) && (v = v.dic) && store.state.dic[v] && store.commit('clearDicData', v);
                if (res.data && res.data.query) {
                    v = {head: saveJson[0].head, option: saveJson[0].query};
                    res.data.query = queryAfter(dataSource, v, res.data.query);
                }
                v = dataSource.webEvn;
                if (v) {
                    action === 'add' && v.afterAddSaveEvn && v.afterAddSaveEvn(res);
                    action === 'edit' && v.afterEditSaveEvn && v.afterEditSaveEvn(res);
                    action === 'del' && v.afterDelSaveEvn && v.afterDelSaveEvn(res);
                    v.afterSaveEvn && v.afterSaveEvn(action, res);
                }
                afterCallback && afterCallback(res, action);
                return true;
            }
        }).catch(() => {
            return false;
        });
    } else {
        Message.error('请选中或录入要操作的数据后才能操作。');
        return false;
    }
};

/**
 * 查询数据操作
 * @param isPage: 是否需要分页, 当查看/修改一条数据时应设为false
 * @param dataSource
 * @param filter: 附加条件
 * @param beforeCallback
 * @param afterCallback
 * @param lastId: 最后一条数据的_id值(针对MongoDB的查询优化)
 * @returns {Promise<*>}
 */
const doQueryAction = async (isPage = true, dataSource, filter, beforeCallback, afterCallback) => {
    if (dataSource) {
        let queryJson = buildQueryJson(isPage, dataSource, filter, true);
        if (queryJson) {
            let dic = dataSource.option && dataSource.option.dic;
            if (dataSource.query && dataSource.query.pagination || !dic || !store.state.dic[dic] || !lodash.isEqual(store.state.dic[dic].queryJson, queryJson)) {
                if (dataSource.query && dataSource.query.beforeQueryEvn && dataSource.query.beforeQueryEvn(queryJson, 'query') === false) {
                    return false;
                }
                if (beforeCallback && beforeCallback(queryJson, 'query') === false) {
                    return false;
                }
                // console.log(queryJson);
                return await http.post(dataSource.query && dataSource.query.url || '/data/query', queryJson, true, false).then(res => {
                    if (res && res.code == 1) {
                        res.data = queryAfter(dataSource, queryJson, res.data);
                        dataSource.query && dataSource.query.afterQueryEvn && dataSource.query.afterQueryEvn(res);
                        afterCallback && afterCallback(res, 'query');
                    }
                    return true;
                }).catch(() => {
                    return false;
                });
            } else {
                let res = {};
                if (dic) {
                    let v = store.state.dic[dic];
                    res.code = 1;
                    res.data = v.data;
                }
                afterCallback && afterCallback(res, 'query');
                return true;
            }
        }
    }
    return false;
};

/**
 * 获得字典数据
 * @param dic:字典名称
 */
const getDicData = (dic, afterCallback) => {
    if (dic) {
        for (let v of dic) {
            let name = v.name || v.option && v.option.dic;
            if (!store.state.dic[name]) {
                if (v.name) {
                    if (v.data && v.data.rows) {
                        let option = {id: 'id', label: 'name'};
                        if (v.data.option) {
                            option = lodash.cloneDeep(v.data.option);
                        }
                        store.commit('setDicData', {name: v.name, data: {queryJson: '', option: {option: option}, data: {rows: v.data.rows}}});
                    }
                } else {
                    doQueryAction(false, v, null, null, afterCallback);
                }
            }
        }
    }
};


/**
 * 字典翻译
 * @param name
 * @param value
 * @param pid
 * @returns {当前节点|*|string|*}
 */
const getDicItem = (name, value, pid) => {
    let v = store.state.dic[name];
    if (v) {
        let id = pid && 'pid'|| 'id';
        if (value instanceof Array){
            let o = [];
            value.forEach(oo => {
                let item = tools.findTreeNode(v.data.rows, v.option.option[id], oo);
                if (item) {
                    o.push(item[v.option.option.label]);
                }
            });
            return o.join(',');
        } else {
            let o = tools.findTreeNode(v.data.rows, v.option.option[id], value);
            return o && o[v.option.option.label] || '';
        }
    }
};

//
// /**
//  * 表单数据校验
//  * @param rule: 某个表单控件校验对象
//  * @returns {boolean}
//  */
// const formVerify = (filter) => {
//     for (let v of filter.test) {
//         if (filter.vnode.componentInstance.value == null || !v.filter.test(filter.vnode.componentInstance.value)) {
//             filter.input.style.cssText = 'border-color: #f56c6c';
//             filter.el.setAttribute('tooltip', v.message);
//             !filter.el.getAttribute('placement') && filter.el.setAttribute('placement', filter.placement);
//             return v.message;
//         }
//     }
//     return true;
// };
//
// /**
//  * 保存前校验,失败返回失败原因,成功返回boolean型true(注意判断需用恒等于===)
//  * @returns {boolean|string}
//  */
// const formVerifyAll = (vm) => {
//     if (vm && vm.$verify) {
//         for (let v in vm.$verify) {
//             let o = formVerify(vm.$verify[v]);
//             if (o !== true) {
//                 return o;
//             }
//         }
//     }
//     return true;
// };

export default {
    buildHead,
    buildQueryJson,

    doSaveAction,
    doQueryAction,
    queryAfter,

    getDicData,
    getDicItem
}
