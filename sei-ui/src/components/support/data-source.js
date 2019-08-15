/**
 * 数据源
 */
import dbUtil from '../../utils/dbUtil';
import store from '../../store';
import lodash from 'lodash/lang';
import {Message, MessageBox} from 'element-ui';
import tools from '../../utils/tools';
export default {
    name: 'dataSource',
    props: {
        attButton: {type: Object, default () {return {}}}, /* 外部传入按钮 */
        dic: {type: Array, default () {return null}}, /* 字典配置 */
        data: {type: Array, default () {return null}}, /* 外部传入数据 */
        dataSource: {type: Object, default () {return {}}}, /* 数据源配置 */
        linkage: {default: null}, /* 外部联动对象 */
        excludeVal: Array, /* 要排除的主键字段值数据 */
        xextOption: {type: Object, default () {return {}}}, /* 扩展绑定字段变量 对应当前记录的字段名称 */
        dependent: {type: Object, default () {return null}}, /* 插件依赖 */

        addAction: {type: Function, default: null}, /* 新增事件,替换默认的新增事件 */
        editAction: {type: Function, default: null}, /* 编辑事件,替换默认的编辑事件 */
        saveAction: {type: Function, default: null}, /* 保存事件,替换默认的保存事件 */
        delAction: {type: Function, default: null}, /* 删除事件,替换默认的删除事件 */
        queryAction: {type: Function, default: null} /* 查询事件,替换默认的查询事件 */
    },
    data () {
        return {
            rows: this.data || [], /* 控件数据 */
            dataSourceX: this.dataSource,

            pvButtons: null, /* 有权限控制的所有操作按钮 */
            actionType: null, /* 当前操作类型:add,edit,see */

            dialogEdit: null, /* 弹出的编辑对话框实例 */
            currSelection: null, /* 当前选中原始行数据 */
            multiSelection: [], /* 多选时选中原始行数据 */

            currEditSelection: {
                index: null, /* 正在新增或编辑的行的行号,只用于表格 */
                oldData: null, /* 正在新增或编辑的行的副本数据 */
                newData: {} /* 正在新增或编辑的行的副本新数据 */
            },
            tmpRowData: null, /* 临时变量,当前行数据,等同于currEditSelection,但是在新增/修改时本变量为null以便触发依赖事件 */
            watchCall: [] /* 依赖回调队列 */
        };
    },
    created() {
        if (!this.dataSourceX.query) {
            this.dataSourceX.query = {};
        }
    },
    mounted() {
        this.dic && dbUtil.getDicData(this.dic, this._queryDataArrive);
        this.init && this.init();
        this.showPagination && this.pagination && (this.dataSourceX.query || (this.dataSourceX.query = {})) && (this.dataSourceX.query.pagination = this.pagination);
        if (this.dataSourceX.dependent) {
            this.$nextTick(() => {
                let v = this.$slots && this.$slots.query && this.$slots.query[0];
                if (v) {
                    v.elm.querySelectorAll('input').forEach((k) => {k.disabled = true;});
                    v.elm.querySelectorAll('button').forEach((k) => {k.disabled = true;})
                }
            });
        } else {
            if (!this.dataSourceX.option || this.dataSourceX.option.load !== false) {
                this.handelQuery(null, null, this._queryDataArrive);
            }
        }
        this.dataSourceX.option && this.dataSourceX.option.hasOwnProperty('load') && delete this.dataSourceX.option.load;
        for (let v of this.$children) {
            if (v.$options._componentTag === 'x-dialog-edit') {
                this.dialogEdit = v;
                break;
            }
        }
        if (this.dataSourceX && this.dataSourceX.dependent) {
            let dependent = this.dataSourceX.dependent;
            if (dependent.target) {
                (dependent.call || dependent.filter) && dependent.target().watchCall.push((row) => {
                    if (row) {
                        dependent.call && dependent.call(this.dataSourceX, row);
                        let v = dependent.filter && dependent.filter(row);
                        if (v) {
                            !this.dataSourceX.query && (this.dataSourceX.query = {});
                            this.dataSourceX.query.filter = v;
                            this.handelQuery(null, null, this._queryDataArrive);
                            v = this.$slots && this.$slots.query && this.$slots.query[0];
                            if (v) {
                                v.elm.querySelectorAll('input').forEach((k) => {k.disabled = false;});
                                v.elm.querySelectorAll('button').forEach((k) => {k.disabled = false;})
                            }
                        } else {
                            this.initClear();
                        }
                    } else {
                        this.initClear();
                    }
                });
            }
        }
    },
    computed: {
        getDic() {
            return store.state.dic.change;
        },
        /* 是否选中,只有选中才会有修改和删除按钮 */
        isSelect() {
            return this.currSelection != null;
        },
        /* 是否有 权限 按钮 */
        hasPvButtons () {
            return this.pvButtons != null;
        },
        /* 是否有 新增 按钮 */
        hasAdd() {
            return this.pvButtons && this.pvButtons.hasOwnProperty('add') && !this.isAddOrEdit;
        },
        /* 是否有 编辑 按钮 */
        hasEdit() {
            return this.pvButtons && this.pvButtons.hasOwnProperty('edit') && !this.isAddOrEdit;
        },
        /* 是否有 删除 按钮 */
        hasDel() {
            return this.pvButtons && this.pvButtons.hasOwnProperty('del') && !this.isAddOrEdit;
        },
        /* 是否有 查看 按钮 */
        hasSee() {
            return this.pvButtons && this.pvButtons.hasOwnProperty('see');
        },
        /* 是否有 保存 按钮 */
        hasSave() {
            return this.isAddOrEdit;
        },
        /* 是否有 取消保存 按钮 */
        hasCancel() {
            return this.isAddOrEdit;
        },
        /* 是否有 导出 按钮 */
        hasExport() {
            return this.pvButtons && this.pvButtons.hasOwnProperty('export');
        },

        /* 当前操作状态: 编辑或新增 状态 */
        isAddOrEdit() {
            return (this.actionType === 'add' || this.actionType === 'edit') && !this.dialogEdit;
        },
        /* 当前操作状态: 新增 状态 */
        isAdd() {
            return this.actionType === 'add';
        },
        /* 当前操作状态: 编辑 状态 */
        isEdit() {
            return this.actionType === 'edit';
        },
        /* 当前操作状态: 查看 状态 */
        isSee() {
            return this.actionType === 'see';
        }
    },
    watch: {
        deep: true,
        getDic() {
            let v = this.dataSource.option && this.dataSource.option.dic;
            if (v && v === store.state.dic.changeName) {
                this.rows = store.state.dic[v] && store.state.dic[v].data && store.state.dic[v].data.rows || []
            }
        },
        data(newVal, oldVal) {
            if (!lodash.isEqual(newVal, oldVal)) {
                this.rows = newVal;
                if (this.pagination) {
                    this.pagination.total = newVal.total
                }
                if (newVal.keyField) {
                    (this.dataSourceX || (this.dataSourceX = {})) && (this.dataSourceX.option || (this.dataSourceX.option = {})) && (this.dataSourceX.option.keyField = newVal.keyField);
                    // this.keyField = newVal.keyField;
                }
                this.resetEditStatus();
            }
        },
        tmpRowData(newVal, oldVal) {
            if (!lodash.isEqual(newVal, oldVal)) {
                for (let v of this.watchCall) {
                    v && v(newVal);
                }
            }
        }
    },
    methods: {
        /**
         * 获得数据源
         * @returns {}
         */
        getDataSource() {
            return this.dataSourceX;
        },

        /**
         * 获得当前选中行数据
         * @returns {null}
         */
        getCurrSelection() {
            return this.currSelection;
        },

        /**
         * 获得多选时的选中行数据
         * @returns []
         */
        getMultiSelection() {
            return this.multiSelection;
        },

        /**
         * 获得当前选中行的主键字段名
         * @returns ''|null
         */
        getKeyFieldName() {
            return this.dataSourceX && this.dataSourceX.option && this.dataSourceX.option.keyField;
        },

        /**
         * 联动操作,常用于选择一个值后, 根据选择项刷新别的控件数据
         */
        doLinkage() {
            let v = {};
            v[this.getKeyFieldName()] = this.currSelection[this.getKeyFieldName()];
            this.linkage && this.linkage(this.currSelection, [v]);
        },

        /**
         * 新增或修改前判断主键与浏览器现有数据主键是否重复
         * @param row
         * @returns {boolean}
         */
        checkDoubleKeyField(row) {
            let v = this.getKeyFieldName();
            if (this.rows && row && v && row[v]) {
                for (let i = 0; i < this.rows.length; i++) {
                    if ((this.dialogEdit || i != this.currEditSelection.index) && this.rows[i][v] === row[v]) {
                        return true;
                    }
                }
            }
            return false;
        },

        /**
         * 新增或修改时绑定校验规则到控件
         */
        bindValidate(){
            this.dataSourceX && this.dataSourceX.save && this.dataSourceX.save.validate && delete this.dataSourceX.save.validate.rulesRun;
            if (!this.dialogEdit) {
                this.$nextTick(() => {
                    let v = this.dataSourceX && this.dataSourceX.save && this.dataSourceX.save.validate && this.dataSourceX.save.validate.rules;
                    if (v) {
                        let vm = tools.findFirstChildrenComponent(this, 'el-table');
                        if (vm) {
                            vm = tools.findFirstChildrenComponent(vm, 'table-body');
                            if (vm) {
                                for (let field in v) {
                                    let c = tools.findInputComponent(vm, field);
                                    if (c) {
                                        tools.setComponentRuleActon(this.dataSourceX, c, this.currEditSelection, field, v[field]);
                                    }
                                }
                            }
                        }
                    }
                })
            }
        },

        /**
         * 保存前的总校验
         * @param row
         * @returns {boolean}
         */
        validate(row){
            let status = true;
            let v = this.dataSourceX && this.dataSourceX.save && this.dataSourceX.save.validate && this.dataSourceX.save.validate.rulesRun;
            if (v) {
                for (let field in v) {
                    if (tools.validateField(row[field], v[field]) === false){
                        status = false;
                    }
                }
            }
            return status;
        },

        /**
         * 数据保存操作
         * @param beforeCallback
         * @param afterCallback
         * @returns {*}
         */
        handelSave: tools.throttle(async function(beforeCallback, afterCallback) {
            let diff = {};
            beforeCallback && beforeCallback(this.actionType);
            if (this.actionType === 'add') {
                diff = lodash.cloneDeep(this.currEditSelection.newData);
            } else if (this.actionType === 'edit') {
                diff = tools.diff(this.currEditSelection.oldData, this.currEditSelection.newData);
            } else {
                return false;
            }
            if (tools.isEmpty(diff)) {
                Message.warning('数据未改变。');
                return false;
            } else {
                if (this.checkDoubleKeyField(diff)) {
                    Message.error(diff[this.getKeyFieldName()]? '数据值:' + diff[this.getKeyFieldName()] + ' 与已有数据重复,请重新设置' : '关键信息重复(例如编号,编码...等),请修改后再提交。');
                    return false;
                }
                if (!this.validate(this.currEditSelection.newData)){
                    Message.error('数据录入不完整,请录入后再保存。');
                    return false;
                }
                if (this.actionType === 'edit') {
                    diff._oldKeyFieldVal = this.currEditSelection.oldData[this.getKeyFieldName()];
                }
                if (this.saveAction) {
                    return await this.saveAction(this.actionType, this.dataSourceX, diff);
                } else {
                    return await dbUtil.doSaveAction(this.actionType, this.dataSourceX, diff, null, (res, action) => {
                        if (res && res.code === 1) {
                            res.data && res.data.query && this.afterQuery(res.data.query);
                            afterCallback && afterCallback(res, action, this.currEditSelection);
                            return true;
                        }
                    })
                }
            }
        }),

        /**
         * 数据删除操作
         */
        handelDel: tools.throttle(async function() {
            let rows = this.multiSelect ? this.multiSelection : this.currSelection;
            if (rows) {
                await MessageBox.confirm('此操作将永久删除该数据,真的要删除吗?', '删除确认', {
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    if (this.delAction) {
                        await this.delAction();
                    } else {
                        await dbUtil.doSaveAction('del', this.dataSourceX, rows, null, (res) => {
                            if (res && res.code === 1) {
                                this.afterQuery(res.data.query);
                            }
                        });
                    }
                }).catch(() => {
                    Message.info('已取消删除');
                });
            } else {
                Message.error('请选择要删除的数据后才能删除。');
            }
        }),

        afterQuery(data) {
            this.rows = data.rows;
            if (this.dataSource.query && this.dataSource.query.pagination) {
                this.dataSource.query.pagination.total = data.total || 0;
            }
            data.privilege && this._setPrivilegeData(data.privilege);
            this.$refs.seiUIComponentTable && this.$refs.seiUIComponentTable.clearSelection();
            this.resetEditStatus();
        },

        /**
         * 数据查询操作(保存查询条件filter)
         * @param filter:查询条件
         * @param beforeCallback
         * @param afterCallback
         */
        handelQueryFilter: tools.throttle(async function(filter, beforeCallback, afterCallback) {
            if (this.dataSourceX.query) {
                this.dataSourceX.query.queryFilter = filter;
            } else {
                this.dataSourceX.query = {queryFilter: filter};
            }
            this.handelQuery(null, beforeCallback, afterCallback);
        }),

        /**
         * 数据查询操作(不保存查询条件filter)
         * @param filter:查询条件
         * @param beforeCallback
         * @param afterCallback
         */
        handelQuery: tools.throttle(async function(filter, beforeCallback, afterCallback) {
            if (this.queryAction) {
                await this.queryAction(filter, beforeCallback, afterCallback);
            } else {
                await dbUtil.doQueryAction(true, this.dataSourceX, filter, (query, action) => {
                    return beforeCallback && beforeCallback(query, action)
                }, (res, action) => {
                    if (res && res.code === 1) {
                        this.afterQuery(res.data);
                    }
                    afterCallback && afterCallback(res, action);
                });
            }
        }),

        /**
         * 清除数据并初始化状态
         */
        clearData() {
            if (this.pagination) {
                this.pagination.total = 0;
            }
            this.rows = [];
            this.resetEditStatus();
        },

        /**
         * 清除行数据和权限数据
         */
        initClear() {
            this.clearData();
            this.pvButtons = null;
            let v = this.$slots && this.$slots.query && this.$slots.query[0];
            if (v) {
                v.elm.querySelectorAll('input').forEach((o) => {o.disabled = true;});
                v.elm.querySelectorAll('button').forEach((o) => {o.disabled = true;})
            }
        },

        /**
         * 开始进行增改看操作:add,edit,see
         * @param action:动作=>add,edit,see
         * @param index:表格数据的行索引(只针对表格)
         * @param afterCallback:回调
         */
        beginAction: tools.throttle(async function(action, index, afterCallback) {
            this.actionType = action;
            this.currEditSelection.index = index == null ? null : index;
            let v;
            if (action === 'add') {
                this.currEditSelection.oldData = null;
                this.currEditSelection.newData = {}
                if (this.dataSourceX && this.dataSourceX.option && this.dataSourceX.option.initRow) {
                    if (typeof this.dataSourceX.option.initRow === 'function') {
                        this.dataSourceX.option.initRow(this.currEditSelection.newData);
                    } else {
                        this.currEditSelection.newData = lodash.cloneDeep(this.dataSourceX.option.initRow);
                    }
                }
                (v = this.dataSourceX) && (v = v.webEvn) && (v = v.beforeAddEvn) && v(this.currEditSelection);
                this.bindValidate();
            } else if (action === 'edit') {
                this.currEditSelection.oldData = this.currSelection ? JSON.parse(JSON.stringify(this.currSelection)) : {};
                (v = this.dataSourceX) && (v = v.webEvn) && (v = v.beforeEditEvn) && v(this.currEditSelection);
                this.bindValidate();
            } else if (action === 'see') {
                this.currEditSelection.oldData = null;
                (v = this.dataSourceX) && (v = v.webEvn) && (v = v.beforeSeeEvn) && v(this.currEditSelection);
            }
            if (action !== 'add') {
                if (this.dialogEdit && this.dialogEdit.request) {
                    v = {};
                    v[this.getKeyFieldName()] = this.currSelection[this.getKeyFieldName()];
                   await dbUtil.doQueryAction(false, this.dataSourceX, [v], (json) => {
                        json.option && delete json.option.fields;
                    }, (res) => {
                        if (res && res.code === 1 && res.data && res.data.rows && res.data.rows.length > 0) {
                            this.currEditSelection.newData = res.data.rows[0];
                            this.dialogEdit && this.dialogEdit.open(action);
                            if (action === 'add') {
                                (v = this.dataSourceX) && (v = v.webEvn) && (v = v.afterAddEvn) && v(this.currEditSelection);
                            } else if (action === 'edit') {
                                (v = this.dataSourceX) && (v = v.webEvn) && (v = v.afterEditEvn) && v(this.currEditSelection);
                            } else if (action === 'see') {
                                this.currEditSelection.oldData = null;
                                (v = this.dataSourceX) && (v = v.webEvn) && (v = v.afterSeeEvn) && v(this.currEditSelection);
                            }
                        }
                        afterCallback && afterCallback(this.currEditSelection, 'beforeRequest:' + action);
                    });
                } else {
                    this.currEditSelection.newData = this.currSelection ? JSON.parse(JSON.stringify(this.currSelection)) : index != null ? this.rows[index] : {};
                    if (action === 'edit') {
                        (v = this.dataSourceX) && (v = v.webEvn) && (v = v.afterEditEvn) && v(this.currEditSelection);
                    } else if (action === 'see') {
                        this.currEditSelection.oldData = null;
                        (v = this.dataSourceX) && (v = v.webEvn) && (v = v.afterSeeEvn) && v(this.currEditSelection);
                    }
                    this.dialogEdit && this.dialogEdit.open(action);
                    afterCallback && afterCallback(this.currEditSelection, action);
                }
            } else {
                (v = this.dataSourceX) && (v = v.webEvn) && (v = v.afterAddEvn) && v(this.currEditSelection);
                this.dialogEdit && this.dialogEdit.open(action);
                afterCallback && afterCallback(this.currEditSelection, action);
            }
        }),

        /**
         * 初始化状态标志
         * @param afterCallback
         */
        resetEditStatus(afterCallback) {
            this.actionType = null;
            this.currSelection = null;
            this.multiSelection = [];
            this.currEditSelection.index = null;
            this.currEditSelection.oldData = null;
            this.currEditSelection.newData = {};
            this.tmpRowData = null;
            afterCallback && afterCallback();
        },

        /**
         * 内部函数,合并权限按钮,最终权限按钮在pvButtons值中
         * @param data
         * @private
         */
        _setPrivilegeData(data) {
            if (this.button) {
                this.pvButtons = Object.assign({}, data, this.attButton)
            } else {
                this.pvButtons = data;
            }
            if (lodash.isEmpty(this.pvButtons)) {
                this.pvButtons = null;
            }
        },

        /**
         * 填写扩展信息,常用于选择后将选择行的其它值放到别的字段中
         * @param row
         */
        emitXExtOption(row) {
            for (let v in this.$listeners) {
                if (v.indexOf('update:') !== -1) {
                    let a = v.substr(v.indexOf(':') + 1);
                    this.$emit(v, row[this.xextOption[a] || a]);
                }
            }
        }
    }
}
