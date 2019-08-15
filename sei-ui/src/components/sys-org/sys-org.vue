<!-- 组织机构管理 -->
<template>
    <div style="height:100%;">
        <x-query slot="query" :query="(filter) => $refs.tree.handelQueryFilter(filter)">
            <x-query-item>
                <x-select prop="sysid" label="所属系统" :data-source="{head:{module:'sys_system'},option:{dic:'sys_system'},data:{option:{id:'sysid',label:'name'}}}" placeholder="请选择所属系统"/>
            </x-query-item>
        </x-query>
        <x-splitter>
            <template slot="1">
                <x-tree ref="tree" title="机构列表" default-expand-all highlight-current :filter="false" node-key="oid" :dataSource="{head:{module:'sys_org'},option:{privilege:true,keyField:true,dic:'sys_org',initRow:{_pid:'0',sysid:$project.sysid}},data:{tree:2,option:{pid:'_pid',id:'oid',label:'name'}}}" style="margin-right:10px">
                    <x-dialog-edit slot="dialog" slot-scope="scope" request title="机构设置" width="500px">
                        <el-form label-position="right" label-width="120px" inline cols="1">
                            <x-form-item label="所属系统:">
                                <x-select v-model="scope.row.sysid" v-rules="[{type:'required'}]" :disabled="scope.action" :data-source="{head:{module:'sys_system'},option:{dic:'sys_system'},data:{option:{id:'sysid',label:'name'}}}" dialog-width="300px"/>
                            </x-form-item>
                            <x-form-item label="所属机构:">
                                <x-select v-model="scope.row._pid" :disabled="scope.action" is-tree :data-source="{head:{module:'sys_org'},option:{privilege:true,keyField:true,dic:'sys_org',initRow:{_pid:'0'}},data:{tree:2,option:{pid:'_pid',id:'oid',label:'name'}}}" dialog-width="300px"/>
                            </x-form-item>
                            <x-form-item label="机构编码:">
                                <x-input v-model="scope.row.oid" v-rules="[{type:'required'}]" :maxlength=32 :disabled="scope.action"/>
                            </x-form-item>
                            <x-form-item label="机构名称:">
                                <x-input v-model="scope.row.name" v-rules="[{type:'required'}]" :maxlength=100 :disabled="scope.action"/>
                            </x-form-item>
                            <x-form-item label="联系人:">
                                <x-input v-model="scope.row.linkman" :disabled="scope.action"/>
                            </x-form-item>
                            <x-form-item label="电话:">
                                <x-input v-model="scope.row.tel" :disabled="scope.action"/>
                            </x-form-item>
                            <x-form-item label="地址:">
                                <x-input v-model="scope.row.addr" :disabled="scope.action"/>
                            </x-form-item>
                            <x-form-item label="机构排序:" prop="sort">
                                <el-input-number v-model="scope.row.sort" :disabled="scope.action"/>
                            </x-form-item>
                        </el-form>
                    </x-dialog-edit>
                </x-tree>
            </template>
            <template slot="2">
                <x-table-edit ref="table" title="用户列表" :data-source="{head:{module:'sys_user'},
                data:{rowEvn: (v)=>{v.oid != null && (v.oid = v.oid.split(',')); v.rid != null && (v.rid = v.rid.split(','));}},
                dependent: {target:()=>$refs.tree,filter:(row)=>[{'@FIND_IN_SET':[`'${row.oid}'`,'oid']}],call:(datasource,row)=> datasource.option.initRow = {oid: row.oid}}}" style="padding-left: 10px">
                    <x-table-column prop="uid" label="用户编号" width="200" :disabled="true"/>
                    <x-table-column prop="name" label="姓名" width="200">
                        <template slot-scope="scope" slot="edit">
                            <x-select-table v-model="scope.row.uid" readonly v-rules="[{type:'required'}]" idField="uid" labelField="name" :xext.sync="scope.row.name" :xext-option="{xext:'name'}" :data-source="{head:{module:'sys_user'},option:{fields:'uid,name'}}" dialogWidth="700">
                                <x-query slot="query">
                                    <x-query-item prop="uid" label="用户编号"/>
                                    <x-query-item prop="name" opt="like" label="姓名"/>
                                </x-query>
                                <template>
                                    <x-table-column prop="uid" label="编号" width="100"/>
                                    <x-table-column prop="name" label="姓名"/>
                                </template>
                            </x-select-table>
                        </template>
                    </x-table-column>
                    <x-table-column prop="oid" label="机构">
                        <template slot-scope="scope" slot="show">
                            {{scope.row.oid | dic('sys_org')}}
                        </template>
                        <template slot-scope="scope" slot="edit">
                            <x-select show-checkbox is-tree multiple dialogHeight="400" v-model="scope.row.oid" v-rules="[{type:'required'}]" :disabled="scope.action" :data-source="{head:{module:'sys_org'},option:{dic:'sys_org'},data:{tree:2,option:{pid:'_pid',id:'oid',label:'name'}}}" placeholder="请选择机构"/>
                        </template>
                    </x-table-column>
                </x-table-edit>
            </template>
        </x-splitter>
    </div>
</template>

<script>
    import XSplitter from '../x-splitter';
    import {XTableEdit, XTableColumn} from '../x-table-edit';
    import {XQuery, XQueryItem} from '../x-query';
    import XDialogEdit from '../x-dialog-edit';
    import XInput from '../x-input';
    import XFormItem from '../x-form-item';
    import XSelect from '../x-select';
    import XTree from '../x-tree';
    import XSelectTable from '../x-select-table';
    export default {
        name: 'SysOrg',
        components: {XSplitter, XTableEdit, XTableColumn, XQuery, XQueryItem, XTree, XDialogEdit, XSelectTable, XFormItem, XInput, XSelect}
    }
</script>
