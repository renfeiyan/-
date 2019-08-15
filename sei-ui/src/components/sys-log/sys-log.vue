<!-- 日志管理 -->
<template>
    <x-table-edit multiSelect :singleSelect="false" :data-source="{head:{dbType:'mongodb',module:'sys_log'},option:{privilege:true, keyField:'_id', fields:'_id'},query:{order:'_id desc'}}"
    :dic="[{head:{module:'sys_module'},option:{dic:'sys_module'},query:{order:'mid asc'},data:{option:{id:'mid',label:'name'},addData:[{mid:'login',name:'登录'},{mid:'logout',name:'退出'}]}}
    ,{name:'sys_operation',data:{rows:operation,option:{id:'id',label:'name'}}}]">
        <x-query slot="query">
            <x-query-item prop="time" opt="between" label="时间：">
                <el-date-picker slot-scope="scope" v-model="scope.row.time" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" align="right"/>
            </x-query-item>
            <x-query-item prop="name" opt="like" label="姓名：" width="120"/>
            <x-query-item prop="action" opt="=" label="操作：">
                <el-select slot-scope="scope" v-model="scope.row.action" clearable placeholder="请选择" style="width:100px">
                    <el-option key="add" label="新增" value="add"/>
                    <el-option key="edit" label="修改" value="edit"/>
                    <el-option key="del" label="删除" value="del"/>
                    <el-option key="login" label="登录" value="login"/>
                    <el-option key="logout" label="退出" value="logout"/>
                </el-select>
            </x-query-item>
            <x-query-item prop="mid" opt="=" label="模块：">
                <x-select slot-scope="scope" v-model="scope.row.mid" :data-source="{head:{module:'sys_module'},option:{dic:'sys_module'},query:{order:'mid asc'},data:{option:{id:'mid',label:'name'},addData:[{mid:'login',name:'登录'},{mid:'logout',name:'退出'}]}}" style="width:150px" placeholder="请选择模块"/>
            </x-query-item>
            <x-query-item prop="table" opt="=" label="表：" width="120"/>
        </x-query>
        <x-table-column prop="time" label="时间" width="180"/>
        <x-table-column prop="uid" label="编号" width="100"/>
        <x-table-column prop="name" label="姓名" width="80"/>
        <x-table-column prop="ip" label="IP地址" width="100"/>
        <x-table-column prop="mid" label="模块" width="120">
            <template slot-scope="scope" slot="show">
                {{scope.row.mid | dic('sys_module')}}
            </template>
        </x-table-column>
        <x-table-column prop="table" label="表" width="120"/>
        <x-table-column prop="action" label="操作" width="60">
            <template slot-scope="scope" slot="show">
                {{scope.row.action | dic('sys_operation')}}
            </template>
        </x-table-column>
        <x-table-column prop="sqlinfo" label="内容"/>
        <x-table-column prop="sqlval" label="参数"/>
    </x-table-edit>
</template>

<script>
    import {XTableEdit, XTableColumn} from '../x-table-edit';
    import {XQuery, XQueryItem} from '../x-query';
    import XSelect from '../x-select';
    export default {
        name: 'SysLog',
        components: {XTableEdit, XTableColumn, XQuery, XQueryItem, XSelect},
        data() {
            return {
                operation: [{id: 'login', name: '登录'}, {id: 'logout', name: '退出'}, {id: 'add', name: '新增'}, {id: 'edit', name: '修改'}, {id: 'del', name: '删除'}]
            }
        }
    }
</script>
