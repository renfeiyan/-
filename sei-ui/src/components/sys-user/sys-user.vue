<!-- 用户管理 -->
<template>
    <x-table-edit :data-source="{head:{module:'sys_user'},option:{load:true,privilege:true,keyField:true,fields:'sysid',initRow:{status:false,issuper:false,sysid:$project.sysid}},
    data:{rowEvn: (v)=>{v.oid != null && (v.oid = v.oid.split(',')); v.rid != null && (v.rid = v.rid.split(','));}},
    save:{rowEvn: (v)=>{v.oid != null && (v.oid = v.oid.join(',')); v.rid != null && (v.rid = v.rid.join(','));}}}">
        <x-query slot="query">
            <x-query-item>
                <x-select prop="sysid" label="所属系统：" :data-source="{head:{module:'sys_system'},option:{dic:'sys_system'},data:{option:{id:'sysid',label:'name'}}}" placeholder="请选择所属系统"/>
            </x-query-item>
            <x-query-item>
                <x-select prop="status" label="启用：" style="width:120px" placeholder="请选择">
                    <el-option :key="true" label="启用" :value="true"/>
                    <el-option :key="false" label="禁止" :value="false"/>
                </x-select>
            </x-query-item>
            <x-query-item>
                <x-select prop="utype" label="类型：" style="width:180px" :data-source="{head:{module:'sys_dic'},option:{dic:'sys_dic_userType'},data:{option:{id:'code',label:'name'}},query:{filter:[{type:'userType'},{_pid:{'!=':'0'}}]}}" placeholder="请选择类型" />
            </x-query-item>
            <x-query-item prop="uid" opt="like" label="编号：" width="150"/>
            <x-query-item prop="name" opt="like" label="姓名：" width="150"/>
        </x-query>
        <x-table-column prop="uid" label="编号" width="100"/>
        <x-table-column prop="name" label="姓名" width="100"/>
        <x-table-column prop="sex" label="性别" width="60"/>
        <x-table-column prop="status" label="启用" width="60">
            <el-switch slot-scope="scope" slot="show" v-model="scope.row.status" :disabled="true"/>
        </x-table-column>
        <x-table-column prop="issuper" align="center" label="管理员" width="80">
            <x-status slot-scope="scope" slot="show" :value="scope.row.issuper"/>
        </x-table-column>
        <x-table-column prop="tel" label="电话" width="150"/>
        <x-table-column prop="mobile" label="手机" width="200"/>
        <x-table-column prop="email" label="邮箱" width="200"/>
        <x-table-column prop="addr" label="住址"/>

        <x-dialog-edit slot="dialog" slot-scope="scope" request title="用户设置" width="1100px" max-height="720px">
            <el-form label-position="right" label-width="100px" inline cols="3">
                <h1 style="font-size: 16px;font-weight: bold;margin-bottom: 25px"><span class="el-icon-s-operation" style="color: #337AB7;font-weight: bold;"/>&nbsp;基本信息</h1>
                <x-form-item label="所属系统:">
                    <x-select v-model="scope.row.sysid" :excludeData="scope.row.sysid" :disabled="scope.action" :data-source="{head:{module:'sys_system'},option:{dic:'sys_system'},data:{option:{id:'sysid',label:'name'}}}" dialog-width="300px"/>
                </x-form-item>
                <x-form-item label="帐号">
                    <x-input v-model="scope.row.uid" v-rules="[{type: 'required'}]" :maxlength=32 :disabled="scope.action"/>
                </x-form-item>
                <x-form-item label="启用状态">
                    <el-switch v-model="scope.row.status" :disabled="scope.action"/>
                </x-form-item>
                <x-form-item label="超级管理员" prop="passport">
                    <el-switch v-model="scope.row.issuper" :disabled="scope.action"/>
                </x-form-item>
                <x-form-item label="密码" prop="pwd">
                    <x-input v-model="scope.row.pwd" v-rules="[{type: 'required'}]" :maxlength=32 :disabled="scope.action"/>
                </x-form-item>
                <x-form-item label="姓名">
                    <x-input v-model="scope.row.name" v-rules="[{type:'required'}]" :maxlength=30 :disabled="scope.action"/>
                </x-form-item>
                <x-form-item label="性别">
                    <el-select v-model="scope.row.sex" :disabled="scope.action" placeholder="请选择">
                        <el-option key="男" label="男" value="男"/>
                        <el-option key="女" label="女" value="女"/>
                    </el-select>
                </x-form-item>
                <x-form-item label="用户类型">
                    <x-select v-model="scope.row.utype" v-rules="[{type:'required'}]" :disabled="scope.action" :data-source="{head:{module:'sys_dic'},option:{dic:'sys_dic_userType'},data:{option:{id:'code',label:'name'}},query:{filter:[{type:'userType'},{_pid:{'!=':'0'}}]}}" placeholder="请选择用户类型" />
                </x-form-item>
                <x-form-item label="手机" prop="mobile">
                    <x-input v-model="scope.row.mobile" :disabled="scope.action"/>
                </x-form-item>
                <x-form-item label="电话">
                    <x-input v-model="scope.row.tel" :disabled="scope.action"/>
                </x-form-item>
                <x-form-item label="所属角色">
                    <x-select multiple v-model="scope.row.rid" v-rules="[{type:'required'}]" :disabled="scope.action" :data-source="{head:{module:'sys_role'},option:{dic:'sys_role'},data:{option:{id:'rid',label:'name'}}}" placeholder="请选择角色"/>
                </x-form-item>
                <x-form-item label="qq">
                    <x-input v-model="scope.row.qq" :disabled="scope.action"/>
                </x-form-item>
                <x-form-item label="邮箱">
                    <x-input v-model="scope.row.email" v-rules="[{type:'email'}]" :disabled="scope.action"/>
                </x-form-item>
                <x-form-item label="所属部门">
                    <x-select is-tree multiple dialogHeight="400" v-model="scope.row.oid" v-rules="[{type:'required'}]" :disabled="scope.action" :data-source="{head:{module:'sys_org'},option:{dic:'sys_org'},data:{tree:2,option:{pid:'_pid',id:'oid',label:'name'}}}" placeholder="请选择机构"/>
                </x-form-item>
                <x-form-item label="住址">
                    <x-input v-model="scope.row.addr" :disabled="scope.action"/>
                </x-form-item>
                <x-form-item label="密码时长(天)">
                    <el-input-number v-model="scope.row.pwdlimittime" :min="0" :disabled="scope.action"/>
                </x-form-item>
                <x-form-item label="IP限制" cols="3">
                    <x-input v-model="scope.row.limitip" :disabled="scope.action"/>
                </x-form-item>
                <x-form-item label="备注" cols="3">
                    <x-input v-model="scope.row.memo" :disabled="scope.action"/>
                </x-form-item>
                <h1 style="font-size: 16px;font-weight: bold;margin-bottom: 25px"><span class="el-icon-s-operation" style="color: #337AB7;font-weight: bold;"/>&nbsp;其它信息</h1>
                <x-form-item label="注册时间">
                    <x-input v-model="scope.row.regtime" :disabled="true"/>
                </x-form-item>
                <x-form-item label="改密时间">
                    <x-input v-model="scope.row.pwdmodifytime" :disabled="true"/>
                </x-form-item>
                <x-form-item label="登录时间">
                    <x-input v-model="scope.row.lastlogintime" :disabled="true"/>
                </x-form-item>
                <x-form-item label="登录IP">
                    <x-input v-model="scope.row.lastloginip" :disabled="true"/>
                </x-form-item>
                <x-form-item label="登录次数">
                    <x-input v-model="scope.row.logincount" :disabled="true"/>
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
    import XStatus from '../x-status';
    export default {
        name: 'SysUser',
        components: {XTableEdit, XTableColumn, XQuery, XQueryItem, XDialogEdit, XInput, XFormItem, XSelect, XStatus}
    }
</script>
