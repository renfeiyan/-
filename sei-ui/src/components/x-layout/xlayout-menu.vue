<!-- 左侧导航组件 -->
<template>
    <el-scrollbar id="sidebar-wrap" class="scrollbar-wrapper">
        <el-menu background-color="#545c64" text-color="#fff" :collapse-transition="false" :default-active="defaultActive" :unique-opened="true" :router="true" mode="vertical" :collapse="isCollapse">
            <h3 class="isCollapse" :class="[isCollapse ? 'in': 'out']" style="background-color:rgb(52,68,74)">
                <span v-show="!isCollapse">菜    单</span>
                <i :class="[isCollapse ? 'icon-indent in': 'icon-outdent out','iconfont']" @click="toggleSiderBar"></i>
            </h3>
            <template v-for="item in menu">
                <el-submenu v-if="item.children && item.children.length > 0" :index="item.path" :key="item.path">
                    <template slot="title">
                        <i :class="item.icon"></i>
                        <span slot="title">{{item.name}}</span>
                    </template>
                    <x-tree-menu :data="item.children"></x-tree-menu>
                </el-submenu>
                <el-menu-item v-else :index="item.path" :key="item.path">
                    <i :class="item.icon"></i>
                    <span slot="title">{{item.name}}</span>
                </el-menu-item>
            </template>
        </el-menu>
    </el-scrollbar>
</template>
<script>
    import XTreeMenu from './xtree-menu';
    import http from '../../utils/http';
    export default {
        name: 'XLayoutMenu',
        components: {XTreeMenu},
        created() {
            this.menu = this.$store.state.controlStyle.menu;
            clearInterval(this.timer);
            this.timer = setInterval(() => {http.get('/user/online');}, 600000);
            this.setTimer();
        },
        data() {
            return {
                menu: [],
                timer: null
            }
        },
        computed: {
            isCollapse() {
                return this.$store.state.controlStyle.isCollapse
            },
            defaultActive() {
                return this.$route.path
            }
        },
        methods: {
            toggleSiderBar() {
                this.$store.commit('toggleSiderBar')
            },
            setTimer() {
                if (this.timer == null) {
                    this.timer = setInterval(() => {http.get('/user/online');}, 600000)
                }
            }
        },
        destroyed: function () {
            clearInterval(this.timer);
            this.timer = null
        },
        mounted() {
            if (this.$router.currentRoute.fullPath === '/') {
                this.$router.push('/index/dashboard')
            }
        }
    };
</script>
<style scoped lang="less">
    #sidebar-wrap {
        .el-menu{
            border-right:0;
        }
        .isCollapse {
            height: 40px;
            line-height: 40px;
            font-size: 14px;
            color: #fff;
            box-sizing: border-box;
            position: relative;
            span {
                display: inline-block;
                width: 100%;
                text-align: center;
                font-size: 14px
            }
            i {
                top:0;
                display: inline-block;
                width: 30px;
                text-align: center;
                position: absolute;
                right: 0;
                font-size: 18px;
            }
            .in {width:100%;}
            .out {width: 30px;}
        }
    }
    .scrollbar-wrapper {
        height: 100%;
        .el-scrollbar__view {height: 100%;}
        .el-scrollbar__wrap {overflow-x: hidden;}
    }
</style>
