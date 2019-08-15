<template>
    <el-form inline ref="queryForm">
        <div ref="queryItemContainer" class="query-item-container">
            <div ref="queryItem" >
                <slot/>
            </div>
        </div>
        <div class="x-query-button-group">
            <el-button @keyup.enter.native="handelQuery()" @click="handelQuery()" size="mini" type="primary" icon="el-icon-search">查询</el-button>
            <el-button v-if="shouldCollipse" size="mini" type="text" class="collipse-button" :icon="collipse?'el-icon-arrow-down':'el-icon-arrow-up'" @click="queryExtClick">{{shouldCollipse?collipse?"更多":"收起":null}}</el-button>
        </div>
    </el-form>
</template>
<script>
    export default {
        name: 'XQuery',
        props: {
            query: {default: null} /* 查询事件 */
        },
        data() {
            return {
                filter: {querySymbol: {}},
                shouldCollipse: false,
                collipse: false
            };
        },
        mounted: function() {
            window.addEventListener('resize', this._setHeight);
            this._setHeight();
        },
        beforeDestroy(){
            window.removeEventListener('resize', this._setHeight);
        },
        methods: {
            queryExtClick() {
                this.collipse = !this.collipse;
                if (this.collipse) {
                    this.$refs.queryItemContainer.style.height = '50px'
                } else {
                    this.$refs.queryItemContainer.style.height = this.$refs.queryItem.offsetHeight + 'px'
                }
                let myEvent = new Event('resize');
                myEvent.sendSrc = this._uid;
                window.dispatchEvent(myEvent);
            },
            _setHeight(event) {
                if (!event || !event.sendSrc || event.sendSrc != this._uid){
                    this.$nextTick(() => {
                        this.$refs.queryItem.offsetHeight > 60 ? (this.shouldCollipse = true, this.collipse = true) : (this.shouldCollipse=false, this.collipse=false);
                        if (this.$refs.queryItemContainer.offsetHeight > 60) {
                            this.collipse = false;
                        }
                    });
                }
            },
            getFilter() {
                return this.filter;
            },
            getFilterFormat() {
                let filter = [];
                for (let key in this.filter) {
                    if (key != 'querySymbol' && this.filter[key] !== '' && this.filter[key] != null) {
                        let v = {}, v1 = {};
                        v1[this.filter.querySymbol['query.' + key] ? this.filter.querySymbol['query.' + key] : '='] = this.filter[key];
                        v[key] = v1;
                        filter.push(v);
                    }
                }
                return filter.length > 0 ? filter : null;
            },
            changValue(key, val) {
                this.filter[key] = val;
            },
            setOpt(key, val) {
                this.filter.querySymbol['query.' + key] = val;
            },
            handelQuery() {
                if (this.query) {
                    this.query(this.getFilterFormat());
                } else {
                    let parent = this.$parent;
                    while (!parent.handelQueryFilter) {
                        parent = parent.$parent;
                    }
                    parent.handelQueryFilter && parent.handelQueryFilter(this.getFilterFormat());
                }
            }
        }
    };
</script>
<style scoped lang='less'>
    .query-item-container {
        height: 50px;
        display: inline-block;
        overflow: hidden;
        max-width: calc(100% - 155px);
    }
    .x-query-button-group {
        display: inline-block;
        vertical-align: top;
    }
    .collipse-button {
        vertical-align: top;
        margin-right: 10px;
        transform: translateY(8px);
    }
</style>
