<template>
    <section style="height:100%">
        <div ref="title" class="title" v-if="title">{{title}}</div>
        <slot name="query"/>
        <el-form ref="formButtons" inline v-if="$slots.topButtonAreaHead || $slots.topButtonAreaTail || (showTopButton && pvButtons)">
            <slot name = "topButtonAreaHead" :row="pvButtons" :action="actionType"/>
            <el-form-item v-if="hasAdd">
                <slot name="add"/>
                <el-button v-if="!$slots.add" @click="handelTableRowAdd(null)" type="primary" icon="el-icon-plus" plain size="mini">新增</el-button>
            </el-form-item>
            <el-form-item v-if="hasEdit">
                <slot name="edit"/>
                <el-button v-if="!$slots.edit" :disabled="!isSelect" @click="handelTableRowEdit('edit')" type="warning" icon="el-icon-edit" plain size="mini">修改</el-button>
            </el-form-item>
            <el-form-item v-if="hasSave">
                <slot name="save"/>
                <el-button v-if="!$slots.save" @click="handelSave(()=>{if(!dialogEdit){currEditSelection.newData = $refs.seiUIComponentTable.store.states.data[currEditSelection.index]}})" type="warning" icon="el-icon-success" plain size="mini">保存</el-button>
            </el-form-item>
            <el-form-item v-if="hasCancel">
                <slot name="cancel"/>
                <el-button v-if="!$slots.cancel" @click="handelTableRowCancel()" type="success" icon="el-icon-error" plain size="mini">取消</el-button>
            </el-form-item>
            <el-form-item v-if="hasDel">
                <slot name="del"/>
                <el-button v-if="!$slots.del" :disabled="!isSelect && multiSelection.length==0" @click="handelDel(null)" type="danger" icon="el-icon-close" plain size="mini">删除</el-button>
            </el-form-item>
            <el-form-item v-if="hasSee && (dialogEdit || $slots.see)">
                <slot name="see"/>
                <el-button v-if="!$slots.see" :disabled="!isSelect" @click="handelTableRowEdit('see')" type="success" icon="el-icon-view" plain size="mini">查看</el-button>
            </el-form-item>
            <el-form-item v-if="hasExport">
                <slot name="export"/>
                <el-button v-if="!$slots.export" @click="handelShowExport" type="primary" icon="el-icon-sold-out" plain size="mini">导出</el-button>
            </el-form-item>
            <slot name = "topButtonAreaTail" :row="pvButtons" :action="actionType"/>
        </el-form>
        <el-table ref="seiUIComponentTable" v-bind="$attrs" style="border-top:1px solid #ebeef5;" @row-click="handleClickRow" @selection-change="handleSelectionChange" :data="nativeRowsValue" :size="size" :width="width" :height="fitHeight && myFitHeight || height" :max-height="fitHeight && myFitHeight || maxHeight" :fit="fit" :stripe="stripe" :border="border" :context="context" :showHeader="showHeader" :showSummary="showSummary" :sumText="sumText" :summaryMethod="summaryMethod" :rowClassName="rowClassName" :rowStyle="rowStyle" :cellClassName="cellClassName" :cellStyle="cellStyle" :headerRowClassName="headerRowClassName" :headerRowStyle="headerRowStyle" :headerCellClassName="headerCellClassName" :headerCellStyle="headerCellStyle" :highlightCurrentRow="highlightCurrentRow" :rowKey="rowKey" :currentRowKey="currentRowKey" :emptyText="emptyText" :expandRowKeys="expandRowKeys" :defaultExpandAll="defaultExpandAll" :defaultSort="defaultSort" :tooltipEffect="tooltipEffect" :spanMethod="spanMethod" :selectOnIndeterminate="selectOnIndeterminate"
                  @select="select" @select-all="selectAll" @cell-mouse-enter="cellMouseEnter" @cell-mouse-leave="cellMouseLeave" @cell-click="cellClick" @cell-dblclick="cellDblclick" @row-contextmenu="rowContextmenu" @row-dblclick="rowDblclick" @header-click="headerClick" @header-contextmenu="headerContextmenu" @sort-change="sortChange" @filter-change="filterChange" @current-change="currentChange" @header-dragend="headerDragend" @expand-change="expandChange">
            <el-table-column v-if="lineNumber" type="index" width="40" fixed/>
            <el-table-column v-if="multiSelect" type="selection" width="30" fixed/>
            <el-table-column v-if="singleSelect" width="30" fixed>
                <el-radio slot-scope="scope" v-model="currSelection" :label="scope.row"/>
            </el-table-column>
            <slot/>
            <x-table-column label="操作" fixed="right" v-if="$scopedSlots.rowButtonArea || (showRowButton && pvButtons)" :edit="false">
                <template slot-scope="scope">
                    <el-form inline class="rowForm">
                        <el-form-item v-if="hasAdd">
                            <slot name="rowAdd"/>
                            <el-button v-if="!$slots.rowAdd" @click="handelTableRowAdd(scope.$index)" type="primary" plain size="mini">新增</el-button>
                        </el-form-item>
                        <el-form-item v-if="hasEdit">
                            <slot name="rowEdit"/>
                            <el-button v-if="!$slots.rowEdit" @click="handelTableRowEdit('edit',scope.$index,()=>{currSelection = $refs.seiUIComponentTable.store.states.data[scope.$index]})" type="warning" plain size="mini">修改</el-button>
                        </el-form-item>
                        <el-form-item v-if="hasSave && scope.$index == currEditSelection.index">
                            <slot name="rowSave"/>
                            <el-button v-if="!$slots.rowSave" @click="handelSave(()=>{if(!dialogEdit){currEditSelection.newData = $refs.seiUIComponentTable.store.states.data[currEditSelection.index]}})" type="warning" plain size="mini">保存</el-button>
                        </el-form-item>
                        <el-form-item v-if="hasCancel && scope.$index == currEditSelection.index">
                            <slot name="rowCancel"/>
                            <el-button v-if="!$slots.rowCancel" @click="handelTableRowCancel()" type="success" plain size="mini">取消</el-button>
                        </el-form-item>
                        <el-form-item v-if="hasDel">
                            <slot name="rowDel"/>
                            <el-button v-if="!$slots.rowDel" @click="handelDel(scope.$index)" type="danger" plain size="mini">删除</el-button>
                        </el-form-item>
                        <el-form-item v-if="hasSee && (dialogEdit || $slots.rowSee)">
                            <slot name="rowSee"/>
                            <el-button v-if="!$slots.rowSee" @click="handelTableRowEdit('see',scope.$index,()=>{currSelection = $refs.seiUIComponentTable.store.states.data[scope.$index]})" type="success" plain size="mini">查看</el-button>
                        </el-form-item>
                        <span style="display:flex;"><slot name = "rowButtonArea" :row="scope.row" :index="scope.$index"></slot></span>
                    </el-form>
                </template>
            </x-table-column>
        </el-table>
        <el-pagination ref="pagination" style="text-align:center" v-if="showPagination" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="pageSize" :layout="pagerLayout" :current-page="currentPage" :total="pagination.total" :pageCount="pageCount" :small="small" :popperClass="popperClass" :prevText="prevText" :nextText="nextText" :background="background" :disabled="disabled"/>
        <slot name="dialog" :row="currEditSelection.newData" :action="isSee" :actionType="actionType"/>
        <x-dialog title="导出" :visible.sync="exportDialog" showClose width="550px">
            <x-table-edit-export-choice ref="expotTable">
                <x-table-column prop="title" label="原标题" width="200" :edit="false"/>
                <el-table-column prop="title1" label="新标题">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.title1" clearable placeholder="请输入"/>
                    </template>
                </el-table-column>
            </x-table-edit-export-choice>
            <div slot="footer">
                <el-button type="primary" icon="el-icon-success" @click="handelExport">导 出</el-button>
                <el-button icon="el-icon-error" @click="exportDialog=false">取 消</el-button>
            </div>
        </x-dialog>
    </section>
