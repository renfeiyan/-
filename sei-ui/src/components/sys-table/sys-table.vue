<!-- 表管理 -->
<template>
    <x-splitter :init="50">
        <template slot="1">
            <x-table-edit ref="table" title="表列表" :data-source="{head:{module:'sys_table'}, option:{privilege:true,keyField:true,fields:'sysid',initRow:{sysid:$project.sysid}}}">
                <x-query slot="query">
                    <x-query-item>
                        <x-select prop="sysid" label="所属系统：" :data-source="{head:{module:'sys_system'},option:{dic:'sys_system'},data:{option:{id:'sysid',label:'name'}}}" placeholder="请选择所属系统"/>
                    </x-query-item>
                    <x-query-item prop="name" opt="like" label="名称："/>
                </x-query>
                <x-table-column prop="tablename" label="表名" v-rules="[{type:'required'}]" :maxlength=32 width="140"/>
                <x-table-column prop="title" label="标题" v-rules="[{type:'required'}]" :maxlength=20 width="180"/>
                <x-table-column prop="istree" label="树型结构" align="center" :edit="false" width="80">
                    <template slot-scope="scope" slot="show">
                        <x-status v-model="scope.row.istree"/>
                    </template>
                </x-table-column>
                <x-table-column prop="status" label="是否同步" align="center" :edit="false" width="80">
                    <template slot-scope="scope" slot="show">
                        <x-status v-model="scope.row.status"/>
                    </template>
                </x-table-column>
                <x-table-column prop="sysid" label="系统" width="150">
                    <template slot-scope="scope" slot="show">
                        {{scope.row.sysid| dic('sys_system')}}
                    </template>
                    <template slot-scope="scope" slot="edit">
                        <x-select v-model="scope.row.sysid" v-rules="[{type:'required'}]" :data-source="{head:{module:'sys_system'},option:{dic:'sys_system'},data:{option:{id:'sysid',label:'name'}}}" placeholder="请选择所属系统"/>
                    </template>
                </x-table-column>
                <x-table-column prop="memo" label="备注" :maxlength=100 />
            </x-table-edit>
        </template>
        <template slot="2">
            <x-table-edit title="字段列表" :data-source="{head:{module:'sys_table',table:'sys_table_fields'},
            dependent: {target:()=>$refs.table,filter:(row)=>[{tablename: row.tablename}],call:(datasource,row)=> datasource.option.initRow = {tablename: row.tablename}},
            option:{privilege:true,keyField:true}}" style="padding-left: 10px">
                <x-query slot="query">
                    <x-query-item prop="uid" opt="like" label="编号"/>
                    <x-query-item prop="name" opt="like" label="姓名"/>
                </x-query>
                <x-table-column prop="issync" label="同步" :edit="false" width="80">
                    <x-status slot-scope="scope" slot="show" v-model="scope.row.issync"/>
                </x-table-column>
                <x-table-column prop="field" label="字段名" disabled width="100"/>
                <x-table-column prop="title" label="标题" width="100"/>
                <x-table-column prop="type" label="类型" width="100"/>
                <x-table-column prop="size" label="长度" width="100"/>
                <x-table-column prop="autoincrement" label="自增" width="100">
                    <x-status slot-scope="scope" slot="show" v-model="scope.row.autoincrement"/>
                </x-table-column>
                <x-table-column prop="iskey" label="主键" width="100">
                    <x-status slot-scope="scope" slot="show" v-model="scope.row.iskey"/>
                </x-table-column>
                <x-table-column prop="nullable" label="空" width="100">
                    <x-status slot-scope="scope" slot="show" v-model="scope.row.nullable"/>
                </x-table-column>
                <x-table-column prop="gigits" align="center" label="小数位" width="80"/>
                <x-table-column prop="defaultval" label="缺省值" width="100"/>
                <x-table-column prop="memo" label="备注" />
            </x-table-edit>
        </template>
    </x-splitter>
</template>

<script>
    import XSplitter from '../x-splitter';
    import {XTableEdit, XTableColumn} from '../x-table-edit';
    import {XQuery, XQueryItem} from '../x-query';
    import XSelect from '../x-select';
    import XStatus from '../x-status';
    export default {
        name: 'SysTable',
        components: {XSplitter, XTableEdit, XTableColumn, XQuery, XQueryItem, XSelect, XStatus}
    };
</script>
