<template>
    <div id="topbar-wrap" :class="{ topCollapsed: isCollapse }">
        <el-row type="flex" justify="space-between">
            <el-col :span="12">
                <div class="logo"><img :src="$project.logo">
                    <span>{{$project.name}}</span>
                </div>
            </el-col>
            <el-col :span="12">
                <el-row type="flex" class="row-right" justify="end" style="margin-right:-15px">
                    <el-col :span="4">
                        <label class="user" v-if="userName">欢迎您：{{userName}}</label>
                    </el-col>
                    <el-col :span="1">
                        <i class="el-icon-s-custom" title="个人信息" @click="()=>{$refs.info.beginAction('see', 0);$refs.info.open('see');}"/>
                    </el-col>
<!--                    <el-col :span="2">-->
<!--                        <lang-select/>-->
<!--                    </el-col>-->
                    <el-col :span="1">
                        <i class="el-icon-help" title="更改密码" @click="()=>{$refs.pwd.beginAction('add', 0);$refs.pwd.open('edit')}"/>
                    </el-col>
                    <el-col :span="1">
                        <i :class="[isFullscreen? 'icon-zuixiaohua': 'icon-quanping','iconfont','']" title="切换全屏" @click="toggleFullscreen"></i>
                    </el-col>
                    <el-col :span="2">
                        <i class="icon-tuichu iconfont logout" title="退出" @click.prevent="logout"></i>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <x-dialog-edit ref="pwd" title="更改密码" width="380px" :beforeSave="beforeSave" :data-source="{head:{module:'sys_user'},option:{load:false,private:true},save:{noSaveFields:['newPwd1'],add:{url:'/user/changePassword'}}}" >
            <el-form label-position="right" label-width="90px" slot-scope="scope">
                <x-form-item label="旧密码">
                    <x-input type="password" v-model="scope.row.pwd" v-rules="[{type: 'required'}]" :maxlength=32 />
                </x-form-item>
                <x-form-item label="新密码">
                    <x-input type="password" v-model="scope.row.newPwd" v-rules="[{type: 'required'}]" :maxlength=32 />
                </x-form-item>
                <x-form-item label="确认新密码">
                    <x-input ref="newPwd1" type="password" v-model="scope.row.newPwd1" v-rules="[{type: 'required'}]" :maxlength=32 />
                </x-form-item>
            </el-form>
        </x-dialog-edit>
        <x-dialog-edit ref="info" title="个人信息" width="1000px" max-height="720px" :data-source="{head:{module:'sys_user'},query:{url:'/user/info'},
    data:{rowEvn: (v)=>{v.oid != null && (v.oid = v.oid.split(',')); v.rid != null && (v.rid = v.rid.split(','));}},
    save:{rowEvn: (v)=>{v.oid != null && (v.oid = v.oid.join(',')); v.rid != null && (v.rid = v.rid.join(','));}}}">
            <el-form label-position="right" label-width="100px" inline cols="3" slot-scope="scope">
                <h1 style="font-size: 16px;font-weight: bold;margin-bottom: 25px"><span class="el-icon-s-operation" style="color: #337AB7;font-weight: bold;"/>&nbsp;基本信息</h1>
                <x-form-item label="帐号">
                    <x-input v-model="scope.row.uid" :disabled="true"/>
                </x-form-item>
                <x-form-item label="启用状态">
                    <el-switch v-model="scope.row.status" :disabled="true"/>
                </x-form-item>
                <x-form-item label="超级管理员" prop="passport">
                    <el-switch v-model="scope.row.issuper" :disabled="true"/>
                </x-form-item>
                <x-form-item label="密码" prop="pwd">
                    <x-input v-model="scope.row.pwd" :disabled="true"/>
                </x-form-item>
                <x-form-item label="姓名">
                    <x-input v-model="scope.row.name" :disabled="true"/>
                </x-form-item>
                <x-form-item label="性别">
                    <el-select v-model="scope.row.sex" :disabled="true" placeholder="请选择">
                        <el-option key="男" label="男" value="男"/>
                        <el-option key="女" label="女" value="女"/>
                    </el-select>
                </x-form-item>
                <x-form-item label="用户类型">
                    <x-select v-model="scope.row.utype" :disabled="true" :data-source="{head:{module:'sys_dic'},option:{dic:'sys_dic_userType'},data:{option:{id:'code',label:'name'}},query:{filter:[{type:'userType'},{_pid:{'!=':'0'}}]}}" placeholder="" />
                </x-form-item>
                <x-form-item label="手机" prop="mobile">
                    <x-input v-model="scope.row.mobile" :disabled="true"/>
                </x-form-item>
                <x-form-item label="电话">
                    <x-input v-model="scope.row.tel" :disabled="true"/>
                </x-form-item>
                <x-form-item label="所属角色">
                    <x-select multiple v-model="scope.row.rid" :disabled="true" :data-source="{head:{module:'sys_role'},option:{dic:'sys_role'},data:{option:{id:'rid',label:'name'}}}" placeholder=""/>
                </x-form-item>
                <x-form-item label="qq">
                    <x-input v-model="scope.row.qq" :disabled="true"/>
                </x-form-item>
                <x-form-item label="邮箱">
                    <x-input v-model="scope.row.email" :disabled="true"/>
                </x-form-item>
                <x-form-item label="所属部门">
                    <x-select is-tree multiple dialogHeight="400" v-model="scope.row.oid" :disabled="true" :data-source="{head:{module:'sys_org'},option:{dic:'sys_org'},data:{tree:2,option:{pid:'_pid',id:'oid',label:'name'}}}" placeholder=""/>
                </x-form-item>
                <x-form-item label="住址">
                    <x-input v-model="scope.row.addr" :disabled="true"/>
                </x-form-item>
                <x-form-item label="密码时长">
                    <x-input v-model="scope.row.pwdlimittime" :disabled="true"/>
                </x-form-item>
                <x-form-item label="IP限制" cols="3">
                    <x-input v-model="scope.row.limitip" :disabled="true"/>
                </x-form-item>
                <x-form-item label="备注" cols="3">
                    <x-input v-model="scope.row.memo" :disabled="true"/>
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
    </div>
