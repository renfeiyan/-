<template>
    <div class="echarts"></div>
</template>

<script>
    import echarts from 'echarts';
    import 'echarts/lib/component/legend';
    const ECHART_EVENTS = [
        'legendselectchanged',
        'legendselected',
        'legendunselected',
        'legendscroll',
        'datazoom',
        'datarangeselected',
        'timelinechanged',
        'timelineplaychanged',
        'restore',
        'dataviewchanged',
        'magictypechanged',
        'geoselectchanged',
        'geoselected',
        'geounselected',
        'pieselectchanged',
        'pieselected',
        'pieunselected',
        'mapselectchanged',
        'mapselected',
        'mapunselected',
        'axisareaselected',
        'focusnodeadjacency',
        'unfocusnodeadjacency',
        'brush',
        'brushselected',
        'rendered',
        'finished',
        'click',
        'dblclick',
        'mouseover',
        'mouseout',
        'mousemove',
        'mousedown',
        'mouseup',
        'globalout',
        'contextmenu'
    ];
    export default {
        name: 'XEchart',
        props: {
            fit: Boolean,
            value: null,
            size: Object,
            theme: [String, Object],
            renderer: {type: String, default: 'canvas'},
            // 是否不跟之前设置的option进行合并
            notMerge: {type: Boolean, default: true},
            group: String, /* 实例的分组，会自动绑定到 ECharts 组件的同名属性上 */
            autoresize: Boolean /* 默认false，这个 prop 用来指定 ECharts 实例在组件根元素尺寸变化时是否需要自动进行重绘 */
        },
        data () {
            return {
                chart: null
            }
        },
        mounted () {
            if (!this.value) {
                // console.error('没有绑定图表数据!');
                return
            }
            let width, height;
            if (!echarts) {
                // console.error('本组件需要配合echarts组件使用,请运行npm i -save echarts安装!');
                return null;
            }
            // 判断用户是否指定了组件的 宽 和 高，如果指定了，那么使用用户指定的值
            // 如果没有指定则使用 父组件 宽高
            // 如果出错 使用400px默认宽高
            if (this.size && this.size.width && this.size.height) {
                width = this.size.width;
                height = this.size.height;
            }
            if (!width && !height) {
                const parent = this.$el.parentNode;
                if (parent && parent.clientWidth && parent.clientHeight) {
                    height = parent.clientHeight - 56;
                    let v = this.$el.previousSibling;
                    while (v) {
                        height = height - v.offsetHeight;
                        v = v.previousSibling;
                    }
                    width = parent.clientWidth - 56;
                } else {
                    height = width = 400;
                }
            }
            // 注册echarts
            if (this.value) {
                setTimeout(() => {
                    this.chart = echarts.init(this.$el, this.theme, {width: width, height: height, renderer: this.renderer});
                    if (this.group) {
                        this.chart.group = this.group
                    }
                    // 绘制图表
                    this.chart.setOption(this.value);
                    ECHART_EVENTS.forEach(event => {
                        this.chart.on(event, params => {
                            this.$emit(event, params)
                        })
                    });
                    // 将chart对象暴露给父组件
                    this.$emit('init', this.chart);
                }, 0)
            }
        },
        watch: {
            group (group) {
                this.chart.group = group
            },
            size: {
                handler: function (val) {
                    // 避免不正常调用导致报错
                    if (!this.chart || val === undefined || val === null) {
                        return;
                    }
                    // 如果高度配置发生改变，更改图表大小
                    this.chart.resize({
                        width: val.width,
                        height: val.height
                    })
                },
                deep: true
            },
            value: {
                handler: function (val) {
                    // console.log('数据发生改变!')
                    // 组件刚刚没创建时value会发生修改，但是这时Echarts实例还没有生成
                    if (!this.chart) {
                        return;
                    }
                    // 判断传入的格式是否正确,如果不正确或者为空则销毁图表
                    if (val !== null && typeof val === 'object') {
                        this.chart.setOption(val, this.notMerge)
                    } else {
                        // console.info('没有传入配置项或者配置项不正确!');
                        this.chart.clear()
                    }
                },
                deep: true
            }
        },
        beforeDestroy () {
            if (this.chart) {
                this.chart.dispose();
                this.chart = null
            }
        }
    }
</script>
<style scoped>
    .echarts {
        display: inline-block;
        position: relative;
        border: 1px solid rgba(0,0,0,0.05);
        border-radius: 8px;
        box-shadow: 4px 4px 40px rgba(0, 0, 0, .1);
        padding: 1.5em 2em;
        min-width: calc(35vw + 4em);
        box-sizing: border-box;
    }
</style>
