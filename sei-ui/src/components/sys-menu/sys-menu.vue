<!-- 菜单管理 -->
<template>
    <div style="height:100%;display:flex;flex-direction:column">
        <x-query :query="query" >
            <x-query-item>
                <x-select prop="sysid" label="所属系统：" :data-source="{head:{module:'sys_system'},option:{dic:'sys_system'},data:{option:{id:'sysid',label:'name'}}}" placeholder="请选择所属系统"/>
            </x-query-item>
        </x-query>
        <x-splitter :init="45" style="flex:1">
            <template slot="1">
                <x-table-edit ref="table" title="角色" border style="padding-right: 10px" @row-click="rowClick" :data-source="{head:{module:'sys_role'},option:{load:false,keyField:true},query:{fields:'rid,name'}}" :edit="false">
                    <x-table-column prop="rid" label="编号" width="100"/>
                    <x-table-column prop="name" label="名称"/>
                </x-table-edit>
            </template>
            <template slot="2">
                <x-tree ref="tree" show-checkbox default-expand-all :filter="false" :dataSource="{head:{module:'sys_menu_base'},option:{load:false,privilege:'edit'},data:{tree:2,option:{pid:'_pid',id:'muid',label:'name'}}}" node-key="muid" style="margin-left: 10px">
                    <el-button slot="edit" @click="handelSave" type="warning" icon="el-icon-success" plain size="mini">保存</el-button>
                </x-tree>
            </template>
        </x-splitter>
    </div>
</template>

<script>
    import dbUtil from '../../utils/dbUtil';
    import http from '../../utils/http';
    import {XTableEdit, XTableColumn} from '../x-table-edit';
    import {XQuery, XQueryItem} from '../x-query';
    import XSelect from '../x-select';
    import XSplitter from '../x-splitter';
    import XTree from '../x-tree';
    import {Message} from 'element-ui';
    export default {
        name: 'SysMenu',
        components: {XSplitter, XTableEdit, XTableColumn, XQuery, XQueryItem, XSelect, XTree},
        data() {
            return {rid: null}
        },
        methods: {
            query(filter) {
                if (!filter) {
                    Message({type: 'error', message: '请选择查询条件后再查询。'});
                    return
                }
                this.$refs.table.handelQueryFilter(filter);
                this.$refs.tree.handelQueryFilter(filter);
            },
            rowClick(row) {
                this.rid = row.rid;
                dbUtil.doQueryAction(true, {head: {module: 'sys_menu'}, query: {fields: 'muid', filter: [{type: 0}, {objid: row.rid}]}}, null, null, (res) => {
                    if (res.code == 1) {
                        // this.oldSelect = [];
                        this.$refs.tree.getInstance().setCheckedKeys([]);
                        res.data.rows.forEach(v => this.$refs.tree.getInstance().setChecked(v.muid, true))
                    } else {
                        this.$refs.tree.getInstance().setCheckedKeys([]);
                    }
                });
            },
            handelSave() {
                if (this.rid != null) {
                    let keys = this.$refs.tree.getInstance().getCheckedKeys(false);
                    keys = keys.concat(this.$refs.tree.getInstance().getHalfCheckedKeys());
                    if (keys.length>0) {
                        let save = {type: 0, objid: this.rid, keys: keys};
                        http.post('/user/setMenu', save, false, true);
                    }
                }
            }
        }
    };
</script>
