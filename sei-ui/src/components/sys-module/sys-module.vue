<!-- 模块管理 -->
<template>
    <div style="height:100%;display:flex;flex-direction:column">
        <x-query slot="query" :query="(filter) => $refs.table.handelQueryFilter(filter)">
            <x-query-item>
                <x-select prop="sysid" label="所属系统：" :data-source="{head:{module:'sys_system'},option:{dic:'sys_system'},data:{option:{id:'sysid',label:'name'}}}" placeholder="请选择所属系统"/>
            </x-query-item>
            <x-query-item prop="mid" opt="like" label="模块编号："/>
            <x-query-item prop="name" opt="like" label="模块名称："/>
            <x-query-item prop="maintable" opt="like" label="所属表："/>
        </x-query>
        <x-splitter :init="60" style="flex:1">
            <template slot="1">
                <x-table-edit ref="table" title="模块列表" style="padding-right: 10px" :data-source="{head:{module:'sys_module'},option:{privilege:true,keyField:true,fields:'sysid',initRow:{sysid:$project.sysid}},query:{order:'mid asc'},data:{tree:2,option:{pid:'_pid',id:'mid'}},
                data:{rowEvn:v=>v.subtable != null && (v.subtable = v.subtable.split(','))},
                save:{rowEvn:v=>v.subtable != null && (v.subtable = v.subtable.join(','))}
                }">
                    <x-table-column prop="name" label="模块名称" width="140"/>
                    <x-table-column prop="mid" label="模块标识" width="150"/>
                    <x-table-column prop="maintable" label="主表名" width="150">
                        <template slot-scope="scope" slot="edit">
                            <x-select v-model="scope.row.maintable" :data-source="{head:{module:'sys_module'},option:{dic:'sys_tableName'},query:{url:'/cache/getAllTablesName'},data:{map:0,option:{id:'id',label:'name'}}}" dialog-width="300px"/>
                        </template>
                    </x-table-column>
                    <x-table-column prop="subtable" label="子表名" width="150">
                        <template slot-scope="scope" slot="edit">
                            <x-select v-model="scope.row.subtable" multiple :data-source="{head:{module:'sys_module'},option:{dic:'sys_tableName',dataConver:{subtable:'array->string'}},query:{url:'/cache/getAllTablesName'},data:{map:0,option:{id:'id',label:'name'}}}" dialog-width="300px"/>
                        </template>
                    </x-table-column>
                    <x-table-column prop="sysid" label="所属系统">
                        <template slot-scope="scope" slot="show">
                            {{scope.row.sysid | dic('sys_system')}}
                        </template>
                        <template slot-scope="scope" slot="edit">
                            <x-select v-model="scope.row.sysid" v-rules="[{type:'required'}]" :data-source="{head:{module:'sys_system'},option:{dic:'sys_system'},data:{option:{id:'sysid',label:'name'}}}" placeholder="请选择"/>
                        </template>
                    </x-table-column>
<!--                    <x-table-column prop="_pid" label="上级模块">-->
<!--                        <template slot-scope="scope" slot="show">-->
<!--                            {{scope.row._pidname}}-->
<!--                        </template>-->
<!--                        <template slot-scope="scope" slot="edit">-->
<!--                            <x-select v-model="scope.row._pid" :data-source="{head:{module:'sys_module'},query:{order:'mid asc'},data:{tree:2,option:{pid:'_pid',id:'mid',label:'name'},addData:{_pid:0,name:'无'}}}" dialog-width="300px"/>-->
<!--                        </template>-->
<!--                    </x-table-column>-->
                </x-table-edit>
            </template>
            <template slot="2">
                <x-table-edit ref="module_action" title="模块所属功能按钮列表" :data-source="{head:{module:'sys_module',table:'sys_module_action'},
                dependent: {target:()=>$refs.table,filter:(row)=>[{mid:row.mid}],call:(datasource,row)=> datasource.option.initRow = {mid: row.mid}},
                option:{privilege: true,keyField: true},query:{order:'sort asc'}}" style="padding-left:10px">
                    <x-table-column prop="mid" v-rules="[{type:'required'}]" :maxlength=16 :edit="false" :hidden="true" label="模块编号" width="100"/>
                    <x-table-column prop="action" v-rules="[{type:'required'}]" :maxlength=16 label="按钮标识" width="100"/>
                    <x-table-column prop="name" v-rules="[{type:'required'}]" :maxlength=20 label="按钮名称" width="120">
                        <template slot-scope="scope" slot="edit">
                            <x-select v-model="scope.row.action" :update="false" :xext.sync="scope.row.name" :xext-option="{xext:'label'}" allow-create placeholder="请选择">
                                <el-option :label="'新增'" :value="'add'"/>
                                <el-option :label="'修改'" :value="'edit'"/>
                                <el-option :label="'删除'" :value="'del'"/>
                                <el-option :label="'查看'" :value="'see'"/>
                            </x-select>
                        </template>
                    </x-table-column>
                    <x-table-column prop="sort" label="排序" width="120">
                        <el-input-number slot-scope="scope" style="width:100px" slot="edit" v-model="scope.row.sort" :min="0" :max="32760"/>
                    </x-table-column>
                    <x-table-column prop="memo" :maxlength=100 label="备注"/>
                </x-table-edit>
            </template>
        </x-splitter>
    </div>
</template>

<script>
    import {XTableEdit, XTableColumn} from '../x-table-edit';
    import {XQuery, XQueryItem} from '../x-query';
    import XSplitter from '../x-splitter';
    import XSelect from '../x-select';
    export default {
        name: 'SysModule',
        components: {XSplitter, XTableEdit, XTableColumn, XQuery, XQueryItem, XSelect}
    };
</script>
