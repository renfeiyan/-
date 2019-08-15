<template>
    <el-container>
        <el-header>
            <x-layout-topbar/>
        </el-header>
        <el-container>
            <el-aside :width="isCollapse?'64px':'250px'">
                <x-layout-menu/>
            </el-aside>
            <el-main>
                <x-layout-tags/>
                <x-layout-main />
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
    import {XLayoutMain, XLayoutMenu, XLayoutTopbar, XLayoutTags} from 'sei-ui';
    export default {
        name: 'layout',
        components: {XLayoutMenu, XLayoutTopbar, XLayoutTags, XLayoutMain},
        computed: {
            isCollapse() {
                return this.$store.state.controlStyle.isCollapse;
            }
        }
    };
</script>
<style lang="less" scoped>
    .el-container {
        width: 100%;
        height: 100%;
    }
    .el-header {
        padding: 0;
        font-size: 0;
        line-height: 60px;
        background: white;
        box-sizing: border-box;
        overflow: hidden;
    }
    .el-aside {
        background:#545c64;
        color: #fff;
        overflow: hidden;
    }
    .el-main {
        padding: 0;
        height: 100%;
        overflow: auto
    }
</style>
