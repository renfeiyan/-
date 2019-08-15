<template>
    <div class="el-input-group">
        <el-button @click="click" type="primary" icon="el-icon-circle-plus-outline" plain size="mini">清除</el-button>
    </div>
</template>

<script>
    import {Message, MessageBox} from 'element-ui';
    import {http} from 'sei-ui';
    export default {
        name: 'sys_ClearCache',
        methods: {
            click() {
                MessageBox.confirm('此操作将清除服务器所有缓存数据,真的要清除吗?', '确认', {
                    confirmButtonText: '清除',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    http.post('/cache/removeAllCache', null, false, false).then((res) => {
                        res && res.code ==1 && Message.success('已提交缓存清理任务,稍等片刻即将完成。');
                    });
                }).catch(() => {
                    Message.info('已取消清除');
                });
            }
        }
    };
</script>

