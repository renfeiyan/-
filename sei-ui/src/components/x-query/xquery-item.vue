<template>
    <el-form-item>
        <label class="x-input-label" v-if="label" >{{label}}</label>
        <slot :row="$parent.$parent.filter">
            <x-input v-model="queryField" v-bind="$attrs" :style="`width: ${width}px`"/>
        </slot>
    </el-form-item>
</template>
<script>
    import XInput from '../x-input';
    export default {
        name: 'XQueryItem',
        components: {XInput},
        props: {
            query: {type: Boolean, default: true}, /* 是否纳入最终SQL查询条件中 */
            label: {default: null}, /* 文本标签 */
            width: String /* 输入框宽度 */
        },
        data() {
            return {
                queryField: ''
            }
        },
        watch: {
            queryField(newValue) {
                this.query && this.setQueryFieldValue(this.$attrs.prop, newValue);
            }
        },
        mounted() {
            this.$attrs.opt && this.query && this.$parent && this.$parent.$parent.setOpt && this.$parent.$parent.setOpt(this.$attrs.prop, this.$attrs.opt);
        },
        methods: {
            setQueryFieldValue(prop, val) {
                prop = this.query && (prop || this.$attrs.prop);
                if (prop) {
                    this.$parent && this.$parent.$parent.changValue && this.$parent.$parent.changValue(prop, val);
                }
            }
        }
    };
</script>

<style scoped>
    .x-input-label{
        display:inline-block;
        vertical-align: middle;
        color: #909399;
        position: relative;
        white-space: nowrap;
    }
    .el-input{
        width: auto;
    }
</style>
