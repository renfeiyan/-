import lodash from 'lodash/lang';
import validateRules from '../components/support/validate-rules';
import uuid from 'uuid/v1';

const getUUID = () => {
    return uuid().replace(/-/g, '');
};

/**
 * 获得el对象的css属性值.例如:width/height/margin
 * @param obj
 * @param attr
 * @returns {string}
 */
const getStyle = (obj, attr) => {
    if (obj.currentStyle) {
        return obj.currentStyle[attr];
    } else {
        return document.defaultView.getComputedStyle(obj, null)[attr];
    }
};

/**
 * 计算自身高度(通过父元素的高度减去前置元素的高度)
 * @param el
 * @returns {number}
 */
const getHeight = (el) => {
    let height;
    let v = el.parentNode;
    if (v && v.clientHeight) {
        height = v.clientHeight;
        v = el.previousSibling;
        while (v) {
            height = height - v.offsetHeight;
            v = v.previousSibling;
        }
    }
    return height;
};


/**
 * 对象深拷贝
 */
const cloneDeep = (obj) => {
    let proto = Object.getPrototypeOf(obj);
    return Object.assign({}, Object.create(proto), obj);
};

/**
 * 获得数组中包括json对象的key值在数组中的索引位置
 */
const arrayIndexOf = (array, json, key) => {
    let count = (array || []).length;
    for (let i = 0;i < count; i++) {
        if (array[i][key] === json[key]) {
            return i;
        }
    }
    return null;
};

/**
 * 获得数组中最后一个满足条件的json的索引
 * @param array
 * @param json
 * @param key
 * @returns {null|number}
 */
const arrayLastIndexOf = (array, json, key) => {
    let count = (array || []).length - 1;
    for (let i = count;i >= 0; i--) {
        if (array[i][key] === json[key]) {
            return i;
        }
    }
    return null;
};

/**
 * 满足条件的个数
 * @param array
 * @param json
 * @param key
 * @returns {*}
 */
const arrayIndexCount = (array, json, key) => {
    return array.filter((v) => v[key] === json[key]).length;
};


/**
 * 判断是否是字符串
 * @param str
 * @returns {boolean}
 */
const isString = (str) => {
    return typeof str === 'string' && str.constructor === String;
};

/**
 * 判断是否是Json对象
 * @param obj
 * @returns {boolean}
 */
const isJson = (obj) => {
    return typeof obj === 'object' && Object.prototype.toString.call(obj).toLowerCase() === '[object object]' && !obj.length;
};

/**
 * 判断json是否为空值
 */
const isEmpty = (json) => {
    if (json) {
        for (let key in json) {
            return false;
        }
        // return Object.keys(json).length === 0
    }
    return true;
};

/**
 * 正则表达式替换
 * @param str: 原始字符串
 * @param regExp: 正则表达式
 * @param callBack: 回调获得要替换的内容
 * @returns {*}
 */
const regExpReplace = (str, regExp, callBack) => {
    let list = str.match(regExp);
    list = [...new Set(list)];
    for (let v of list) {
        str = str.replace(new RegExp(`#{${v}}`, 'g'), callBack(v));
    }
    return str;
};

/**
 * 替换所有匹配exp的字符串为指定字符串
 * @param exp 被替换部分的正则
 * @param newStr 替换成的字符串
 */
const replaceAll = function (exp, newStr) {
    return this.replace(new RegExp(exp, 'gm'), newStr);
};

/**
 * 字符串格式化
 * @param str: 要格式化的字符串
 * @param args: 格式化参数值
 */
const format = function(str, args) {
    let result = str;
    if (str.length < 1) {
        return result;
    }
    let data = str; // 如果模板参数是数组
    if (str.length == 1 && typeof args == 'object') {
        // 如果模板参数是对象
        data = args;
    }
    for (let key in data) {
        let value = data[key];
        if (undefined != value) {
            result = result.replaceAll('\\{' + key + '\\}', value);
        }
    }
    return result;
};

/**
 * 判断两个json的差异,但不包括children项
 */
const diff = (oldJson, newJson) => {
    let diff={};
    for (let key in newJson) {
        if (key !== 'children') {
            if (oldJson) {
                if (oldJson[key] !== newJson[key]) {
                    diff[key] = newJson[key];
                }
            } else {
                diff[key] = newJson[key];
            }
        }
    }
    return isEmpty(diff) ? null : diff;
};

