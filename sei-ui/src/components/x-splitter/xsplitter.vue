<template>
    <div class="split-panel" @mousemove="dragMove" @mouseup="dragStop" :class="{'dragging': dragging, 'vert': layoutType == 'vertical', 'hori': layoutType == 'horizontal'}">
        <div class="split-panel-part" ref="part1" :style="layoutType == 'horizontal' ? {width: panelSize1} : {height: panelSize1}">
            <slot name="1"></slot>
        </div>
        <div class="split-panel-gutter" @mousedown="dragStart" :style="layoutType == 'horizontal' ? {width: gutterSizeString} : {height: gutterSizeString}"></div>
        <div class="split-panel-part" ref="part2" :style="layoutType == 'horizontal' ? {width: panelSize2} : {height: panelSize2}">
            <slot name="2"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'XSplitter',
        props: ['layout', 'gutter', 'init', 'min', 'max'],
        data() {
            return {
                layoutType: this.layout || 'horizontal',
                gutterSize: this.gutter || 4, /* 分割线宽度 */
                percent: this.init || 30, /* 初始化百分比 */
                minPercent: this.min || 0, /* 第一栏最小宽(高)度 */
                maxPercent: this.max || 100, /* 第一栏最大宽(高)度 */
                dragging: false
            };
        },
        computed: {
            gutterSizeString() {
                return `${this.gutterSize}px`;
            },
            panelSize1() {
                return `calc(${this.percent}% - ${this.gutterSize}px)`;
            },
            panelSize2() {
                return `${100 - this.percent}%`;
            }
        },
        methods: {
            dragStart(e) {
                e.preventDefault();
                this.dragging = true;
                this.startPos = this.layoutType === 'horizontal' ? e.pageX : e.pageY;
                this.startSplit = this.percent;
                e.stopPropagation();
            },
            dragMove(e) {
                if (this.dragging) {
                    e.preventDefault();
                    const dx = (this.layoutType === 'horizontal' ? e.pageX : e.pageY) - this.startPos;
                    const totalSize = this.layoutType === 'horizontal' ? this.$el.offsetWidth : this.$el.offsetHeight;
                    this.percent = this.startSplit + Math.round(dx / totalSize * 100);
                    if (this.percent < this.minPercent) {
                        this.percent = this.minPercent;
                    } else if (this.percent > this.maxPercent) {
                        this.percent = this.maxPercent;
                    }
                    e.stopPropagation();
                }
            },
            dragStop(e) {
                if (this.dragging) {
                    e.preventDefault();
                    this.dragging = false;
                    e.stopPropagation();
                    let myEvent = new Event('resize');
                    myEvent.sendSrc = this._uid;
                    window.dispatchEvent(myEvent);
                }
            }
        }
    };
</script>

<style scoped>
    *, *::before, *::after {
        box-sizing: border-box;
    }
    .split-panel {
        width: 100%;
        height: 100%;
    }
    .split-panel-part {
        overflow: auto;
    }
    .split-panel.hori > .split-panel-part {
        height: 100%;
    }
    .split-panel.hori{
        display: flex;
        justify-content: center;
    }
    .split-panel.vert > .split-panel-part {
        width: 100%;
    }
    .split-panel-gutter {
        background: rgba(255,255,255,0.2);
        z-index: 1;
        background-clip: padding-box;
    }
    .split-panel.hori > .split-panel-gutter {
        cursor: col-resize;
        border-left: 1px solid rgba(0,0,0,0.2);
        border-right: 1px solid rgba(0,0,0,0.2);
    }
    .split-panel.vert > .split-panel-gutter {
        width: 100%;
        cursor: row-resize;
        border-top: 1px solid rgba(0,0,0,0.2);
        border-bottom: 1px solid rgba(0,0,0,0.2);
    }
    .split-panel.hori > .split-panel-gutter:hover,
    .split-panel.hori > .split-panel-gutter:focus {
        border-left: 1px solid rgba(0, 0, 0, 0.8);
        border-right: 1px solid rgba(0, 0, 0, 0.8);
    }
    .split-panel.vert > .split-panel-gutter:hover,
    .split-panel.vert > .split-panel-gutter:focus {
        border-top: 1px solid rgba(0, 0, 0, 0.8);
        border-bottom: 1px solid rgba(0, 0, 0, 0.8);
    }
    .split-panel.hori.dragging {
        cursor: col-resize;
    }
    .split-panel.vert.dragging {
        cursor: row-resize;
    }
</style>
