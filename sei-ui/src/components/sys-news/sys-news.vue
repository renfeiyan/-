<template>
    <x-table-edit :data-source="{head:{module:'sys_news'},option:{privilege:true,keyField:true,attFile:['content'],initRow:row=>{row.nid=getUUID();row.sysid=$project.sysid}}}"
                  :dic="[{head:{module:'sys_dic'},option:{dic:'sys_dic_newsType'},data:{option:{id:'code',label:'name'}},query:{filter:[{type:'newsType'},{_pid:{'!=':'0'}}]}}]">
        <x-query slot="query">
            <x-query-item prop="title" opt="like" label="标题：" width="150"/>
        </x-query>
        <x-table-column prop="status" label="状态" width="80"/>
        <x-table-column prop="type" label="类型" width="80">
            <template slot-scope="scope" slot="show">
                {{scope.row.type | dic('sys_dic_newsType')}}
            </template>
        </x-table-column>
        <x-table-column prop="title" label="标题"/>
        <x-table-column prop="_uidname" label="创建者" width="80"/>
        <x-table-column prop="_oidname" label="创建者部门" width="150"/>
        <x-table-column prop="_time" label="创建时间" width="200"/>

        <x-dialog-edit slot="dialog" slot-scope="scope" request width="1400px" max-height="720px">
            <el-form label-position="right" label-width="100px" inline cols="4">
                <x-form-item v-if="!$project.sysid" label="所属系统:">
                    <x-select v-model="scope.row.sysid" :excludeData="scope.row.sysid" :disabled="scope.action" :data-source="{head:{module:'sys_system'},option:{dic:'sys_system'},data:{option:{id:'sysid',label:'name'}}}" dialog-width="300px"/>
                </x-form-item>
                <x-form-item label="类型:">
                    <x-select v-model="scope.row.type" v-rules="[{type:'required'}]" :disabled="scope.action" :data-source="{head:{module:'sys_dic'},option:{dic:'sys_dic_newsType'},data:{option:{id:'code',label:'name'}},query:{filter:[{type:'newsType'},{_pid:{'!=':'0'}}]}}" placeholder="请选择类型"/>
                </x-form-item>
                <x-form-item label="创建者:">
                    <x-input v-model="scope.row._uidname" :disabled="true"/>
                </x-form-item>
                <x-form-item label="创建者部门:">
                    <x-input v-model="scope.row._oidname" :disabled="true"/>
                </x-form-item>
                <x-form-item label="创建时间:">
                    <x-input v-model="scope.row._time" :disabled="true"/>
                </x-form-item>
                <x-form-item label="标题:" cols="4">
                    <x-input v-model="scope.row.title" v-rules="[{type: 'required'}]" :maxlength=500 :disabled="scope.action"/>
                </x-form-item>
                <x-form-item label="内容:" cols="4">
                    <x-quill style="height: 400px" :attFile="{module:'sys_news',key:scope.row.nid,action:scope.actionType}" v-model="scope.row.content" v-rules="[{type: 'required'}]" :disabled="scope.action"/>
                </x-form-item>
            </el-form>
        </x-dialog-edit>
    </x-table-edit>
</template>

<script>
    import {XTableEdit, XTableColumn} from '../x-table-edit';
    import {XQuery, XQueryItem} from '../x-query';
    import XDialogEdit from '../x-dialog-edit';
    import XInput from '../x-input';
    import XFormItem from '../x-form-item';
    import XSelect from '../x-select';
    import XQuill from '../x-quill';
    import tools from '../../utils/tools';
    export default {
        name: 'SysNews',
        components: {XTableEdit, XTableColumn, XQuery, XFormItem, XQueryItem, XDialogEdit, XSelect, XInput, XQuill},
        data() {
            return {row: {}}
        },
        methods: {
            getUUID(){
                return tools.getUUID();
            }
        }
    }
</script>