</template>

<script>
    import dataSource from '../support/data-source';
    import pagination from '../support/pagination';
    import tools from '../../utils/tools';
    import XTableColumn from '../x-table-edit/xtable-column';
    import XDialog from '../x-dialog';
    import dbUtil from '../../utils/dbUtil';
    import {Message} from 'element-ui';
    import http from '../../utils/http';
    import XTableEditExportChoice from './xtable-edit-export-choice';
    export default {
        name: 'XTableEdit',
        components: {XTableColumn, XDialog, XTableEditExportChoice},
        mixins: [dataSource, pagination],
        props: {
            fitHeight: {type: Boolean, default: true}, /* 表格是否自适应高度 */
            multiSelect: {type: Boolean, default: false}, /* 表格是否允许多选,显示复选框 */
            singleSelect: {type: Boolean, default: true}, /* 表格是否允许单选,显示单选框 */
            lineNumber: {type: Boolean, default: true}, /* 表格行号 */
            showPagination: {type: Boolean, default: true}, /* 是否显示分页工具条 */
            showRowButton: {type: Boolean, default: false}, /* 是否在表格内每行最后1列显示操作按钮 */
            showTopButton: {type: Boolean, default: true}, /* 是否在表格顶部显示操作按钮 */
            title: String, /* 表格顶部标题 */

            size: String,
            width: [{type: String, default: '100%'}, Number],
            height: [{type: String, default: '100%'}, Number],
            maxHeight: [String, Number],
            fit: {type: Boolean, default: true},
            stripe: {type: Boolean, default: true},
            border: Boolean,
            context: {},
            showHeader: {type: Boolean, default: true},
            showSummary: Boolean,
            sumText: String,
            summaryMethod: Function,
            rowClassName: [String, Function],
            rowStyle: [Object, Function],
            cellClassName: [String, Function],
            cellStyle: [Object, Function],
            headerRowClassName: [String, Function],
            headerRowStyle: [Object, Function],
            headerCellClassName: [String, Function],
            headerCellStyle: [Object, Function],
            highlightCurrentRow: {type: Boolean, default: true},
            rowKey: [String, Function],
            currentRowKey: [String, Number],
            emptyText: String,
            expandRowKeys: Array,
            defaultExpandAll: Boolean,
            defaultSort: Object,
            tooltipEffect: String,
            spanMethod: Function,
            selectOnIndeterminate: {type: Boolean, default: true}
        },
        data() {
            return {
                oldHeight: 0,
                myFitHeight: 200, /* 计算高度 */
                expand: [], /* 展开行的数组 */
                exportDialog: false
            }
        },
        computed: {
            nativeRowsValue() {
                return this.rows === null || this.rows === undefined ? [] : this.rows;
            }
        },
        watch: {
            pvButtons(newVal, oldVal){
                if (oldVal == null && newVal != null && this.fitHeight){
                    this.$nextTick(() => {
                        this.$refs.formButtons && (this.myFitHeight = this.oldHeight - this.$refs.formButtons.$el.offsetHeight);
                    });
                }
            }
        },
        mounted() {
            window.addEventListener('resize', this._size);
            this.$nextTick(() => this._size());
        },
        beforeDestroy(){
            window.removeEventListener('resize', this._size);
        },
        methods: {
            /* 导出 */
            handelShowExport(){
                if (this.dataSourceX) {
                    let fields = [];
                    let titles = [];
                    for (let v of this.$refs.seiUIComponentTable.$children) {
                        if (v.prop !== null && v.prop !== undefined) {
                            if (v.prop && !fields.includes(v.prop)) {
                                fields.push(v.prop);
                                titles.push(v.$attrs.label || v.prop);
                            }
                        }
                    }
                    this.exportDialog = true;
                    if (!this.dataSourceX.option || this.dataSourceX.option.export !== false) {
                        let v = {head: this.dataSourceX.head, query: {url: '/data/getFields'}};
                        dbUtil.doQueryAction(false, v, null, null, (res) => {
                            res.data.rows.forEach(v => {
                                let i = fields.indexOf(v.field);
                                if (i >= 0) {
                                    v.title = titles[i];
                                }
                            });
                            this.$nextTick(() => this.$refs.expotTable.rows = res.data.rows);
                        });
                    } else {
                        let rows = [];
                        for (let i = 0; i < fields.length; i++){
                            rows.push({field: fields[i], title: titles[i]});
                        }
                        this.$nextTick(() => this.$refs.expotTable.rows = rows);
                    }
                }
            },
            handelExport(){
                let data = this.$refs.expotTable.getSelectRows();
                if (data.length < 1) {
                    Message.error('请选择导出字段！');
                } else {
                    let fields = [];
                    let titles = [];
                    data.forEach(v => {
                        fields.push(v.field);
                        titles.push(v.title1 || v.title || v.field);
                    });
                    let v = {head: this.dataSourceX.head, option: {export: true, fields: fields.join(','), titles: titles}};
                    let o = this.dataSourceX.query;
                    if (o) {
                        o.order && (v.option.order = o.order);
                        o.filter && (v.option.filter = o.filter);
                        o.group && (v.option.group = o.group);
                        o.merge && (v.option.merge = o.merge);
                    }
                    http.fileDown(o && o.url || '/data/query', v);
                    this.exportDialog = false;
                }
            },
            _size(){
                if (this.fitHeight) {
                    let h = this.$el.offsetHeight;
                    this.title && (h = h - 30);
                    this.$slots.query && this.$slots.query.forEach(v => h = h - v.elm.offsetHeight);
                    this.$refs.formButtons && (h = h - this.$refs.formButtons.$el.offsetHeight);
                    this.$refs.pagination && (h = h - this.$refs.pagination.$el.offsetHeight - 4);
                    this.myFitHeight = this.oldHeight = h;
                    setTimeout(() => this.$refs.seiUIComponentTable.doLayout(), 300);
                    // setTimeout(() => this.myFitHeight = this.myFitHeight + 1, 300);
                }
            },
            getSelectRows() {
                return this.multiSelect ? this.multiSelection : [this.currSelection];
            },

            handleSelectionChange(selection) {
                this.multiSelection = selection;
                this.$emit('selection-change', selection);
            },

            handleClickRow(row, column, event) {
                if (!this.isAddOrEdit) {
                    this.currSelection = row;
                    this.tmpRowData = row;
                    if (this.multiSelect) {
                        let a =this.multiSelection.findIndex((k) => {
                            if (k._id == row._id) {
                                return true;
                            }
                        });
                        this.$refs.seiUIComponentTable.toggleRowSelection(row, a === -1);
                    }
                    this.$emit('row-click', row, column, event);
                }
            },

            handelTableRowAdd(index) {
                let ii = -1, data = this.$refs.seiUIComponentTable.store.states.data || [];
                if (index == null) {
                    if (this.currSelection) {
                        index = tools.findIndexTreeNode(data, this.getKeyFieldName(), this.currSelection[this.getKeyFieldName()], this.expand, (v, i) => {
                            ii = 0;
                            if (!this.dialogEdit) {
                                !this.currEditSelection.newData.hasOwnProperty(this.getKeyFieldName()) && (this.currEditSelection.newData[this.getKeyFieldName()] = '');
                                v.splice(i + 1, 0, this.currEditSelection.newData);
                            }
                        });
                    } else {
                        index = -1;
                    }
                }
                index ++;
                this.beginAction('add', index, () => {
                    if (!this.dialogEdit) {
                        ii === -1 && data.splice(index, 0, this.currEditSelection.newData);
                    }
                    this.$refs.seiUIComponentTable.store.commit('setData', data);
                    this.tmpRowData = null;
                });
            },

            handelTableRowEdit(action, index, callBack) {
                callBack && callBack();
                this.beginAction(action, index, () => {
                    if (!this.dialogEdit && index == null) {
                        this.currEditSelection.index = tools.findIndexTreeNode(this.$refs.seiUIComponentTable.store.states.data, this.getKeyFieldName(), this.currSelection[this.getKeyFieldName()]);
                    }
                    this.tmpRowData = null;
                });
            },

            handelTableRowCancel() {
                let data;
                if (this.actionType == 'add') {
                    data = this.$refs.seiUIComponentTable.store.states.data;
                    tools.findTreeNodeFromIndex(data, this.currEditSelection.index, (v, i) => {
                        v.splice(i, 1);
                    });
                    this.$refs.seiUIComponentTable.store.commit('setData', data);
                    this.$emit('afterCancel', this.actionType, data);
                } else if (this.actionType == 'edit') {
                    data = this.$refs.seiUIComponentTable.store.states.data;
                    tools.replaceTreeNode(data, this.currEditSelection.oldData, this.getKeyFieldName(), this.currSelection[this.getKeyFieldName()]);
                    this.$refs.seiUIComponentTable.store.commit('setData', data);
                    this.$emit('afterCancel', this.actionType, data[this.currEditSelection.index], data);
                }
                this.dataSourceX && this.dataSourceX.save && this.dataSourceX.save.validate && delete this.dataSourceX.save.validate.rulesRun;
                this.resetEditStatus(() => {
                    this.multiSelection = [];
                    this.tmpRowData = null;
                    this.$refs.seiUIComponentTable.clearSelection();
                });
            },

            init() {
                if (!this.showPagination) {
                    this.pagination = null;
                }
                let fields = null;
                if (this.dataSourceX.option && this.dataSourceX.option.fields) {
                    if (this.dataSourceX.option.fields !== '*') {
                        fields = new Set(this.dataSourceX.option.fields.split(','));
                    }
                } else {
                    fields = new Set();
                }
                let noSaveFields = [];
                for (let v of this.$refs.seiUIComponentTable.$children) {
                    if (fields && v.prop !== null && v.prop !== undefined && v.query !== false) {
                        fields.add(v.prop);
                    }
                    if (v.save === false) {
                        noSaveFields.push(v.prop)
                    }
                }
                if (fields) {
                    if (!this.dataSourceX.option) {
                        this.dataSourceX.option = {}
                    }
                    this.dataSourceX.option.fields = Array.from(fields).join(',');
                }
                if (noSaveFields.length > 0) {
                    if (this.dataSourceX.save) {
                        this.dataSourceX.save.noSaveFields = noSaveFields;
                    } else {
                        this.dataSourceX.save = {noSaveFields: noSaveFields};
                    }
                }
            },

            select(selection, row) {
                this.$emit('select', selection, row);
            },
            selectAll(selection) {
                this.$emit('select-all', selection);
            },
            cellMouseEnter(row, column, cell, event) {
                this.$emit('cell-mouse-enter', row, column, cell, event);
            },
            cellClick(row, column, cell, event) {
                this.$emit('cell-click', row, column, cell, event);
            },
            cellMouseLeave(row, column, cell, event) {
                this.$emit('cell-mouse-leave', row, column, cell, event);
            },
            cellDblclick(row, column, cell, event) {
                this.$emit('cell-dblclick', row, column, cell, event);
            },
            rowContextmenu(row, column, event) {
                this.$emit('row-contextmenu', row, column, event);
            },
            rowDblclick(row, column, event) {
                this.dialogEdit && this.handelTableRowEdit('see');
                this.$emit('row-dblclick', row, column, event);
            },
            headerClick(column, event) {
                this.$emit('header-click', column, event);
            },
            headerContextmenu(column, event) {
                this.$emit('header-contextmenu', column, event);
            },
            sortChange(data) {
                this.$emit('sort-change', data);
            },
            filterChange(filters) {
                this.$emit('filter-change', filters);
            },
            currentChange(currentRow, oldCurrentRow) {
                this.$emit('current-change', currentRow, oldCurrentRow);
            },
            headerDragend(newWidth, oldWidth, column, event) {
                this.$emit('header-dragend', newWidth, oldWidth, column, event);
            },
            expandChange(row, expanded) {
                !this.dialogEdit && expanded ? this.expand.push(row[this.dataSourceX.data.option.id]) : this.expand.splice(this.expand.findIndex(v => v == row[this.dataSourceX.data.option.id]), 1);
                this.$emit('expand-change', row, expanded);
            }
        }
    };
</script>
<style scoped>
    .title{
        color: #565758;
        font-size: 20px;
        padding-bottom: 10px;
    }
    .rowForm .el-form-item--small.el-form-item{
        margin-bottom: 0px
    }
</style>
