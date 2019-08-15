<template>
    <i :class="[value ? 'el-icon-check':'el-icon-close']"/>
</template>
<script>
    export default {
        name: 'XStatus',
        props: {
            value: [Boolean, Number]
        }
    }
</script>
<style scoped>
    .el-icon-check{
        color: #008000;
        font-size: 20px;
    }
    .el-icon-close{
        color: #ff0000;
        font-size: 20px;
    }
</style>
