<template>
    <div :class="[
    type === 'textarea' ? 'el-textarea' : 'el-input',
    inputSize ? 'el-input--' + inputSize : '',
    {
      'is-disabled': inputDisabled,
      'el-input-group': $slots.prepend || $slots.append || label || dialog,
      'el-input-group--append': $slots.append || dialog,
      'el-input-group--prepend': $slots.prepend,
      'el-input--prefix': $slots.prefix || prefixIcon,
      'el-input--suffix': $slots.suffix || suffixIcon || clearable || showPassword
    }
    ]"
         @mouseenter="hovering = true"
         @mouseleave="hovering = false"
    >
        <template v-if="type !== 'textarea'">
            <!-- 前置元素 -->
            <label class="x-input-label" v-if="label" >{{label}}</label> <!-- 自定义 -->
            <div class="el-input-group__prepend" v-if="$slots.prepend">
                <slot name="prepend"></slot>
            </div>
            <input
                :tabindex="tabindex"
                v-if="type !== 'textarea'"
                class="el-input__inner"
                v-bind="$attrs"
                :type="showPassword ? (passwordVisible ? 'text': 'password') : type"
                :disabled="inputDisabled"
                :readonly="readonly"
                :autocomplete="autoComplete || autocomplete"
                ref="input"
                @compositionstart="handleCompositionStart"
                @compositionend="handleCompositionEnd"
                @input="handleInput"
                @focus="handleFocus"
                @blur="handleBlur"
                @change="handleChange"
                :aria-label="label"
            >
            <!-- 前置内容 -->
            <span class="el-input__prefix" v-if="$slots.prefix || prefixIcon">
        <slot name="prefix"></slot>
        <i class="el-input__icon"
           v-if="prefixIcon"
           :class="prefixIcon">
        </i>
      </span>
            <!-- 后置内容 -->
            <span
                class="el-input__suffix"
                v-if="$slots.suffix || suffixIcon || showClear || showPassword || validateState && needStatusIcon">
        <span class="el-input__suffix-inner">
          <template v-if="!showClear || !showPwdVisible">
            <slot name="suffix"></slot>
            <i class="el-input__icon"
               v-if="suffixIcon"
               :class="suffixIcon">
            </i>
          </template>
          <i v-if="showClear"
             class="el-input__icon el-icon-circle-close el-input__clear"
             @click="clear"
          ></i>
          <i v-if="showPwdVisible"
             class="el-input__icon el-icon-view el-input__clear"
             @click="handlePasswordVisible"
          ></i>
        </span>
        <i class="el-input__icon"
           v-if="validateState"
           :class="['el-input__validateIcon', validateIcon]">
        </i>
      </span>
            <!-- 后置元素 -->
            <div class="el-input-group__append" v-if="$slots.append">
                <slot name="append"></slot>
            </div>
            <!-- 自定义begin-->
            <div class="el-input-group__append" v-if="dialog">
                <el-button icon="el-icon-edit-outline" @click="_openDialog"></el-button>
            </div>
            <x-dialog v-if="dialog"
                custom-class="inputDialog"
                :title="dialog && dialog.title || ''"
                :visible.sync="dialogVisible"
                :width="dialog && dialog.width || '50%'"
                :height="dialog && dialog.height || '50%'">
                <slot name="dialogContent"></slot>
                <div slot="footer">
                    <slot name="footer"/>
                    <el-button type="primary" icon="el-icon-success" @click="dialogClickDefine">{{dialog && dialog.okLabel || '确 定'}}</el-button>
                    <el-button icon="el-icon-error" @click="dialogClickCancel">{{dialog && dialog.cancelLabel || '取 消'}}</el-button>
                </div>
            </x-dialog>
            <!-- 自定义end-->
        </template>
        <textarea
            v-else
            :tabindex="tabindex"
            class="el-textarea__inner"
            @compositionstart="handleCompositionStart"
            @compositionend="handleCompositionEnd"
            @input="handleInput"
            ref="textarea"
            v-bind="$attrs"
            :disabled="inputDisabled"
            :readonly="readonly"
            :autocomplete="autoComplete || autocomplete"
            :style="textareaStyle"
            @focus="handleFocus"
            @blur="handleBlur"
            @change="handleChange"
            :aria-label="label"
        >
    </textarea>
    </div>
</template>
<script>
    import {Input} from 'element-ui'
    import XDialog from '../x-dialog'
    export default {
        name: 'XInput',
        components: {XDialog},
        mixins: [Input],
        data() {
            return {
                dialogVisible: false
            }
        },
        props: {
            onClickDefine: {type: Function, default: null}, /* 弹出框点击确定按钮的回调函数 */
            onClickCancel: {type: Function, default: null}, /* 弹出框点击取消按钮的回调函数 */
            label: {type: String, default: ''}, /* 输入框前的文本标签 */
            size: String, /* 文本框大小 */
            clearable: {type: Boolean, default: true}, /* 是否有清除按钮 */
            dialog: {Type: Object, default: null}, /* 按钮弹出框dialog */
            rule: {Type: Object, default: null}
        },
        methods: {
            dialogClickDefine(){
                let v = this.onClickDefine && this.onClickDefine();
                if (v != null) {
                    this.$refs.input.value = v;
                    this.dialogVisible = false
                }
            },
            dialogClickCancel(){
                this.onClickCancel && this.onClickCancel();
                this.dialogVisible = false
            },
            _openDialog() {
                this.dialogVisible = true;
            }
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
</style>
<style>
    .inputDialog .el-dialog__body{
        height: 100%;
    }
    .inputDialog{
        height: 60%;
    }
</style>
