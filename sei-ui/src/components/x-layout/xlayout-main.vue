<template>
    <section class="main">
        <transition name="fade" mode="out-in">
            <router-view/>
        </transition>
    </section>
</template>

<script>
    export default {
        name: 'XLayoutMain'
    };
</script>

<style lang="less" scoped>
    .main {
        height: calc(100% - 40px);
        padding: 15px;
        overflow: auto;
        box-sizing: border-box;
    }
</style>
