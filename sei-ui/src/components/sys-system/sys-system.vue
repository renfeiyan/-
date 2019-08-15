<!-- 子系统管理-->
<template>
    <x-table-edit :data-source="{head:{module:'sys_system'},option:{export:false,privilege:true,keyField:true}}">
        <x-query slot="query">
            <x-query-item prop="sysid" opt="like" label="系统编号：" width="150"/>
            <x-query-item prop="name" opt="like" label="系统名称："/>
        </x-query>
        <x-table-column prop="sysid" label="系统编号" v-rules="[{type:'required'}]" :maxlength=6 width="150"/>
        <x-table-column prop="name" label="系统名称" v-rules="[{type:'required'}]" :maxlength=30 width="200"/>
        <x-table-column prop="memo" label="备注" :maxlength=100 />
    </x-table-edit>
</template>

<script>
    import {XTableEdit, XTableColumn} from '../x-table-edit';
    import {XQuery, XQueryItem} from '../x-query';
    export default {
        name: 'SysSystem',
        components: {XTableEdit, XTableColumn, XQuery, XQueryItem}
    }
</script>
