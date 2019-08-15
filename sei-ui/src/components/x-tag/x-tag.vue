<template>
    <div :class="['x-tag',active?`active ${activeClass}`:'']" @click.stop="click">
        <slot>{{ title }}</slot>
        <span class="el-icon-close close" @click.stop="close" v-if="closable"/>
    </div>
</template>
<script>
    export default {
        name: 'XTag',
        props: {
            title: {type: [Number, String]},
            active: {type: [Boolean]},
            activeClass: {type: String, default: ''},
            closable: {type: [Boolean], default: false}
        },
        methods: {
            close() {
                this.$emit('close');
            },
            click() {
                this.$emit('click');
            }
        }
    };
</script>
<style lang="less" scoped>
    .x-tag {
        display: inline-block;
        border: 1px solid #d8dce5;
        cursor: pointer;
        color: #495060;
        padding: 0 8px;
        font-size: 12px;
        text-align: center;
        line-height: 24px;
        height: 24px;
        .close {
            width: 16px;
            height: 16px;
            border-radius: 50%;
            text-align: center;
            transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
            transform-origin: 100% 50%;
            vertical-align: 2px;
            margin-left: 2px;
            &:hover {
                background-color: #cc5865;
                color: #fff;
            }
            &:before {
                transform: scale(0.6);
                display: inline-block;
                /*vertical-align: -3px;*/
            }
        }
    }
    .active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;
        &::before {
            left: 5px;
            content: "";
            display: inline-block;
            height: 8px;
            width: 8px;
            background: #fff;
            border-radius: 50%;
            margin-right: 3px;
        }
    }
</style>
