
import Vue from 'vue';

export declare interface pagination extends Vue {

    /**
     * 每页条数变更时回调
     * @param {number} val
     */
    handleSizeChange(val: number): void;

    /**
     * 当前页码变更时回调
     * @param val
     */
    handleCurrentChange(val: number): void;
}
