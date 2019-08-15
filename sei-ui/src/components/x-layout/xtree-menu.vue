<!-- 树型菜单,用于左面导航菜单 -->
<template>
    <section>
        <template v-for="item in data">
            <el-submenu v-if="item.children" :index="item.path" :key="item.path">
                <template slot="title">
                    <i :class="item.icon"/>
                    <span slot="title">{{item.name}}</span>
                </template>
                <x-tree-menu :data="item.children"/>
            </el-submenu>
            <el-menu-item v-else :index="item.path" :key="item.path">
                <i :class="item.icon"/>
                <span slot="title">{{item.name}}</span>
            </el-menu-item>
        </template>
    </section>
</template>

<script>
    export default {
        props: ['data'],
        name: 'XTreeMenu'
    }
</script>
