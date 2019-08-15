<!-- 角色管理 -->
<template>
    <x-splitter :init="50">
        <template slot="1">
            <x-table-edit ref="role" title="角色列表" :data-source="{head:{module:'sys_role'}, option:{dic:'sys_role',privilege:true,keyField:true,fields:'sysid',initRow:{sysid:$project.sysid}},data:{option:{id:'rid',label:'name'}}}">
                <x-query slot="query">
                    <x-query-item>
                        <x-select prop="sysid" label="所属系统：" :data-source="{head:{module:'sys_system'},option:{dic:'sys_system'},data:{option:{id:'sysid',label:'name'}}}" placeholder="请选择所属系统"/>
                    </x-query-item>
                    <x-query-item prop="name" opt="like" label="角色名称："/>
                </x-query>
                <x-table-column prop="sysid" label="系统" width="150">
                    <template slot-scope="scope" slot="show">
                        {{scope.row.sysid | dic('sys_system')}}
                    </template>
                    <template slot-scope="scope" slot="edit">
                        <x-select v-model="scope.row.sysid" v-rules="[{type:'required'}]" :data-source="{head:{module:'sys_system'},option:{dic:'sys_system'},data:{option:{id:'sysid',label:'name'}}}" placeholder="请选择所属系统"/>
                    </template>
                </x-table-column>
                <x-table-column prop="rid" label="角色编号" v-rules="[{type:'required'}]" :maxlength=32 width="100"/>
                <x-table-column prop="name" label="角色名称" v-rules="[{type:'required'}]" :maxlength=20 width="120"/>
                <x-table-column prop="memo" label="备注" :maxlength=30 />
            </x-table-edit>
        </template>
        <template slot="2">
            <x-table-edit ref="table" title="用户列表" :data-source="{head:{module:'sys_user'},
                data:{rowEvn: (v)=>{v.rid != null && (v.rid = v.rid.split(',')); v.rid != null && (v.rid = v.rid.split(','));}},
                dependent: {target:()=>$refs.role,filter:(row)=>[{'@FIND_IN_SET':[`'${row.rid}'`,'rid']}],call:(datasource,row)=> datasource.option.initRow = {rid: row.rid}}}" style="padding-left: 10px">
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
                <x-table-column prop="oid" label="角色">
                    <template slot-scope="scope" slot="show">
                        {{scope.row.oid | dic('sys_org')}}
                    </template>
                    <template slot-scope="scope" slot="edit">
                        <x-select show-checkbox is-tree multiple dialogHeight="400" v-model="scope.row.rid" v-rules="[{type:'required'}]" :disabled="scope.action" :data-source="{head:{module:'sys_org'},option:{dic:'sys_org'},data:{tree:2,option:{pid:'_pid',id:'oid',label:'name'}}}" placeholder="请选择角色"/>
                    </template>
                </x-table-column>
            </x-table-edit>
        </template>
    </x-splitter>
</template>

<script>
    import XSplitter from '../x-splitter';
    import {XTableEdit, XTableColumn} from '../x-table-edit';
    import {XQuery, XQueryItem} from '../x-query';
    import XSelect from '../x-select';
    import XSelectTable from '../x-select-table';
    export default {
        name: 'SysRole',
        components: {XSplitter, XTableEdit, XTableColumn, XQuery, XQueryItem, XSelect, XSelectTable}
    }
</script>
