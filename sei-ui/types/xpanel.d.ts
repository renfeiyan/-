
import Vue from 'vue';

export declare interface XPanel extends Vue {
    /**
     * 面板标题
     * @default default
     */
    title?: '';
    /**
     * 是否显示折叠按钮
     * @default true
     */
    closeBtn?: boolean;
    /**
     * 折叠或展开状态
     * @default true
     */
    selected?: boolean;
    /**
     * 高度
     * @default 100%
     */
    height?: string;
}
