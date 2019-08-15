<template>
    <div v-if="xVisible">
        <div ref="drawer" class="mask" v-if="mask" :style="{'z-index':zindex}" @click="xVisible=false"/>
        <div class="drawer-body" :class="direction" :style="{'width':width+'px','background':background,'z-index':zindex+1}">
            <div ref="title" class="drawer-header">{{title}}</div>
            <i class="close-btn el-icon-close" @click="xVisible=false"/>
            <div ref="content" class="content">
                <slot/>
                <slot name="footer"/>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'XDrawer',
        props: {
            zindex: {type: Number, default: 1001},
            visible: Boolean, /* 是否显示drawer */
            direction: {type: String, default: 'right'}, /* drawer方向  可选择 right left */
            width: {type: Number, default: 400}, /* drawer宽度 */
            background: {type: String, default: '#ffffff'}, /* drawer背景色 */
            mask: {type: Boolean, default: true}, /* 是否显示遮罩层 */
            title: {type: String, default: ''}
        },
        data() {
            return {
                xVisible: this.visible
            }
        },
        mounted() {
            window.addEventListener('resize', this.setSize);
            this.xVisible && this.$nextTick(() => this.setSize());
        },
        methods: {
            setSize(){
                this.xVisible && (this.$refs.content.style.height = this.$refs.drawer.offsetHeight - this.$refs.title.offsetHeight - 40 + 'px');
            }
        },
        beforeDestroy(){
            window.removeEventListener('resize', this.setSize);
        }
    }
</script>

<style scoped lang="less">
    .mask {
        position: absolute;
        height: 100%;
        width: 100%;
        top: 0;
        left: 0;
        background-color: #000;
        opacity: 0.5;
    }
    .drawer-header{
        padding-top: 10px;
        width: calc(100% - 20px);
        min-height:50px;
        font-size: 18px;
        line-height: 25px;
        border-bottom: 1px solid #bdbdbd;
        margin-bottom: 20px;
    }
    .drawer-body {
        position: absolute;
        height:100%;
        top: 0;
        bottom: 0;
        padding: 0 20px;
        background-color: white;
    }
    .content{
        overflow: auto;
    }
    .close-btn{
        position: relative;
        margin-top: -60px;
        top:10px;
        float: right;
        cursor: pointer;
    }
    .right,.left{
        height:100%;
        position: absolute;
    }
    .right{
        right:0;
        animation:rightMove 0.3s;
    }
    @keyframes rightMove
    {
        0%   {right:-300px;}
        100% {right:0;}
    }
    .left{
        left:0;
        animation:leftMove 0.3s;
    }
    @keyframes leftMove
    {
        0%   {left:-300px;}
        100% {left:0;}
    }
</style>