/**
 * 首字母大写
 * @param first
 * @param rest
 * @param lowerRest: 为true代表后面的字符全部转小写,否则后面的字符原样不变
 * @returns {string}
 */
const capitalize = ([first, ...rest], lowerRest = false) => first.toUpperCase() + (lowerRest ? rest.join('').toLowerCase() : rest.join(''));

/**
 * 数据转换
 * @param data: 要转换的json数据对象{}
 * @param fieldName: 字段名称
 * @param dataConver: 转换类型,例如将ff字段在数组与字符串间转换:{ff: 'array->string'}
 */
function dataConver(data, conver) {
    for (let key in conver) {
        if (conver[key] === 'array->string' && data[key] != null) {
            data[key] instanceof Array && (data[key] = data[key].join(',')) || (data[key] = data[key].split(','));
        }
    }
}

/**
 * 将一维的扁平数组转换为多层级对象,针对父级儿子各一条记录的情况
 * @param data: json数组
 * @param option: {pid: 父亲字段, id: id字段名称}
 * @param pidVal: 父字段值,如果有值则代表只建立顶层为该值的树
 * @returns: 返回建立的树对象
 */
const towToTree = (data, option, pidVal = null, conver, rowCallBack) => {
    const fa = (parentId) => {
        if (pidVal != null) {
            const temp = [];
            for (let v of data) {
                conver && dataConver(v, conver);
                rowCallBack && rowCallBack(v);
                if (v[option.pid] === parentId) {
                    v.children = fa(v[option.id]);
                    temp.push(v);
                }
            }
            return temp;
        } else {
            let map = {};// 将数据存储为以id为 KEY的 map索引数据列
            for (let v of data) {
                conver && dataConver(v, conver);
                rowCallBack && rowCallBack(v);
                map[v[option.id]] = v;
            }
            let val = [];
            for (let v of data) {
                let parent = map[v[option.pid]];
                if (parent && parent[option.pid]!=parent[option.id]) { /* 如果找到索引，说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中 */
                    (parent.children || (parent.children = [])).push(v);
                } else {
                    val.push(v); /* 如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级 */
                }
            }
            return val;
        }
    };
    return fa(pidVal);
};

/**
 * 针对父亲儿子都在一条记录中,因此分离出父亲并添加父亲行
 * @param data: json数组
 * @param option:{pid: 父亲字段, keyField: id字段名称, label: 名称字段名称}
 * @param dataConver: 数据转换,常用于将字符串转为数组等
 * @param callBack: 每次产生父节点记录后的回调,用于外部修正父节点
 * @returns {[]}
 */
const oneToTree = (data, option, conver, callBack) => {
    let map = new Map();
    (data||[]).forEach((v) => {
        let t = map.get(v[option.pid]);
        if (t) {
            t.children.push(v);
        } else {
            t={children: [v]};
            t[option.pid] = v[option.pid];
            t[option.id] = Math.floor(Math.random() * (1000 + 1));
            t[option.label] = v[option.label];
            conver && dataConver(v, conver);
            callBack && callBack(t, v);
            map.set(v[option.pid], t);
        }
    });
    return [...map.values()];
};

/**
 * 将json数组转化为树型结构,父子为同1条记录,用户级联选择(待测试)
 * @param data:list数组
 * @param parm: {}
 * @returns {Array}
 */
const mapToTree = (data, parm=[{label: '_pid'}, {id: 'id'}]) => {
    /* TODO 待测试 */
    let val = [];
    let map = [];
    let cols = parm.length - 1;
    for (let v of data) {
        for (let i=0;i<=cols;i++) {
            let tmpItem = {};
            if (i === cols) {
                tmpItem = v;
            } else {
                tmpItem.id = v[parm[i].id];
                tmpItem.label = v[parm[i].label];
                delete v[parm[i].id];
                delete v[parm[i].label];
            }
            let parent = map[i][parm[i].id];
            if (parent) {
                (parent.children || (parent.children = [])).push(tmpItem);
            } else {
                map[i][parm[i].id] = tmpItem;
                val.push(tmpItem);
            }
        }
    }
    return val;
};

/**
 * 在树中查找指定字段和指定值的节点和所在的当前上层树
 * @param data:数据
 * @param id:字段
 * @param value:对象或者具体值
 * @returns: {node: 当前节点, tree: 当前节点所在的树, index: 当前节点在当前层的索引}
 */
