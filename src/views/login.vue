<template>
    <div style="width:100%;height:100%;background-color:#2a94de;overflow: hidden;">
        <div class="login_box">
            <div class="login_l_img"><img src="./img/login-img.png"/></div>
            <div class="login">
                <div class="login_logo"><img :src="$project.logo"/></div>
                <div class="login_name">
                    <p style="font-size:25px">{{$project.name}}</p>
                </div>
                <el-form v-if="!findPassword" ref="form" :model="login" :rules="rules" status-icon label-position="left" label-width="0px" class="login-page">
                    <el-form-item prop="passport">
                        <x-input label="账号:" type="text" v-model="login.passport" auto-complete="off" placeholder="用户名" size="big"></x-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <x-input label="密码:" type="password" v-model="login.password" auto-complete="off" placeholder="密码" size="big"></x-input>
                    </el-form-item>
                    <el-form-item prop="checkcode">
                        <x-input label="验证码:" size="big" class="codeInput" @keyup.enter.native="handleLogin" placeholder="请输入4位验证码" v-model="login.checkcode"/>
                        <img :src="$baseURL + imageUrl" alt="点击刷新" class="codeImg" @click.stop="handleCode"/>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" style="margin-top:10px;width:100%;height:40px;font-size: 20px;" @click="handleLogin">登录</el-button>
                    </el-form-item>
                    <el-checkbox v-model="remember" class="remember">记住密码</el-checkbox>
                </el-form>
            </div>
        </div>
        <div class="copyright">重庆邮电大学数字媒体技术研究所 版权所有©2018-2020</div>
    </div>
</template>

<script>
    import {login, XInput} from 'sei-ui';
    export default {
        name: 'login',
        components: {XInput},
        mixins: [login],
        data() {
            return {
                // logo:require('./img/logo.png'),
                // projectName:'云开发平台',
                findPassword: false
            }
        },
        methods: {
            handleFindPassword() {
                // this.findPassword = !this.findPassword;
            }
        }
    }
</script>

<style scoped>
    body {background-size: cover; height:100%; overflow:hidden;}
    .login_box{ width:1100px; margin:120px auto 0;}
    .login_box .login_l_img{ float:left; width:432px; height:440px; margin-left:50px;}
    .login_box .login_l_img img{width:500px; height:440px; }
    .login {height:430px; width:400px; padding:50px; background-color: #ffffff;border-radius:6px;box-sizing: border-box; float:right; margin-right:50px; position:relative; margin-top:30px;}
    .login_logo{ width:120px; height:120px; border:5px solid #93defe;border-radius:100px; background:#fff; text-align:center; line-height:110px; position:absolute; top:-60px; right:140px;}
    .login_name{ width:100%; float:left; text-align:center; margin-top:20px; font-size: 20px}
    .login_name p{ width:100%; text-align:center; font-size:18px; color:#444; padding:10px 0 20px;}
    .login_logo img{ width:90px; height:90px;display: inline-block; vertical-align: middle;}
    .copyright { background-color: #3b4249;width:100%;height:80px;position:absolute;bottom: 0px; font-size:14px; color:#fff; float:left; text-align:center;line-height: 80px;}
    .codeInput{width: 200px;}
    .codeImg{height: 35px;width: 90px;margin-left: 5px;float: right;padding-top: 2px;}
</style>
