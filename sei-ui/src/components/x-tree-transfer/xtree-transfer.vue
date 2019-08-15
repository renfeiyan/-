<template>
    <!--   参见:https://github.com/hql7/tree-transfer -->
    <tree-transfer :title="title" :from_data='pFromData' :to_data='pToData' :defaultProps="defaultProps" :node_key="nodeKey" :pid="pid"
                   :mode='mode' :button_text="buttonText" :width="width" :height="height" :filter="filter" :openAll="openAll" :renderContent="renderContent" :transferOpenNode="transferOpenNode" :defaultCheckedKeys="defaultCheckedKeys" :placeholder="placeholder" :defaultTransfer="defaultTransfer" :arrayToTree="arrayToTree"
                   @addBtn='addBtn' @removeBtn='removeBtn' @left-check-change="leftCheckChange" @right-check-change="rightCheckChange"/>
</template>

<script>
    import treeTransfer from 'el-tree-transfer';
    import dataSource from '../support/data-source';
    import dbUtil from '../../utils/dbUtil';
    export default {
        components: {treeTransfer},
        mixins: [dataSource],
        props: {
            // dataSource:{type: Object, default(){return {}}},   /* 数据源配置 */
            // loadData:{type: Boolean, default: true},  /* 是否加载后就立即查询 */

            // 穿梭按钮名字
            buttonText: Array,
            width: {type: String, default: '100%'},
            height: {type: String, default: '320px'},
            title: {type: Array, default: () => ['源列表', '目标列表']},
            fromData: {type: Array, default: () => []},
            toData: {type: Array, default: () => []},
            // el-tree 配置项
            defaultProps: {type: Object, default: () => {return {label: 'label', children: 'children'};}},
            // el-tree node-key 必须唯一
            nodeKey: {type: String, default: 'id'},
            // 自定义 pid参数名
            pid: {type: String, default: 'pid'},
            // 是否启用筛选
            filter: {type: Boolean, default: false},
            // 是否展开所有节点
            openAll: {type: Boolean, default: false},
            // 自定义树节点
            renderContent: Function,
            // 穿梭框模式
            mode: {type: String, default: 'transfer'},
            // 穿梭后是否展开节点
            transferOpenNode: {type: Boolean, default: true},
            // 源数据 默认选中节点
            defaultCheckedKeys: {type: Array, default: () => []},
            // 筛选placeholder
            placeholder: {type: String, default: '输入关键字进行过滤'},
            // 默认穿梭一次默认选中数据
            defaultTransfer: {type: Boolean, default: false},
            // 是否开启arrayToTree
            arrayToTree: {type: Boolean, default: false}
        },
        data() {
            return {
                pFromData: this.fromData,
                pToData: this.toData
            }
        },
        mounted() {
            this.initLoadData && this.handelQuery();
        },
        methods: {
            handelQuery() {
                dbUtil.doQueryAction(true, this.dataSource, null, null, (res) => {
                    if (res && res.code == 1) {
                        this.pFromData = res.data.rows;
                        this.$emit('afterQuery', res);
                    }
                });
            },
            addBtn(fromData, toData, obj) {
                this.$emit('addBtn', fromData, toData, obj);
            },
            removeBtn(fromData, toData, obj) {
                this.$emit('removeBtn', fromData, toData, obj);
            },
            leftCheckChange(nodeObj, treeObj) {
                this.$emit('left-check-change', nodeObj, treeObj);
            },
            rightCheckChange(nodeObj, treeObj) {
                this.$emit('right-check-change', nodeObj, treeObj);
            }
        }
    };
</script>