</template>
<script>
    import screenfull from 'screenfull';
    import http from '../../utils/http';
    // import LangSelect from '../lang-select';
    import {Message, MessageBox} from 'element-ui';
    import XDialogEdit from '../x-dialog-edit';
    import XInput from '../x-input';
    import XFormItem from '../x-form-item';
    import XSelect from '../x-select';
    export default {
        name: 'XLayoutTopBar',
        components: {XDialogEdit, XInput, XFormItem, XSelect},
        data() {
            return {
                isFullscreen: false
            }
        },
        computed: {
            isCollapse() {
                return this.$store.state.controlStyle.isCollapse
            },
            userName() {
                return sessionStorage.getItem('name')||'';
            },
            projectName() {
                return sessionStorage.getItem('projectName')||'云开发平台';
            },
            logo() {
                return sessionStorage.getItem('logo');
            }
        },
        methods: {
            toggleSiderBar() {
                this.$store.commit('toggleSiderBar')
            },
            toggleFullscreen() {
                if (!screenfull.enabled) {
                    Message.warning('您的浏览器不支持全屏');
                    return false
                }
                screenfull.toggle();
                this.isFullscreen = !screenfull.isFullscreen
            },
            beforeSave(newRow){
                if (newRow.pwd == null || newRow.newPwd == null || newRow.newPwd1 == null) {
                    Message.error('数据填写不全,请填写完成后再保存。');
                    return false;
                }
                if (newRow.newPwd !== newRow.newPwd1){
                    Message.error('新密码与重复新密码不一致,请检查填写一致后再保存。');
                    return false;
                }
                return true;

            },
            logout() {
                MessageBox.confirm('确定退出系统吗?', '退出提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    http.post('/public/logout').then((res) => {
                        if (res && res.code==1) {
                            this.$store.state.controlStyle.menu = null;
                            this.$router.push('/login')
                        } else {
                            Message.warning('登出异常,请稍后再试！');
                        }
                    }).catch(() => {
                        Message.warning('登出异常,请稍后再试！');
                    });
                }).catch(() => 0);
            }
        }
    }
</script>
<style scoped lang="less">
    #topbar-wrap {
        height: 60px;
        background-color: #2a94de;
        color: #353d47;
        z-index: 4;
        box-sizing: border-box;
        .user {
            /*user-select: none;*/
            line-height: 60px;
            font-size:12px;
            color: #ffffff
        }
        .logo {
            user-select: none;
            line-height: 60px;
            height: 60px;
            display: inline-block;
            img {
                margin-left: 20px;
                height: 40px;
                margin-top: 10px;
                vertical-align: top;
                border-radius: 50%;
            }
            span {
                margin-left: 10px;
                height: 60px;
                display: inline-block;
                line-height: 60px;
                color:#ffffff;
                font-weight: bold;
                font-size: 25px;
            }
        }
        a {line-height: 60px;}
        i {
            color: #ffffff;
            font-size: 20px;
            line-height: 60px;
            transition: all 0.5s;
            &:hover {cursor: pointer;}
        }
        .fa-language:hover {transform: rotateY(180deg)}
        .logout {
            text-decoration: none;
            &:hover {color: #1dc4e9;}
        }
    }
    .row-right > div {text-align: center;}
</style>
