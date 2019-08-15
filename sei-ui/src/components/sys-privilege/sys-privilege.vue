<!-- 权限管理 -->
<template>
    <div style="height:100%;display:flex;flex-direction:column">
        <x-query slot="query" :query="queryClick">
            <x-query-item :query="false">
                <x-select ref="sys" prop="sysid" label="所属系统：" :data-source="{head:{module:'sys_system'},option:{dic:'sys_system'},data:{option:{id:'sysid',label:'name'}}}" placeholder="请选择所属系统"></x-select>
            </x-query-item>
            <x-query-item>
                <x-select ref="rid" prop="rid" label="角色：" :data-source="{head:{module:'sys_role'},
                dependent: {target:()=>$refs.sys,filter:(row)=>[{sysid: row.sysid}]},
                option:{dic:'sys_role',fields:'rid,name'},data:{option:{id:'rid',label:'name'}}}" placeholder="请选择角色"></x-select>
            </x-query-item>
        </x-query>
        <x-splitter :init="55" style="flex:1">
            <template slot="1">
                <x-table-edit ref="module" title="功能权限列表" :data-source="{head:{module:'sys_privilege'},option:{privilege:true,keyField:true,load:false,fields:'pvid'},data:{option:{pid:'mid',id:'uuid',label:'midname'}}
                ,query:{
                    order:'sys_privilege.mid asc,sys_module_action.sort asc',
                    merge:
                        {
                            head:[{module:'sys_module',table:'sys_module'},{module:'sys_module',table:'sys_module_action'}],
                            on:{
                                join:'inner join sys_module on sys_privilege.mid = sys_module.mid INNER JOIN sys_module_action on sys_module.mid = sys_module_action.mid and sys_privilege.action = sys_module_action.action',
                                fields:'sys_privilege.mid as mid,sys_privilege.action as action,sys_module.name as midname,sys_module_action.name as actionname'
                            }
                        }
                }
                }" style="padding-left:10px;padding-right:10px">
                    <x-table-column prop="midname" label="模块名称" :query="false" :save="false" :add="true" :edit="false">
                        <x-select ref="modulemid" slot-scope="scope" slot="edit" v-model="scope.row.mid" v-rules="[{type:'required'}]" :data-source="{head:{module:'sys_module'},query:{order:'mid asc'},option:{dic:'sys_module'},data:{option:{id:'mid',label:'name'}}}" clearable placeholder="请选择模块"/>
                    </x-table-column>
                    <x-table-column prop="actionname" label="功能名称" :query="false" :edit="false" :add="true" width="150">
                        <x-select slot-scope="scope" slot="edit" v-model="scope.row.action" v-rules="[{type:'required'}]" :data-source="{head:{module:'sys_module',table:'sys_module_action'},query:{order:'sort asc'},data:{option:{id:'action',label:'name'}}
                        ,dependent: {target:()=>$refs.modulemid,filter:(row)=>[{mid:row.mid}]}}" clearable placeholder="请选择模块"/>
                    </x-table-column>
                    <x-table-column prop="isdo" label="启用" width="120">
                        <el-switch slot-scope="scope" slot="show" v-model="scope.row.isdo" disabled/>
                        <el-select slot-scope="scope" slot="edit" v-model="scope.row.isdo" v-rules="[{type:'required'}]" placeholder="请选择">
                            <el-option :key="true" label="启用" :value="true"/>
                            <el-option :key="false" label="禁用" :value="false"/>
                        </el-select>
                    </x-table-column>
                </x-table-edit>
            </template>
            <template slot="2">
                <x-table-edit style="padding-left: 10px" title="数据权限列表" :show-pagination="false" :data-source="{head:{module:'sys_privilege',table:'sys_privilege_fields'},
                dependent: {target:()=>$refs.module,filter:(row)=>[{pvid:row.pvid}],call:(datasource,row)=> datasource.option.initRow = {pvid: row.pvid}},
                option:{privilege:true,keyField:true}}">
                    <x-table-column prop="field" label="字段" width="100">
                        <x-select slot-scope="scope" slot="edit" v-model="scope.row.field" :data-source="{head: {module: $refs.module.getCurrSelection().mid},
                         query: {url: '/cache/getTableAllFieldsName'}, data: {map: 0, option: {id: 'id', label: 'name'}}}" placeholder="请选择字段"></x-select>
                    </x-table-column>
                    <x-table-column prop="opt" label="操作" width="100">
                        <el-select slot-scope="scope" slot="edit" v-model="scope.row.opt" placeholder="请选择">
                            <el-option :label="'='" :value="'='"/>
                            <el-option :label="'!='" :value="'!='"/>
                            <el-option :label="'>'" :value="'>'"/>
                            <el-option :label="'>='" :value="'>='"/>
                            <el-option :label="'<'" :value="'<'"/>
                            <el-option :label="'<='" :value="'<='"/>
                            <el-option :label="'like*'" :value="'like*'"/>
                            <el-option :label="'*like'" :value="'*like'"/>
                            <el-option :label="'*like*'" :value="'*like*'"/>
                        </el-select>
                    </x-table-column>
                    <x-table-column prop="val" label="值" width="120">
                        <el-select slot-scope="scope" slot="edit" v-model="scope.row.val" allow-create clearable filterable placeholder="请选择">
                            <el-option :label="'本人'" :value="'cur@uid'"/>
                            <el-option :label="'本部门'" :value="'cur@oid'"/>
                            <el-option :label="'本部门及下属部门'" :value="'cur@subOrgId'"/>
                        </el-select>
                    </x-table-column>
                    <x-table-column prop="memo" label="备注"/>
                </x-table-edit>
            </template>
        </x-splitter>
    </div>
</template>

<script>
    import XSplitter from '../x-splitter';
    import {XTableEdit, XTableColumn} from '../x-table-edit';
    import {XQuery, XQueryItem} from '../x-query';
    import XSelect from '../x-select';
    import {Message} from 'element-ui';
    export default {
        name: 'sys_privilege',
        components: {XSplitter, XTableEdit, XTableColumn, XQuery, XQueryItem, XSelect},
        methods: {
            queryClick(filter) {
                if (filter && filter.length > 0) {
                    this.$refs.module.dataSourceX.option.initRow = {sysid: this.$refs.sys.svalue, rid: this.$refs.rid.svalue};
                    return this.$refs.module.handelQueryFilter(filter)
                } else {
                    Message.error('请选择查询条件后再查询。');
                }
            }
        }
    };
</script>
