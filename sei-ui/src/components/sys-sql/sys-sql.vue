<!-- data-sql管理 -->
<template>
    <x-table-edit :showOverflowTooltip="false" :data-source="{head:{module:'sys_sql'},option:{privilege:true,keyField:true,fields:'sysid',initRow:{sysid:$project.sysid}}}">
        <x-query slot="query">
            <x-query-item>
                <x-select prop="sysid" label="所属系统：" :data-source="{head:{module:'sys_system'},option:{dic:'sys_system'},data:{option:{id:'sysid',label:'name'}}}" placeholder="请选择所属系统"/>
            </x-query-item>
            <x-query-item>
                <x-select prop="mid" label="所属模块：" :data-source="{head:{module:'sys_module'},option:{dic:'sys_module'},query:{order:'mid asc'},data:{option:{id:'mid',label:'name'}}}" placeholder="请选择所属模块"></x-select>
            </x-query-item>
            <x-query-item prop="sid" opt="like" label="数据源编号："/>
            <x-query-item prop="name" opt="like" label="数据源名称："/>
        </x-query>
        <x-table-column prop="sysid" label="所属系统" width="200">
            <template slot-scope="scope" slot="show">
                {{scope.row.sysid | dic('sys_system')}}
            </template>
            <template slot-scope="scope" slot="edit">
                <x-select v-model="scope.row.sysid" v-rules="[{type:'required'}]" :data-source="{head:{module:'sys_system'},option:{dic:'sys_system'},data:{option:{id:'sysid',label:'name'}}}" placeholder="请选择"/>
            </template>
        </x-table-column>
        <x-table-column prop="mid" label="所属模块" width="200">
            <template slot-scope="scope" slot="show">
                {{scope.row.mid | dic('sys_module')}}
            </template>
            <template slot-scope="scope" slot="edit">
                <x-select v-model="scope.row.mid" v-rules="[{type:'required'}]" :data-source="{head:{module:'sys_module'},query:{order:'mid asc'},option:{dic:'sys_module'},data:{option:{id:'mid',label:'name'}}}" placeholder="请选择所属模块"/>
            </template>
        </x-table-column>
        <x-table-column prop="sid" label="数据源编号" v-rules="[{type:'required'}]" :maxlength=32 width="200px"/>
        <x-table-column prop="name" label="数据源名称" v-rules="[{type:'required'}]" :maxlength=30 width="200px"/>
        <x-table-column prop="sqlinfo" label="sql语句" :showOverflowTooltip="false">
            <template slot-scope="scope" slot="edit">
                <x-input v-model="scope.row.sqlinfo" v-rules="[{type:'required'}]" clearable placeholder="请输入"
                         :dialog="{title:'SQL编辑器',width:'70%',height:'600px'}"
                         :onClickDefine="()=>$refs.xCodeSql.getCode()"
                >
                    <el-button slot="footer" type="warning" icon="el-icon-bicycle" @click="()=>$refs.xCodeSql.run()">测 试</el-button>
                    <x-code-sql ref="xCodeSql" slot="dialogContent"/>
                </x-input>
            </template>
        </x-table-column>
        <x-table-column prop="memo" label="备注" :verify="{length: [0,100]}" width="150px"/>
    </x-table-edit>
</template>

<script>
    import {XTableEdit, XTableColumn} from '../x-table-edit';
    import {XQuery, XQueryItem} from '../x-query';
    import XInput from '../x-input';
    import XSelect from '../x-select';
    import XCodeSql from '../x-code-sql';
    export default {
        name: 'SysSql',
        components: {XTableEdit, XTableColumn, XQuery, XQueryItem, XSelect, XInput, XCodeSql},
        data() {
           return {
               query: {querySymbol: {}}
           }
        }
    }
</script>
