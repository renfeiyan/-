<template>
    <div class="el-input-group">
        <label class="x-input-label" v-if="label">{{label}}</label>
        <el-select ref="select" v-model="svalue" v-bind="$attrs" :name="name" :id="id" :autoComplete="autoComplete" :automaticDropdown="automaticDropdown" :size="size" :disabled="disabled" :clearable="clearable" :filterable="filterable" :allowCreate="allowCreate" :loading="loading" :popperClass="popperClass" :remote="remote" :loadingText="loadingText" :no-match-text="noMatchText" :noDataText="noDataText" :remoteMethod="remoteMethod" :filterMethod="filterMethod" :multiple="multiple" :multipleLimit="multipleLimit" :placeholder="placeholder" :defaultFirstOption="defaultFirstOption" :reserveKeyword="reserveKeyword" :valueKey="valueKey" :collapseTags="collapseTags" :popperAppendToBody="popperAppendToBody"
                   @change="change" @visible-change="visibleChange" @remove-tag="removeTag" @clear="clear" @blur="blur" @focus="focus">
            <el-option v-if="isTree" :label="dataSourceX.data.option.label" :value="dataSourceX.data.option.id">
                <el-tree show-checkbox ref="tree" :node-key="dataSourceX.data.option.id" :data="rows" :props="option" @node-click="onClickNode" @check="onClickNode"/>
            </el-option>
            <el-option v-else v-for="(item) in rows" :key="item[dataSourceX.data.option.id]" :label="item[dataSourceX.data.option.label]" :value="item[dataSourceX.data.option.id]"/>
            <slot/>
        </el-select>
    </div>
</template>

