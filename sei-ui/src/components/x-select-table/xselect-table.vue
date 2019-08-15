<!-- 表格选择器 -->
<template>
    <div class="el-input-group">
        <label class="x-input-label" v-if="label">{{label}}</label>
        <el-popover ref="popover" :disabled="disabled" placement="bottom-start">
            <x-table-edit :data-source="dataSource" :showTopButton="false" @row-click="choice" :max-height="dialogHeight" :style="`width:${dialogWidth}px;overflow:auto`">
                <span slot="query"><slot name="query"/></span>
                <slot/>
            </x-table-edit>
            <el-input ref="input" slot="reference" v-model="labelModel" v :readonly="readonly" :disabled="disabled" clearable :style="`width: ${width}px`" suffix-icon="el-icon-arrow-down" :placeholder="placeholder"/>
        </el-popover>
    </div>
</template>

<script>
    import dataSource from '../support/data-source';
    import XTableEdit from '../x-table-edit';
    import dbUtil from '../../utils/dbUtil';
    export default {
        name: 'XSelectTable',
        components: {XTableEdit},
        mixins: [dataSource],
        props: {
            disabled: Boolean, /* 禁用 */
            readonly: Boolean, /* 只读 */
            label: {type: String, default: ''}, /* 选择框前的文本 */
            value: [String, Number], /* 接收绑定参数 */
            width: String, /* 输入框宽度 */

            idField: {type: String, request: true}, /* 从表格中拿到v-mode绑定的变量的字段名字 */
            labelField: {type: String, request: true}, /* 从表格中拿到文本框中显示的字段名字 */
            dialogWidth: [String, Number], /* 弹出框宽度 */
            dialogHeight: {String, default: '500px'}, /* 弹出框高度 */
            placeholder: {type: String, default: '请选择'}
        },
        data() {
            return {
                labelModel: null
            }
        },
        mounted() {
            if (this.value != null) {
                let v = {};
                v[this.idField] = this.value;
                dbUtil.doQueryAction(true, this.dataSourceX, [v], null, (res) => {
                    if (res && res.code == 1) {
                        this.labelModel = res.data.rows.length > 0 && res.data.rows[0][this.labelField] || '';
                    }
                });
            }
        },
        watch: {
            value(newVal, oldVal) {
                if (newVal !== oldVal) {
                    for (let v of this.rows) {
                        if (v[this.idField] == newVal) {
                            this.labelModel = v[this.labelField];
                            break;
                        }
                    }
                }
            }
        },
        methods: {
            choice(row) {
                this.currSelection = row;
                this.$refs.popover.showPopper = false;
                this.$emit('input', row[this.idField]);
                this.labelModel = row[this.labelField];
                this.emitXExtOption(row);
                this.$refs.input.focus();
                this.$parent.$parent && this.$parent.$parent.setQueryFieldValue && this.$parent.$parent.setQueryFieldValue(this.$attrs.prop, this.valueModel);
            }
        }
    };
</script>
