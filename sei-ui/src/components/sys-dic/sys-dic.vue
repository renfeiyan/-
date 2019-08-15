<!-- 字典管理 -->
<template>
    <div>
        <x-query slot="query" :query="(filter) => $refs.tree.handelQueryFilter(filter)">
            <x-query-item>
                <x-select prop="sysid" label="所属系统：" :data-source="{head:{module:'sys_system'},option:{dic:'sys_system'},data:{option:{id:'sysid',label:'name'}}}" placeholder="请选择所属系统"/>
            </x-query-item>
            <x-query-item >
                <x-select prop="type" label="分类：" :data-source="{head:{module:'sys_dic'},option:{dic:'sys_dic'},query:{fields:'code,name,type,sort',order:'type asc,sort asc',filter:{_pid:'0'}},data:{option:{id:'type',label:'name'}}}" placeholder="请选择分类"/>
            </x-query-item>
        </x-query>
        <x-tree ref="tree" default-expand-all highlight-current :filter="false" node-key="uuid" :dataSource="{head:{module:'sys_dic'},option:{privilege:true,keyField:true,dic:'sys_dic',initRow:{_pid:'0',sysid:$project.sysid}},query:{fields:'_pid,code,name,type,sort',order:'type asc,_pid asc,sort asc'},data:{tree:2,option:{pid:'_pid',id:'uuid',label:'name'}}}" style="margin-right:10px">
            <x-dialog-edit slot="dialog" slot-scope="scope" :beforeSave="()=>{if(scope.row._pid==='0' || scope.row._pid===0 || scope.row._pid==null)scope.row.type=scope.row.code;}" title="字典设置" width="500px" height="400px">
                <el-form label-position="right" label-width="120px" inline cols="1">
                    <x-form-item label="所属系统:">
                        <x-select v-model="scope.row.sysid" v-rules="[{type:'required'}]" :disabled="scope.action" :data-source="{head:{module:'sys_system'},option:{dic:'sys_system'},data:{option:{id:'sysid',label:'name'}}}" dialog-width="300px"/>
                    </x-form-item>
                    <x-form-item label="上级:">
                        <x-select v-model="scope.row._pid" is-tree :excludeData="scope.row._pid" :xext.sync="scope.row.type" :xext-option="{xext:'type'}" :disabled="scope.action" :data-source="{head:{module:'sys_dic'},option:{dic:'sys_dic',keyField:true},query:{fields:'_pid,code,name,type,sort',order:'type asc,_pid asc,sort asc'},data:{tree:2,option:{pid:'_pid',id:'uuid',label:'name'}}}" dialog-width="300px"/>
                    </x-form-item>
                    <x-form-item label="编码:" >
                        <x-input v-model="scope.row.code" v-rules="[{type:'required'}]" :maxlength=16 :disabled="scope.action"/>
                    </x-form-item>
                    <x-form-item label="名称:">
                        <x-input v-model="scope.row.name" v-rules="[{type:'required'}]" :maxlength=50 :disabled="scope.action"/>
                    </x-form-item>
                    <x-form-item label="排序:">
                        <el-input-number v-model="scope.row.sort" :disabled="scope.action"/>
                    </x-form-item>
                </el-form>
            </x-dialog-edit>
        </x-tree>
    </div>
</template>

<script>
    import XTree from '../x-tree';
    import {XQuery, XQueryItem} from '../x-query';
    import XDialogEdit from '../x-dialog-edit';
    import XInput from '../x-input';
    import XFormItem from '../x-form-item';
    import XSelect from '../x-select';
    export default {
        name: 'SysDic',
        components: {XTree, XDialogEdit, XInput, XFormItem, XQuery, XQueryItem, XSelect}
    };
</script>
<style>
    .toolbar{
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
    }
</style>
