/**
 * 共有分页插件封装
 * 创建一个需要混入的分页对象
 */
export default {
    name: 'pagination',
    props: {
        pagerLayout: {type: String, default: 'prev,pager,next,total,sizes,jumper'},
        pageSize: {type: Number, default: 10},
        pageSizes: {type: Array, default: () => [10, 25, 50, 100]},
        currentPage: {type: Number, default: 1},
        pageCount: Number,
        small: Boolean,
        popperClass: String,
        prevText: String,
        nextText: String,
        background: Boolean,
        disabled: Boolean
    },
    data: function () {
        return {
            pagination: {
                page: this.currentPage, /* 当前页码 */
                size: this.pageSize, /* 每页记录数 */
                total: 0, /* 总行数 */
                lastId: null /* 最后一行_id值,用于mongodb优化 */
            }
        }
    },
    methods: {
        /**
         * 每页条数变更
         * @param val
         */
        handleSizeChange(size) {
            this.pagination.size = size;
            this.pagination.page = 1;
            this.handelQuery && this.handelQuery();
        },

        /**
         * 当前页码变更
         * @param val
         */
        handleCurrentChange(page) {
            if (page > this.pagination.page) {
                this.lastId = this.rows && this.rows.length >0 && this.rows[this.rows.length - 1];
                this.lastId = this.lastId && this.lastId._id || null;
            } else {
                this.lastId = null;
            }
            this.pagination.page = page;
            this.handelQuery && this.handelQuery();
        }
    }
};