<script>
    import dataSource from '../support/data-source';
    import lodash from 'lodash/lang';
    export default {
        name: 'XSelect',
        mixins: [dataSource],
        props: {
            leafOnly: {type: Boolean, default: false}, /* 树形结构返回值是否只是叶子节点 */
            includeHalfChecked: {type: Boolean, default: false}, /* 树形结构返回值是否包含半选节点 */
            multiple: {type: Boolean, default: false}, /* 是否多选 */
            isTree: {type: Boolean, default: false}, /* 是否显示为树形控件 */
            label: {type: String, default: ''}, /* 选择框前的文本 */
            value: [String, Number, Array], /* 接受外部v-model传入的值 */
            update: {type: Boolean, default: true}, /* 外部改变value值时候是否更改对应的标签文本值,用于该表value值但是文本不变的情况 */
            name: String,
            id: String,
            // autocomplete: {type: String, default: 'off'},
            autoComplete: String,
            automaticDropdown: Boolean,
            size: String,
            disabled: Boolean,
            clearable: {type: Boolean, default: true},
            filterable: {type: Boolean, default: true},
            allowCreate: Boolean,
            loading: {type: Boolean, default: false},
            popperClass: String,
            remote: Boolean,
            loadingText: String,
            noMatchText: {type: String, default: ' '},
            noDataText: String,
            remoteMethod: Function,
            filterMethod: Function,
            multipleLimit: {type: Number, default: 0},
            placeholder: {type: String, default: '请选择'},
            defaultFirstOption: Boolean,
            reserveKeyword: Boolean,
            valueKey: {type: String, default: 'value'},
            collapseTags: Boolean,
            popperAppendToBody: {type: Boolean, default: true}
        },
        data() {
            return {
                option: {pid: '_pid', id: 'id', label: 'name', children: 'children', disabled: 'disabled'},
                svalue: this.value || null
            }
        },
        methods: {
            _queryDataArrive(){
                if (this.svalue != null && this.rows.length > 0) {
                    if (this.isTree) {
                        this.$nextTick(() => {
                            if (this.multiple) {
                                this.$refs.tree.setCheckedKeys(lodash.castArray(this.value), this.leafOnly);
                                this.multiSelection = this.$refs.tree.getCheckedNodes(this.leafOnly, this.includeHalfChecked);
                                this.svalue = [];
                                this.multiSelection.forEach(v => {
                                    this.svalue.push(v[this.dataSourceX.data.option.label]);
                                });
                            } else {
                                this.$refs.tree.setChecked(this.svalue, true, this.leafOnly);
                                this.multiSelection = this.$refs.tree.getNode(this.value);
                                this.svalue = this.multiSelection ? this.multiSelection.label : '';
                            }
                            this.tmpRowData = this.currSelection = this.multiSelection;
                        });
                    } else {
                        if (!this.multiple) {
                            this.tmpRowData = this.currSelection = this.multiSelection = this.rows.find((o) => o[this.dataSourceX.data.option.id] === this.value);
                        }
                    }
                }
            },
            onClickNode(node) {
                if (this.multiple) {
                    this.svalue = lodash.castArray(this.svalue);
                    let v = node[this.dataSourceX.data.option.label];
                    if (this.svalue.includes(v)) {
                        this.$refs.tree.setChecked(node, false, this.leafOnly);
                        this.svalue.splice(this.svalue.indexOf(node[this.dataSourceX.data.option.label]), 1);
                    } else {
                        this.$refs.tree.setChecked(node, true, this.leafOnly);
                        this.svalue.push(node[this.dataSourceX.data.option.label]);
                    }
                    this.$emit('input', this.$refs.tree.getCheckedKeys(this.leafOnly));
                    this.multiSelection = this.$refs.tree.getCheckedNodes(this.leafOnly, this.includeHalfChecked);
                    this.$refs.select.blur(); // 收起下拉框
                    this.$refs.select.focus(); // 获取焦点
                } else {
                    this.$refs.tree.setCheckedKeys([], this.leafOnly);
                    this.$refs.tree.setChecked(node, true, this.leafOnly);
                    this.svalue = node[this.dataSourceX.data.option.label];
                    this.multiSelection = node;
                    this.$emit('input', node[this.dataSourceX.data.option.id]);
                    this.$refs.select.blur(); // 收起下拉框
                    this.$refs.select.focus(); // 获取焦点
                    this.$set(this.$refs.select, 'visible', false);
                }
                this.currSelection = node;
                this._setExtVal();
                this.tmpRowData = this.currSelection;
            },
            _setExtVal(){
                if (!lodash.isEmpty(this.xextOption)) {
                    if (this.rows && this.rows.length > 0) {
                        if (!this.currSelection) {
                            this.currSelection = this.rows.find(v => v[this.option.id] = this.svalue);
                        }
                        this.emitXExtOption(this.currSelection);
                    } else {
                        this.$nextTick(() => {
                            this.emitXExtOption({label: this.$refs.select.$refs.reference.value});
                        });
                    }
                }
            },
            change(val) {
                this.svalue = val;
                this.$emit('input', this.svalue);
                this._setExtVal();
                this.isTree && this.multiple && this.$refs.select.focus();
                this.$parent.$parent && this.$parent.$parent.setQueryFieldValue && this.$parent.$parent.setQueryFieldValue(this.$attrs.prop, this.svalue);
                if (!this.multiple) {
                    this.tmpRowData = this.currSelection = this.rows.find((o) => o[this.dataSourceX.data.option.id] === this.svalue);
                }
            },
            visibleChange(bool) {
                this.$emit('visible-change', bool);
                !bool && this.$nextTick(() => this.$emit('blur', null));
            },
            removeTag(tag) {
                if (this.isTree) {
                    this.multiSelection = this.$refs.tree.getCheckedNodes(this.leafOnly, this.includeHalfChecked);
                    this.multiSelection.forEach((v) => {
                        v[this.dataSourceX.data.option.label] === tag && this.$refs.tree.setChecked(v, false, this.leafOnly);
                    });
                    let v = this.$refs.tree.getCheckedKeys(this.leafOnly);
                    this.$emit('input', v);
                }
                this.$emit('remove-tag', tag);
            },
            clear() {
                this.isTree && this.$refs.tree.setCheckedKeys([], this.leafOnly);
                this.$emit('input', null);
                this.tmpRowData = this.currSelection = this.multiSelection = null;
                this.$emit('clear');
            },
            blur(event) {
                this.$emit('blur', event);
            },
            focus(event) {
                this.$emit('focus', event);
            }
        },
        mounted() {
            this._queryDataArrive();
        }
    }
</script>
<style scoped>
    .x-input-label{
        display:table-cell;
        vertical-align: middle;
        color: #909399;
        position: relative;
        white-space: nowrap;
    }
    .el-scrollbar .el-scrollbar__view .el-select-dropdown__item{
        height: auto;
    }
    .el-select-dropdown__item.selected{
        font-weight: normal;
    }
    .el-tree{
        margin: 0 -20px;
        width: calc(100% + 32px);
    }
    ul li >>>.el-tree .el-tree-node__content{
        height:auto;
    }
    .el-tree-node__label{
        font-weight: normal;
    }
    .el-tree >>>.is-current .el-tree-node__label{
        color: #409EFF;
        font-weight: 700;
    }
    .el-tree >>>.is-current .el-tree-node__children .el-tree-node__label{
        color:#606266;
        font-weight: normal;
    }
</style>
