<!-- 导入配置管理 -->
<template>
    <x-splitter :init="60">
        <template slot="1">
            <x-table-edit ref="table" title="模板列表" :data-source="{head:{module:'sys_import'}, option:{privilege:true,keyField:true,fields:'sysid',initRow:{sysid:$project.sysid}}}">
                <x-query slot="query">
                    <x-query-item>
                        <x-select prop="sysid" label="所属系统：" :data-source="{head:{module:'sys_system'},option:{dic:'sys_system'},data:{option:{id:'sysid',label:'name'}}}" placeholder="请选择所属系统"/>
                    </x-query-item>
                    <x-query-item prop="name" opt="like" label="名称："/>
                </x-query>
                <x-table-column prop="sysid" label="系统" width="120">
                    <template slot-scope="scope" slot="show">
                        {{scope.row.sysid | dic('sys_system')}}
                    </template>
                    <template slot-scope="scope" slot="edit">
                        <x-select v-model="scope.row.sysid" v-rules="[{type:'required'}]" :data-source="{head:{module:'sys_system'},option:{dic:'sys_system'},data:{option:{id:'sysid',label:'name'}}}" placeholder="请选择所属系统"/>
                    </template>
                </x-table-column>
                <x-table-column prop="iid" label="编号" v-rules="[{type:'required'}]" :maxlength=32 width="100"/>
                <x-table-column prop="name" label="名称" v-rules="[{type:'required'}]" :maxlength=32 width="120"/>
                <x-table-column prop="tablename" label="目标表" v-rules="[{type:'required'}]" :maxlength=32 width="120">
                    <template slot-scope="scope" slot="edit">
                        <x-select v-model="scope.row.tablename" :data-source="{head:{module:'sys_module'},query:{url:'/cache/getAllTablesName'},data:{map:0,option:{id:'id',name:'name'}}}" dialog-width="300px"/>
                    </template>
                </x-table-column>
                <x-table-column prop="sheet" label="sheet表" v-rules="[{type:'required'}]" :maxlength=20 width="80"/>
                <x-table-column prop="beginrow" label="开始行" v-rules="[{type:'required'}]" :maxlength=20 width="80">

                </x-table-column>
                <x-table-column prop="endrow" label="结束行" v-rules="[{type:'required'}]" :maxlength=20 width="80">

                </x-table-column>
                <x-table-column prop="memo" label="备注"/>
            </x-table-edit>
        </template>
        <template slot="2">
            <x-table-edit ref="table" title="配置列表" :data-source="{head:{module:'sys_import',table:'sys_import_fields'},
            dependent: {target:()=>$refs.table,filter:(row)=>[{iid: row.iid}],call:(datasource,row)=> datasource.option.initRow = {iid: row.iid}},
            option:{privilege:true,keyField:true}}" style="padding-left: 10px">
                <x-query slot="query">
                    <x-query-item prop="field" opt="like" label="字段" width="150"/>
                    <x-query-item prop="col" opt="like" label="列" width="150"/>
                </x-query>
                <x-table-column prop="field" label="字段" width="100">
                    <x-select slot-scope="scope" slot="edit" v-model="scope.row.field" :data-source="{head: {module: $refs.table.getCurrSelection().mid},
                         query: {url: '/cache/getTableFieldName'}, data: {map: 0, option: {id: 'id', label: 'name'}}}" placeholder="请选择字段"></x-select>
                </x-table-column>
                <x-table-column prop="col" label="列" width="100"/>
                <x-table-column prop="ext" label="扩展公式" width="100"/>
                <x-table-column prop="memo" label="备注"/>
            </x-table-edit>
        </template>
    </x-splitter>
</template>

<script>
    import XSplitter from '../x-splitter';
    import {XTableEdit, XTableColumn} from '../x-table-edit';
    import {XQuery, XQueryItem} from '../x-query';
    import XSelect from '../x-select';
    export default {
        name: 'sys_import',
        components: {XSplitter, XTableEdit, XTableColumn, XQuery, XQueryItem, XSelect}
    }
</script>
