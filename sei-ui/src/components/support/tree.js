import tools from '../../utils/tools';
import dataSource from './data-source';
export default {
    name: 'tree',
    mixins: [dataSource],
    props: {
        title: String, /* 控件顶部标题 */

        width: String, /* 输入框宽度 */
        Height: String,
        value: [String, Number, Array], /* 接收绑定参数 */
        initValue: [String, Number], /* 初始化值 */
        showTopButton: {type: Boolean, default: true}, /* 是否在表格顶部显示操作按钮 */
        filter: {type: Boolean, default: true}, /* 是否需要过滤搜索框 */
        excludeData: [String, Number, Array], /* 从树型结构数据中删除的数据 */

        emptyText: String,
        renderAfterExpand: {type: Boolean, default: true},
        nodeKey: String,
        checkStrictly: Boolean,
        defaultExpandAll: {type: Boolean, default: false},
        expandOnClickNode: {type: Boolean, default: false},
        checkOnClickNode: {type: Boolean, default: true},
        checkDescendants: {type: Boolean, default: false},
        autoExpandParent: {type: Boolean, default: true},
        defaultCheckedKeys: Array,
        defaultExpandedKeys: Array,
        currentNodeKey: [String, Number],
        renderContent: Function,
        showCheckbox: {type: Boolean, default: false},
        draggable: {type: Boolean, default: false},
        allowDrag: Function,
        allowDrop: Function,
        props: {default() {return null;}},
        lazy: {type: Boolean, default: false},
        highlightCurrent: {type: Boolean, default: true},
        load: Function,
        // filterNodeMethod:Function,
        accordion: Boolean,
        indent: {type: Number, default: 18},
        iconClass: String
    },
    data() {
        return {
            option: {pid: '_pid', id: 'id', label: 'name', children: 'children', disabled: 'disabled'},
            treeWidth: 'auto', /* 菜单宽度 */
            labelModel: '', /* 输入框显示值 */
            valueModel: this.initValue || '0' /* 实际请求传值 */
        };
    },
    created() {
        this.props && Object.assign(this.option, this.props);
        this.dataSourceX && this.dataSourceX.data && this.dataSourceX.data.option && Object.assign(this.option, this.dataSourceX.data.option);
    },
    methods: {
        getInstance() {
            return this.$refs.tree;
        },
        search() {
            this.$refs.tree.filter(this.labelModel);
        },
        // 单击节点
        onClickNode(data, node, tree) {
            // if (this.excludeVal && this.excludeVal.indexOf(node[this.option.id]) !== -1) {
            //     Message({
            //         type: 'error',
            //         message: '不能选择改选项。'
            //     });
            //     return;
            // }
            this.labelModel = data[this.option.label];
            this.valueModel = data[this.option.id];
            this.currSelection = data;
            this.doLinkage();
            this.tmpRowData = this.currSelection;
            this.$emit('input', this.valueModel);
            this.$emit('node-click', data, node, tree);
        },
        // 树节点过滤方法
        filterNode(value, data) {
            if (!value) {
                return true;
            }
            return data[this.option.label] && data[this.option.label].indexOf(value) !== -1;
        },
        // 搜索树状数据中的 ID
        queryTree(tree, id) {
            let ret = tools.findTree(tree, this.option.id, id);
            return ret.node ?ret.node[this.option.label]:'';
        },

        checkChange(data, checked, indeterminate) {
            this.$emit('check-change', data, checked, indeterminate);
        },
        check(v1, v2) {
            this.$emit('check', v1, v2);
        },
        currentChange(data, node) {
            this.$emit('current-change', data, node);
        },
        nodeExpand(data, node, tree) {
            this.$emit('node-expand', data, node, tree);
        },
        nodeContextmenu(event, data, node, tree) {
            this.$emit('node-contextmenu', event, data, node, tree);
        },
        nodeCollapse(data, node, tree) {
            this.$emit('node-collapse', data, node, tree);
        },
        nodeDragStart(node, event) {
            this.$emit('node-drag-start', node, event);
        },
        nodeDragEnter(node, node1, event) {
            this.$emit('node-drag-enter', node, node1, event);
        },
        nodeDragLeave(node, node1, event) {
            this.$emit('node-drag-leave', node, node1, event);
        },
        nodeDragOver(node, node1, event) {
            this.$emit('node-drag-over', node, node1, event);
        },
        nodeDragEnd(node, node1, postion, event) {
            this.$emit('node-drag-end', node, node1, postion, event);
        },
        nodeDrop(node, node1, postion, event) {
            this.$emit('node-drop', node, node1, postion, event);
        }
    }
};
