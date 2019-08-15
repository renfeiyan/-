<template>
    <transition
        name="dialog-fade"
        @after-enter="afterEnter"
        @after-leave="afterLeave">
        <div class="el-dialog__wrapper" v-dialogDrag v-show="visible" @click.self="handleWrapperClick">
            <div
                role="dialog"
                aria-modal="true"
                :aria-label="title || 'dialog'"
                class="el-dialog"
                :class="[{ 'is-fullscreen': fullscreen, 'el-dialog--center': center }, customClass]"
                ref="dialog"
                :style="style">
                <div class="el-dialog__header">
                    <slot name="title">
                        <span class="el-dialog__title">{{ title }}</span>
                    </slot>
                    <button
                        type="button"
                        class="el-dialog__headerbtn"
                        aria-label="Close"
                        v-if="showClose"
                        @click="handleClose">
                        <i class="el-dialog__close el-icon el-icon-close"></i>
                    </button>
                </div>
                <div class="el-dialog__body" v-if="rendered"><slot></slot></div>
                <div class="el-dialog__footer" v-if="$slots.footer">
                    <slot name="footer"></slot>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import {Dialog} from 'element-ui';
    export default {
        name: 'XDialog',
        mixins: [Dialog],
        props: {
            closeOnClickModal: {type: Boolean, default: false},
            maxHeight: {type: String, default: null}, /* 最大高度 */
            height: String
        },
        computed: {
            style() {
                let style = {};
                if (!this.fullscreen) {
                    if (this.width) {
                        style.width = this.width;
                    }
                    if (this.height) {
                        style.height = this.height;
                    }
                    if (this.maxHeight) {
                        style.maxHeight = this.maxHeight
                    }
                }
                return style;
            }
        },
        directives: {
            dialogDrag: {
                bind(el) {
                    const dialogHeaderEl = el.querySelector('.el-dialog__header');
                    const dragDom = el.querySelector('.el-dialog');
                    dialogHeaderEl.style.cursor = 'move';
                    const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null);
                    dialogHeaderEl.onmousedown = (e) => {
                        const disX = e.clientX - dialogHeaderEl.offsetLeft;
                        const disY = e.clientY - dialogHeaderEl.offsetTop;
                        let styL, styT;
                        if (sty.left.includes('%')) {
                            styL = +document.body.clientWidth * (+sty.left.replace('%', '') / 100);
                            styT = +document.body.clientHeight * (+sty.top.replace('%', '') / 100);
                        } else {
                            styL = +sty.left.replace('px', '');
                            styT = +sty.top.replace('px', '');
                        }
                        document.onmousemove = (e) => {
                            const l = e.clientX - disX;
                            const t = e.clientY - disY;
                            dragDom.style.left = `${l + styL}px`;
                            dragDom.style.top = `${t + styT}px`;
                        };
                        document.onmouseup = () => {
                            document.onmousemove = null;
                            document.onmouseup = null;
                        };
                    }
                }
            }
        }
    }
</script>
<style scoped>
    .el-dialog .el-dialog__header{
        background-color:#f3f5f6;
    }
    .el-dialog{
        left: 50%;
        top: 50%;
        transform: translate3d(-50%, -50%, 0);
        position: absolute;

        display: flex !important;
        flex-direction:column;
        overflow:auto;
        max-height:calc(100% - 30px);
        max-width:calc(100% - 30px);
    }
    .el-dialog .el-dialog__body{
        overflow:auto
    }
    .el-dialog__footer{
        border-top: 1px solid #88888838;
    }
</style>