const findTree = (data, id, value) => {
    let ret = {node: null, index: null, tree: null};
    const deepSearch = (tree) => {
        if (tree && tree.length) {
            for (let i = 0; i < tree.length; i++) {
                let v = tree[i];
                if (value != null) {
                    /* 值比较 */
                    if (value === v[id]) {
                        ret.node = v;
                        ret.index = i;
                        ret.tree = tree;
                        break;
                    }
                } else {
                    /* 对象比较 */
                    if (lodash.isEqual(id, v)) {
                        ret.node = v;
                        ret.index = i;
                        ret.tree = tree;
                        break;
                    }
                }
                if (v.children && v.children.length > 0) {
                    deepSearch(v.children);
                }
            }
        }
    };
    deepSearch(data);
    return ret;
};

/**
 * 在树中查找指定字段和指定值所在的当前节点
 * @param data:数据
 * @param id:字段
 * @param value:具体值
 * @returns: {当前节点}
 */
const findTreeNode = (data, id, value) => {
    const deepSearch = (tree) => {
        for (let i = 0; i < tree.length; i++) {
            let v = tree[i];
            if (value === v[id]) {
                return v;
            }
            if (v.children && v.children.length>0) {
                v = deepSearch(v.children);
                if (v) {
                    return v;
                }
            }
        }
    };
    return deepSearch(data);
};

/**
 * 在树中查找指定字段和指定值所在的当前节点
 * @param data:数据
 * @param id:字段
 * @param value:具体值
 * @returns: {当前节点}
 */
const findIndexTreeNode = (data, id, value, expand, callBack) => {
    let index = -1;
    const deepSearch = (tree) => {
        for (let i = 0; i < tree.length; i++) {
            index ++;
            let v = tree[i];
            if (value === v[id]) {
                if (v.children && v.children.length > 0 && expand) {
                    if (expand.find(o => o === v[id])) {
                        tree = v.children;
                        i = -1;
                    } else {
                        index = index + v.children.length
                    }
                }
                callBack && callBack(tree, i);
                return index;
            }
            if (v.children && v.children.length > 0) {
                if (!expand || expand.find(o => o === v[id])) {
                    v = deepSearch(v.children);
                    if (v) {
                        return v;
                    }
                } else {
                    expand && (index = index + v.children.length);
                }
            }
        }
    };
    return deepSearch(data);
};

const findTreeNodeFromIndex = (data, Index, callBack) => {
    let index = -1;
    const deepSearch = (tree) => {
        for (let i = 0; i < tree.length; i++) {
            index ++;
            if (index == Index) {
                callBack && callBack(tree, i);
                return tree;
            }
            let v = tree[i];
            if (v.children && v.children.length > 0) {
                deepSearch(v.children);
            }
        }
    };
    return deepSearch(data);
};

/**
 * 删除树节点
 * @param tree
 * @param id:可以是字段或者节点对象,否则第三个参数value必须有值
 * @param value:当valueField为节点对象时,为空否则必须录入该字段的值
 */
const deleteTreeNode = (tree, id, value) => {
    const deepSearch = (tree) => {
        let index = null;
        for (let i=0;i<tree.length;i++) {
            let v = tree[i];
            if (value != null) {
                /* 值比较 */
                if (value === v[id]) {
                    index = i;
                    break;
                }
            } else {
                /* 对象比较 */
                if (lodash.isEqual(id, v)) {
                    index = i;
                    break;
                }
            }
            if (v.children && v.children.length>0) {
                deepSearch(v.children);
            }
        }
        if (index != null) {
            tree.splice(index, 1);
        }
    };
    deepSearch(tree);
};

/**
 *  替换树节点
 * @param data
 * @param newNode
 * @param id
 * @param value
 */
const replaceTreeNode = (data, newNode, id = 'id', value = null) => {
    const deepSearch = (tree) => {
        for (let i=0; i<tree.length;i++) {
            let v = tree[i];
            if (value != null) {
                /* 值比较 */
                if (value === v[id]) {
                    tree[i] = newNode;
                    break;
                }
            } else {
                /* 对象比较 */
                if (lodash.isEqual(id, v)) {
                    // v = newNode;
                    tree[i] = newNode;
                    break;
                }
            }
            if (v.children && v.children.length>0) {
                deepSearch(v.children);
            }
        }
    };
    deepSearch(data);
};

const throttle = function (fn) {
    let isRunning=false, lastParams = null, lastObject = null;
    return async function(...params) {
        if (isRunning && lastObject === this && lodash.isEqual(lastParams, params)) {
            return;
        }
        isRunning = true;
        lastParams = params;
        lastObject = this;
        try {
           return await fn.apply(this, params);
        } catch (e) {
            console.error(e);
        } finally {
            isRunning = false;
        }
    }
};

