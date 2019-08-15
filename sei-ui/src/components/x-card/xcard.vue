<template>
    <div class="card-panel" :style="`height: ${height}px;width: ${width}px`" @click="click">
        <div class="card-panel-icon-wrapper" :style="`color:${iconColor}`">
            <i class="icon iconfont card-panel-icon" :class="icon"></i>
        </div>
        <div class="card-panel-description">
            <div class="card-panel-text">{{title}}</div>
            <x-count-to :start-val="0" :end-val="value" :prefix="prefix" :duration="time" :suffix="suffix" class="card-panel-num"/>
        </div>
    </div>
</template>

<script>
    import XCountTo from './xcount-to';
    export default {
        name: 'XCard',
        components: {XCountTo},
        props: {
            title: {type: String, default: ''},
            value: {type: Number, default: 2019},
            time: {type: Number, default: 2000},
            width: {type: String, default: '250'},
            height: {type: String, default: '108'},
            prefix: {type: String, default: ''},
            suffix: {type: String, default: ''},
            icon: {type: String, default: ''},
            iconColor: {type: String, default: ''}
        },
        methods: {
            click() {
                this.$emit('click');
            }
        }
    }
</script>

<style scoped rel="stylesheet/scss" lang="scss" >
    .card-panel {
        display: table;
        cursor: pointer;
        font-size: 12px;
        position: relative;
        overflow: hidden;
        background: #fff;
        box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
        border-color: rgba(0, 0, 0, .05);
        &:hover {
            .card-panel-icon-wrapper {
                color: #fff;
            }
        }
        .card-panel-icon-wrapper {
            width: 50%;
            transition: all 0.38s ease-out;
            vertical-align: middle;
            text-align: center;
            border-radius: 6px;
            display: table-cell
        }
        .card-panel-icon {
            font-size: 48px;
            padding: 14px;
            border-radius: 6px;
        }
        .card-panel-icon:hover{
            background: #40c9c6;
        }
        .card-panel-description {
            width: 50%;
            display: table-cell;
            font-weight: bold;
            min-width: 126px;
            vertical-align: middle;
            .card-panel-text {
                line-height: 18px;
                color: rgba(0, 0, 0, 0.45);
                font-size: 16px;
                margin-bottom: 12px;
                overflow:hidden;
                text-overflow:ellipsis;
                white-space:nowrap;
            }
            .card-panel-num {
                font-size: 20px;
            }
        }
    }

</style>
