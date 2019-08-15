<template>
    <el-dropdown trigger="click" class="international" @command="handleSetLanguage">
        <div>
            <i class="icon-fanyiline iconfont"/>
        </div>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :disabled="language==='zh'" command="zh">中文</el-dropdown-item>
            <el-dropdown-item :disabled="language==='en'" command="en">English</el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
</template>

<script>
    import {Message} from 'element-ui'
    import store from '../../store';
    import setLang from '../../locale/lang';

    export default {
        computed: {
            language() {
                return this.$store.getters.language
            }
        },
        methods: {
            handleSetLanguage(lang) {
                setLang(lang);
                store.dispatch('setLanguage', lang);
                Message({
                    message: this.$t('app.changeLangMag'),
                    type: 'success'
                })
            }
        }
    }
</script>

<style scoped lang="less">
    .international {
        i {
            color: #ffffff;
            font-size: 20px;
            line-height: 60px;
            transition: all 0.5s;
            &:hover {cursor: pointer;}
        }
    }
</style>

