<template>
    <section style="height:100%">
        <div ref="title" class="title" v-if="title">{{title}}</div>
        <el-table ref="seiUIComponentTable" v-bind="$attrs" style="border-top:1px solid #ebeef5;" :data="nativeRowsValue" @selection-change="handleSelectionChange" :size="size" :width="width" :height="fitHeight && myFitHeight || height" :max-height="fitHeight && myFitHeight || maxHeight" :fit="fit" :stripe="stripe" :border="border" :context="context" :showHeader="showHeader" :showSummary="showSummary" :sumText="sumText" :summaryMethod="summaryMethod" :rowClassName="rowClassName" :rowStyle="rowStyle" :cellClassName="cellClassName" :cellStyle="cellStyle" :headerRowClassName="headerRowClassName" :headerRowStyle="headerRowStyle" :headerCellClassName="headerCellClassName" :headerCellStyle="headerCellStyle" :highlightCurrentRow="highlightCurrentRow" :rowKey="rowKey" :currentRowKey="currentRowKey" :emptyText="emptyText" :expandRowKeys="expandRowKeys" :defaultExpandAll="defaultExpandAll" :defaultSort="defaultSort" :tooltipEffect="tooltipEffect" :spanMethod="spanMethod" :selectOnIndeterminate="selectOnIndeterminate">
            <el-table-column type="index" width="40" fixed/>
            <el-table-column type="selection" width="30" fixed/>
            <slot/>
        </el-table>
    </section>
</template>

<script>
    import dataSource from '../support/data-source';
    export default {
        name: 'XTableEditExportChoice',
        mixins: [dataSource],
        props: {
            fitHeight: {type: Boolean, default: true}, /* 表格是否自适应高度 */
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
                expand: [] /* 展开行的数组 */
            }
        },
        computed: {
            nativeRowsValue() {
                return this.rows === null || this.rows === undefined ? [] : this.rows;
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
            _size(){
                if (this.fitHeight) {
                    let h = this.$el.offsetHeight;
                    this.title && (h = h - 30);
                    this.$slots.query && this.$slots.query.forEach(v => h = h - v.elm.offsetHeight);
                    this.$refs.formButtons && (h = h - this.$refs.formButtons.$el.offsetHeight);
                    this.$refs.pagination && (h = h - this.$refs.pagination.$el.offsetHeight - 4);
                    this.myFitHeight = this.oldHeight = h;
                    setTimeout(() => this.$refs.seiUIComponentTable.doLayout(), 300);
                }
            },
            getSelectRows() {
                return this.multiSelection;
            },
            handleSelectionChange(selection) {
                this.multiSelection = selection;
                this.$emit('selection-change', selection);
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
