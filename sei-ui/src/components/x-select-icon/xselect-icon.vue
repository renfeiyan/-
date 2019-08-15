<!-- 图标选择器 -->
<template>
    <div class="el-input-group">
        <label class="x-input-label" v-if="label">{{label}}</label>
        <el-popover ref="popover" placement="bottom-start">
            <el-table :data="data" border :show-header=false :fit=true style="width:100%;overflow: auto" :max-height="dialogHeight" @cell-click="cell">
                <template v-for="(v,index) in cols">
                    <el-table-column :prop="'cc'+index" :key="index" align="center" >
                        <template slot-scope="scope" >
                            <i :class="scope.row[index]"></i>
                        </template>
                    </el-table-column>
                </template>
            </el-table>
            <el-input ref="input" slot="reference" v readonly clearable v-model="labelModel" :style="`width: ${width}px`" suffix-icon="el-icon-arrow-down" :placeholder="placeholder">
                <i slot="prefix" :class="labelModel + ' el-input__icon'"></i>
            </el-input>
        </el-popover>
    </div>
</template>

<script>
    export default {
        name: 'XSelectIcon',
        props: {
            label: {type: String, default: ''}, /* 选择框前的文本 */
            value: String, /* 接收绑定参数 */
            width: String, /* 输入框宽度 */
            dialogWidth: String, /*  弹出框宽度 */
            dialogHeight: {String, default: '300px'}, /* 弹出框高度 */
            placeholder: {type: String, default: '请选择图标'}
        },
        mounted() {
            let c = this.width;
            if (this.dialogWidth) {
                c = parseInt(this.dialogWidth);
            } else {
                if (!c) {
                    c = this.$refs.input.$el.clientWidth;
                }
            }
            c = Math.floor(c/80);
            c = c <= 0?1:c;
            this.cols = new Array(c);
            let it=[], i=0;
            for (let v of this.icons) {
                if (i<c) {
                    i++;
                    it.push(v);
                } else {
                    this.data.push(it);
                    it=[];
                    i=0;
                }
            }
            if (i>0) {
                this.data.push(it);
            }
        },

        data() {
            return {
                labelModel: this.value,
                cols: [],
                data: [],
                icons: ['el-icon-info', 'el-icon-error', 'el-icon-success', 'el-icon-warning', 'el-icon-question', 'el-icon-back', 'el-icon-arrow-left', 'el-icon-arrow-down', 'el-icon-arrow-right', 'el-icon-arrow-up', 'el-icon-caret-left', 'el-icon-caret-bottom', 'el-icon-caret-top', 'el-icon-caret-right', 'el-icon-d-arrow-left', 'el-icon-d-arrow-right', 'el-icon-minus', 'el-icon-plus', 'el-icon-remove', 'el-icon-circle-plus', 'el-icon-remove-outline', 'el-icon-circle-plus-outline', 'el-icon-close', 'el-icon-check', 'el-icon-d-caret', 'el-icon-sort', 'el-icon-sort-down', 'el-icon-sort-up', 'el-icon-tickets', 'el-icon-document', 'el-icon-goods', 'el-icon-sold-out', 'el-icon-news', 'el-icon-message', 'el-icon-date', 'el-icon-printer', 'el-icon-time', 'el-icon-bell', 'el-icon-mobile-phone', 'el-icon-service', 'el-icon-view', 'el-icon-menu', 'el-icon-more', 'el-icon-more-outline', 'el-icon-star-on', 'el-icon-star-off', 'el-icon-location', 'el-icon-location-outline', 'el-icon-phone', 'el-icon-phone-outline', 'el-icon-picture', 'el-icon-picture-outline', 'el-icon-delete', 'el-icon-search', 'el-icon-edit', 'el-icon-edit-outline', 'el-icon-rank', 'el-icon-refresh', 'el-icon-share', 'el-icon-setting', 'el-icon-upload', 'el-icon-upload2', 'el-icon-download', 'el-icon-loading', 'el-icon-view', 'el-icon-c-scale-to-original', 'el-icon-date', 'el-icon-edit', 'el-icon-edit-outline', 'el-icon-folder', 'el-icon-folder-opened', 'el-icon-folder-add', 'el-icon-folder-remove', 'el-icon-folder-delete', 'el-icon-folder-checked', 'el-icon-tickets', 'el-icon-document-remove', 'el-icon-document-delete', 'el-icon-document-copy', 'el-icon-document-checked', 'el-icon-document', 'el-icon-document-add', 'el-icon-printer', 'el-icon-paperclip', 'el-icon-takeaway-box', 'el-icon-search', 'el-icon-monitor', 'el-icon-attract', 'el-icon-mobile', 'el-icon-scissors', 'el-icon-umbrella', 'el-icon-headset', 'el-icon-brush', 'el-icon-mouse', 'el-icon-coordinate', 'el-icon-magic-stick', 'el-icon-reading', 'el-icon-data-line', 'el-icon-data-board', 'el-icon-pie-chart', 'el-icon-data-analysis', 'el-icon-collection-tag', 'el-icon-film', 'el-icon-suitcase', 'el-icon-suitcase-1', 'el-icon-receiving', 'el-icon-collection', 'el-icon-files', 'el-icon-notebook-1', 'el-icon-notebook-2', 'el-icon-toilet-paper', 'el-icon-office-building', 'el-icon-school', 'el-icon-table-lamp', 'el-icon-house', 'el-icon-no-smoking', 'el-icon-smoking', 'el-icon-shopping-cart-full', 'el-icon-shopping-cart-1', 'el-icon-shopping-cart-2', 'el-icon-shopping-bag-1', 'el-icon-shopping-bag-2', 'el-icon-sold-out', 'el-icon-sell', 'el-icon-present', 'el-icon-box', 'el-icon-bank-card', 'el-icon-money', 'el-icon-coin', 'el-icon-wallet', 'el-icon-discount', 'el-icon-price-tag', 'el-icon-news', 'el-icon-guide', 'el-icon-male', 'el-icon-female', 'el-icon-thumb', 'el-icon-cpu', 'el-icon-link', 'el-icon-connection', 'el-icon-open', 'el-icon-turn-off', 'el-icon-set-up', 'el-icon-chat-round', 'el-icon-chat-line-round', 'el-icon-chat-square', 'el-icon-chat-dot-round', 'el-icon-chat-dot-square', 'el-icon-chat-line-square', 'el-icon-message', 'el-icon-postcard', 'el-icon-position', 'el-icon-turn-off-microphone', 'el-icon-microphone', 'el-icon-close-notification', 'el-icon-bangzhu', 'el-icon-time', 'el-icon-odometer', 'el-icon-crop', 'el-icon-aim', 'el-icon-switch-button', 'el-icon-full-screen', 'el-icon-copy-document', 'el-icon-mic', 'el-icon-stopwatch', 'el-icon-medal-1', 'el-icon-medal', 'el-icon-trophy', 'el-icon-trophy-1', 'el-icon-first-aid-kit', 'el-icon-discover', 'el-icon-place', 'el-icon-location', 'el-icon-location-outline', 'el-icon-location-information', 'el-icon-add-location', 'el-icon-delete-location', 'el-icon-map-location', 'el-icon-alarm-clock', 'el-icon-timer', 'el-icon-watch-1', 'el-icon-watch', 'el-icon-lock', 'el-icon-unlock', 'el-icon-key', 'el-icon-service', 'el-icon-mobile-phone', 'el-icon-bicycle', 'el-icon-truck', 'el-icon-ship', 'el-icon-basketball', 'el-icon-football', 'el-icon-soccer', 'el-icon-baseball', 'el-icon-wind-power', 'el-icon-light-rain', 'el-icon-lightning', 'el-icon-heavy-rain', 'el-icon-sunrise', 'el-icon-sunrise-1', 'el-icon-sunset', 'el-icon-sunny', 'el-icon-cloudy', 'el-icon-partly-cloudy', 'el-icon-cloudy-and-sunny', 'el-icon-moon', 'el-icon-moon-night', 'el-icon-dish', 'el-icon-dish-1', 'el-icon-food', 'el-icon-chicken', 'el-icon-fork-spoon', 'el-icon-knife-fork', 'el-icon-burger', 'el-icon-tableware', 'el-icon-sugar', 'el-icon-dessert', 'el-icon-ice-cream', 'el-icon-hot-water', 'el-icon-water-cup', 'el-icon-coffee-cup', 'el-icon-cold-drink', 'el-icon-goblet', 'el-icon-goblet-full', 'el-icon-goblet-square', 'el-icon-goblet-square-full', 'el-icon-refrigerator', 'el-icon-grape', 'el-icon-watermelon', 'el-icon-cherry', 'el-icon-apple', 'el-icon-pear', 'el-icon-orange', 'el-icon-coffee', 'el-icon-ice-tea', 'el-icon-ice-drink', 'el-icon-milk-tea', 'el-icon-potato-strips', 'el-icon-lollipop', 'el-icon-ice-cream-square', 'el-icon-ice-cream-round']
            };
        },
        methods: {
            cell(row, column) {
                let index = parseInt(column.property.substr(2));
                this.labelModel =row[index];
                this.$refs.popover.showPopper = false;
                this.$emit('input', this.labelModel);
                this.$parent.$parent && this.$parent.$parent.setQueryFieldValue && this.$parent.$parent.setQueryFieldValue(this.$attrs.prop, this.valueModel);
            }
        }
    };
</script>

<style scoped>
    .cell > i:before, .el-input__prefix > i:before {
        font-size: 20px;
    }
</style>