const findFirstChildrenComponent = (fromComponent, tag) => {
    for (let v of fromComponent.$children){
        if (v.$options._componentTag === tag){
            return v;
        }
        if (v.$children.length > 0) {
            v = findFirstChildrenComponent(v, tag);
            if (v) {
                return v;
            }
        }
    }
    return null;
};

const findChildrenComponent = (fromComponent, callBack) => {
    fromComponent.$children.forEach(v => {
        callBack && callBack(v);
        v.$children > 0 && findChildrenComponent(v, callBack);
    });
};

const findInputComponent = (component, field) => {
    for (let v of component.$children){
        if (v.$vnode.data.model && v.$vnode.data.model.expression && (v.$vnode.data.model.expression === field || v.$vnode.data.model.expression.endsWith('.' + field) || v.$vnode.data.model.expression.endsWith('[prop]') && v.$attrs.field === field)) {
            return v;
        }
        let o = v.$children > 0 && findInputComponent(v, field);
        if (o) {
            return o;
        }
    }
    return null;
};

const getLastSplitString = (srcStr, splitChar) => {
    let n = srcStr.lastIndexOf(splitChar);
    if (n > 0){
        srcStr = srcStr.substring(n + 1);
    }
    return srcStr;
};

/**
 * 校验指定的规则
 * @param fieldVal
 * @param rules
 * @returns {boolean}
 */
const validateField = (fieldVal, rules) => {
    rules = lodash.castArray(rules);
    const setError = (message) => {
        rules.component.$el.setAttribute('tooltip', message || '数据录入不完整!');
        rules.component.$el.className = rules.component.$el.className ? rules.component.$el.className + ' is-error' : ' is-error';
        return false;
    };
    if (fieldVal == null || lodash.isArray(fieldVal) && fieldVal.length < 1) {
        return setError(null);
    } else {
        for (let v of rules){
            let type = v.type;
            if (lodash.isFunction(type)) {
                if (!type(fieldVal)) {
                    return setError(v.message);
                }
            } else if (lodash.isString(type)) {
                if (!validateRules[type].test.test(fieldVal)) {
                    return setError(v.message || validateRules[type].message);
                }
            } else {
                if (type.hasOwnProperty('length')) {
                    if (new RegExp('^.{' + type[0] + ',' + type[1] + '}$').test(fieldVal)){
                        return setError(v.message || '长度只能介于' + type[0]+ '至' + type[1]+ '个字符之间。');
                    }
                }
            }
        }
    }
    return true;
};


const setComponentRuleActon = (dataSource, component, currEditSelection, field, rules) => {
    component.$on('focus', () => {
        component.$el.removeAttribute('tooltip');
        component.$el.className = component.$el.className.replace(/ is-error/g, '');
    });
    component.$on('blur', () => {
        if (validateField(currEditSelection.newData[field], rules)) {
            rules.component.$el.className = rules.component.$el.className.replace(/ is-error/g, '');
            rules.component.$el.removeAttribute('tooltip');
        }
    });
    // for(let v of lodash.castArray(rules)){
    //     if (v.trigger === 'change') {
    //         component.$on('change', () => validateField(this.currEditSelection.newData[field], rules));
    //         break;
    //     }
    // }
    rules.component = component;
    !dataSource.save && (dataSource.save = {validate: {rulesRun: {}}});
    !dataSource.save.validate && (dataSource.save.validate = {rulesRun: {}});
    !dataSource.save.validate.rulesRun && (dataSource.save.validate.rulesRun = {});
    dataSource.save.validate.rulesRun[field] = rules;
};

export default {
    getUUID,
    getStyle,
    getHeight,
    cloneDeep,
    arrayIndexOf,
    arrayLastIndexOf,
    arrayIndexCount,
    isString,
    isJson,
    isEmpty,
    replaceAll,
    format,
    capitalize,
    regExpReplace,

    diff,

    dataConver,
    towToTree,
    oneToTree,
    mapToTree,

    findTree,
    findTreeNode,
    findIndexTreeNode,
    findTreeNodeFromIndex,
    deleteTreeNode,
    replaceTreeNode,

    throttle,
    findFirstChildrenComponent,
    findChildrenComponent,
    findInputComponent,
    getLastSplitString,
    setComponentRuleActon,
    validateField
}
