<template>
    <div :style="{width:width,marginRight:'0px'}" class="el-form-item" :class="[{
      'el-form-item--feedback': elForm && elForm.statusIcon,
      'is-error': validateState === 'error',
      'is-validating': validateState === 'validating',
      'is-success': validateState === 'success',
      'is-required': isRequired || required,
      'is-no-asterisk': elForm && elForm.hideRequiredAsterisk
    },
    sizeClass ? 'el-form-item--' + sizeClass : ''
  ]">
        <label :for="labelFor" class="el-form-item__label" :style="labelStyle" v-if="label || $slots.label">
            <slot name="label">{{label + form.labelSuffix}}</slot>
        </label>
        <div class="el-form-item__content" :style="contentStyle">
            <slot></slot>
            <transition name="el-zoom-in-top">
                <slot
                    v-if="validateState === 'error' && showMessage && form.showMessage"
                    name="error"
                    :error="validateMessage">
                    <div
                        class="el-form-item__error"
                        :class="{
              'el-form-item__error--inline': typeof inlineMessage === 'boolean'
                ? inlineMessage
                : (elForm && elForm.inlineMessage || false)
            }"
                    >
                        {{validateMessage}}
                    </div>
                </slot>
            </transition>
        </div>
    </div>
</template>

<script>
    import {FormItem} from 'element-ui'
    export default {
        name: 'xFormItem',
        mixins: [FormItem],
        props: {
            rules: [String, Object, Array] /* 数据校验规则 */
        },
        data() {
            return {
                column: 1
            }
        },
        computed: {
            contentStyle() {
                const ret = {};
                const label = this.label;
                const labelWidth = this.labelWidth || this.form.labelWidth;
                if (this.form.labelPosition === 'top' || this.form.inline) {
                    if (this.$attrs.cols > 1 && labelWidth) {
                        ret.width = `calc(100% - (100% / ${this.column} - ${labelWidth} - 205px) - ${labelWidth})`;
                    }
                    return ret;
                }
                if (!label && !this.labelWidth && this.isNested) {
                    if (this.$attrs.cols > 1 && labelWidth) {
                        ret.width = `calc(100% - (100% / ${this.column} - ${labelWidth} - 205px) - ${labelWidth})`;
                    }
                    return ret;
                }
                if (labelWidth === 'auto') {
                    if (this.labelWidth === 'auto') {
                        ret.marginLeft = this.computedLabelWidth;
                    } else if (this.form.labelWidth === 'auto') {
                        ret.marginLeft = this.elForm.autoLabelWidth;
                    }
                } else {
                    ret.marginLeft = labelWidth;
                }
                ret.width = `calc(100% - (100% / ${this.column} - ${labelWidth} - 205px) - ${labelWidth})`;
                return ret;
            },
            width() {
                if (this.$attrs.hasOwnProperty('cols')) {
                    if (this.column !== this.$attrs.cols) {
                        return `calc(100% / ${this.column} * ${this.$attrs.cols})`;
                    } else {
                        return '100%';
                    }
                } else {
                    return `calc(100% / ${this.column})`;
                }
            }
        },
        created() {
            if (this.$parent.$attrs.hasOwnProperty('cols')) {
                this.column = this.$parent.$attrs.cols;
            }
        }
    }
</script>
