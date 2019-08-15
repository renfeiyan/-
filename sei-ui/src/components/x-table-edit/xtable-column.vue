<template>
    <el-table-column v-if="!hidden" :prop="prop" v-bind="$attrs" :show-overflow-tooltip="showOverflowTooltip">
        <template slot-scope="scope">
            <slot v-if="!isEditBox(scope)" name="show" :row="scope.row" :action="actionType">
                {{ scope.row[prop] }}
            </slot>
            <slot v-else name="edit" :row="scope.row" :action="actionType">
                <el-input-number v-if="isNumber()" v-model="scope.row[prop]" :field="prop" :disabled="disabled" v-bind="$attrs"/>
                <el-input v-else v-model="scope.row[prop]" :field="prop" v-bind="$attrs" :disabled="disabled" clearable placeholder="请输入"/>
            </slot>
            <span><slot :row="scope.row" :$index="scope.$index" :action="actionType"/></span>
        </template>
    </el-table-column>
</template>

<script>
    export default {
        name: 'XTableColumn',
        props: {
            prop: {Type: String}, /* 字段名称 */
            showOverflowTooltip: {Type: Boolean, default: true}, /* 是否超过列宽度显示提示信息 */
            hidden: {Type: Boolean, default: false}, /* 是否隐藏列 */
            query: {Type: Boolean, default: true}, /* 查询是否需要查询该字段 */
            add: {Type: Boolean, default: true}, /* 是否在新增时显示编辑框 */
            edit: {Type: Boolean, default: true}, /* 是否编辑,不显示编辑框 */
            save: {Type: Boolean, default: true}, /* 是否在提交保存时提交该字段及值 */
            disabled: {Type: Boolean, default: false} /* 是否编辑,不显示编辑框 */
        },
        methods: {
            isNumber() {
                if (this.$attrs.type) {
                    if (this.$attrs.type==='Number') {
                        return true;
                    }
                }
                return false;
            },
            isEditBox(scope){
                let v = this.$parent.$parent;
                return (this.edit && v.isEdit || this.add && v.isAdd) && v.isAddOrEdit && v.currEditSelection.index == scope.$index;
            },
            actionType() {
                return this.$parent.$parent.actionType;
            }
        }
    };
</script>
