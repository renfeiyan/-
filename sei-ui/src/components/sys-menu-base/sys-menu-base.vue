<!-- 菜单模板管理 -->
<template>
    <x-table-edit row-key="muid" :singleSelect="false" :show-pagination="false" :data-source="{head:{module:'sys_menu_base'},option:{privilege:true,keyField:true,fields:'sysid',initRow:{sysid:$project.sysid}},query:{order:'_pid asc,sort asc'},data:{tree:2,option:{pid:'_pid',id:'muid',label:'name'}}}"
        :dic="[{head:{module:'sys_module'},option:{dic:'sys_module'},query:{order:'mid asc'},data:{option:{id:'mid',label:'name'},addData:[{mid:'0',name:'无'}]}}]">
        <x-query slot="query">
            <x-query-item>
                <x-select prop="sysid" label="所属系统：" :data-source="{head:{module:'sys_system'},option:{dic:'sys_system'},data:{option:{id:'sysid',label:'name'}}}" placeholder="请选择所属系统"/>
            </x-query-item>
            <x-query-item prop="name" opt="like" label="菜单名称："/>
        </x-query>
        <x-table-column prop="name" label="菜单名称" :verify="{length: [1,20]}" width="150"/>
        <x-table-column prop="muid" label="菜单编号" :verify="{length: [1,32]}" width="150"/>
        <x-table-column prop="sysid" label="所属系统" width="150">
            <template slot-scope="scope" slot="show">
                {{scope.row.sysid | dic('sys_system')}}
            </template>
        </x-table-column>
        <x-table-column prop="mid" label="所属模块" width="100">
            <template slot-scope="scope" slot="show">
                {{scope.row.mid | dic('sys_module')}}
            </template>
        </x-table-column>
        <x-table-column prop="_pid" label="上级菜单" width="100">
            <template slot-scope="scope" slot="show">
                {{scope.row._pid | dic_tree('sys_menu_base')}}
            </template>
        </x-table-column>
        <x-table-column prop="path" label="菜单路径" width="230"/>
        <x-table-column prop="component" label="菜单页面"/>
        <x-table-column prop="icon" label="图标" width="100">
            <template slot-scope="scope" slot="show">
                <i :class="scope.row.icon"/>
            </template>
        </x-table-column>
        <x-table-column prop="sort" label="排序" width="100"/>

        <x-dialog-edit slot="dialog" slot-scope="scope" title="菜单设置" width="800px">
            <el-form label-position="right" label-width="90px" inline cols="2">
                <x-form-item label="所属系统:">
                    <x-select v-model="scope.row.sysid" :excludeData="scope.row.sysid" :disabled="scope.action" :data-source="{head:{module:'sys_system'},option:{dic:'sys_system'},data:{option:{id:'sysid',label:'name'}}}" dialog-width="300px"/>
                </x-form-item>
                <br/>
                <x-form-item label="菜单编号">
                    <x-input v-model="scope.row.muid" v-rules="[{type:'required'}]" :maxlength=32 :disabled="scope.action"/>
                </x-form-item>
                <x-form-item label="菜单名称">
                    <x-input v-model="scope.row.name" v-rules="[{type:'required'}]" :maxlength=20 :disabled="scope.action"/>
                </x-form-item>
                <x-form-item label="所属模块">
                    <x-select v-model="scope.row.mid" v-rules="[{type:'required'}]" :data-source="{head:{module:'sys_module'},query:{order:'mid asc'},option:{dic:'sys_module'},data:{option:{id:'mid',label:'name'},addData:[{mid:'0',name:'无'}]}}" clearable placeholder="请选择所属模块"/>
                </x-form-item>
                <x-form-item label="上级菜单">
                    <x-select v-model="scope.row._pid" is-tree v-rules="[{type:'required'}]" :data-source="{head:{module:'sys_menu_base'},query:{order:'_pid asc,sort asc'},option:{dic:'sys_menu_base'},data:{tree:2,option:{pid:'_pid',id:'muid',label:'name'},addData:[{_pid:'0',muid:'0',name:'无'}]}}" dialog-width="300px"/>
                </x-form-item>
                <x-form-item label="菜单路径">
                    <x-input v-model="scope.row.path" v-rules="[{type:'required'}]" :maxlength=200 :disabled="scope.action"/>
                </x-form-item>
                <x-form-item label="菜单页面">
                    <x-input v-model="scope.row.component" v-rules="[{type:'required'}]" :maxlength=200 :disabled="scope.action"/>
                </x-form-item>
                <x-form-item label="菜单图标">
                    <x-select-icon v-model="scope.row.icon" dialog-width="500"/>
                </x-form-item>
                <x-form-item label="排序">
                    <el-input-number v-model="scope.row.sort" style="width:110px"/>
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
    import XSelectIcon from '../x-select-icon';
    export default {
        name: 'SysMenuBase',
        components: {XTableEdit, XTableColumn, XQuery, XQueryItem, XSelect, XSelectIcon, XDialogEdit, XFormItem, XInput}
    }
</script>
