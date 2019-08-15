<template>
    <x-dialog v-if="dialogOpen" v-bind="$attrs" :visible.sync="dialogOpen" :showClose="showClose" :maxHeight="maxHeight">
        <slot :row="currEditSelection.newData" :action="isSee" :actionType="actionType"/>
        <div slot="footer">
            <slot name="footer"/>
            <el-button v-if="action==='add' || action==='edit'" type="primary" icon="el-icon-success" @click="saveClick">保 存</el-button>
            <el-button icon="el-icon-error" @click="cancelClick">关 闭</el-button>
        </div>
    </x-dialog>
</template>

<script>
    import XDialog from '../x-dialog';
    import dataSource from '../support/data-source';
    export default {
        name: 'XDialogEdit',
        mixins: [dataSource],
        components: {XDialog},
        props: {
            maxHeight: {type: String, default: null}, /* 最大高度 */
            beforeSave: {default: null}, /* 保存前的回调函数 */
            save: {type: Function, default: null}, /* 保存函数,覆盖默认的保存函数 */
            request: {type: Boolean, default: false}, /* 是否重新从数据库中拿一条记录,用于编辑功能 */
            visible: {type: Boolean, default: false}, /* 弹出框是否可见 */
            showClose: {type: Boolean, default: false} /* 是否显示关闭按钮 */
        },
        data() {
            return {
                dialogOpen: this.visible, /* 打开新增、修改、查看对话框 */
                action: null
            }
        },
        watch: {
            visible(newVal) {
                this.dialogOpen = newVal;
            }
        },
        methods: {
            open(action) {
                this.dialogOpen = true;
                this.action = action;
            },
            cancelClick() {
                if (this.actionType != null){
                    this.resetEditStatus();
                } else {
                    this.$parent.resetEditStatus && this.$parent.resetEditStatus();
                }
                // if (this.action === 'edit') {
                //     this.$parent.resetEditStatus && this.$parent.resetEditStatus();
                // }
                this.$emit('update:actionType', null);
                this.dialogOpen = false;
            },
            saveClick() {
                let v = this.actionType != null ? this.currEditSelection : this.$parent.currEditSelection;
                if ((this.beforeSave && this.beforeSave(v.newData, v.oldData)) !== false) {
                    if (this.save) {
                       this.save(v.newData, v.oldData);
                    } else {
                        let v = this.actionType != null ? this : this.$parent;
                        if (v.handelSave) {
                            v = v.handelSave();
                            v === true && this.cancelClick() || v.then && v.then((res) => {
                                res === true && this.cancelClick();
                            });
                        } else if (this.$options._parentListeners && this.$options._parentListeners.save) {
                            this.$emit('save');
                        }
                    }
                }
            }
        }
    }
</script>
