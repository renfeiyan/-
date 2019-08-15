<template>
    <div ref="panel" class="collapse collapse-item" :class="{'is-active': active}" :style="{width:width,height:height}">
        <div ref="title" class="collapse-header touchable" :aria-expanded="active?'true':'false'" v-if="title">
            {{title}}
            <i v-if="closeBtn" :class="getIcon" class="icon" @click.prevent="toggle"></i>
        </div>
        <transition name="fade">
            <div class="collapse-content-box" v-if="active" style="height:100%" :class="{scrollXclass:scrollX,scrollYclass:scrollY}" >
                <slot></slot>
            </div>
        </transition>
    </div>
</template>

<script>
    export default {
        name: 'XPanel',
        data () {
            return {
                active: this.selected
            };
        },
        props: {
            closeBtn: {type: Boolean, default: true}, /* 是否显示折叠按钮 */
            selected: {type: Boolean, default: true}, /* 折叠或展开状态 */
            title: String,
            height: {type: String, default: '100%'},
            width: {type: String, default: '100%'},
            scrollX: {type: Boolean, default: true}, /* 是否要横向滚动条 */
            scrollY: {type: Boolean, default: true} /* 是否要竖向滚动条 */
        },
        computed: {
            getIcon () {
                return this.active ? 'el-icon-arrow-up' : 'el-icon-arrow-down';
            }
        },
        methods: {
            toggle () {
                this.active = !this.active;
            }
        }
    };
</script>
<style scoped>
    .collapse {
        margin: 1px;
        display: inline-block;
        overflow-y: hidden;
    }
    .icon{
        float: right;
        display: inline-block;
    }
    .collapse .collapse-header {
        padding: 15px;
        background: #f5f7fa;
        border-radius: 3px;
        position: relative;
    }

    .collapse .collapse-header > div {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .collapse .collapse-header h3 {
        font-size: 0.938em;
        font-weight: bold;
    }

    .collapse .collapse-header::before {
        -moz-transition: all .2s;
        -o-transition: all .2s;
        -webkit-transition: all .2s;
        transition: all .2s;
        position: absolute;
        font-size: 0.4em;
        top: calc(50% - 0.4em);
        left: 20px;
        color: #c5c9d0;
        -moz-transform: rotate(-90deg);
        -o-transform: rotate(-90deg);
        -ms-transform: rotate(-90deg);
        -webkit-transform: rotate(-90deg);
        transform: rotate(-90deg);
    }

    .collapse.is-active .collapse-header::before {
        -moz-transform: rotate(0deg);
        -o-transform: rotate(0deg);
        -ms-transform: rotate(0deg);
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }

    .collapse .collapse-content-box {
        line-height: 22px;
        -moz-transition: all .2s;
        -o-transition: all .2s;
        -webkit-transition: all .2s;
        transition: all .2s;
        padding: 15px;
        border-left: 2px solid #f7f7f7;
        border-bottom: 2px solid #f7f7f7;
        border-right: 2px solid #f7f7f7;
        border-top: 2px solid #f7f7f7;
        border-bottom-left-radius: 3px;
        border-bottom-right-radius: 3px;
    }
    /*滚动条样式*/
    .collapse-content-box::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }
    .collapse-content-box::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
        border-radius: 15px;
        -webkit-box-shadow: inset 0 0 2px rgba(0,0,0,0.1);
        background: rgba(0,0,0,0.1);
    }
    .collapse-content-box::-webkit-scrollbar-track {/*滚动条里面轨道*/
        -webkit-box-shadow: inset 0 0 2px rgba(0,0,0,0.1);
        border-radius: 5px;
        background: rgba(0,0,0,0);
    }
    .scrollXclass {
        overflow-x: scroll!important;
        overflow-y: hidden;
    }
    .scrollYclass {
        overflow-y: scroll!important;
        overflow-x: hidden;
    }
</style>
