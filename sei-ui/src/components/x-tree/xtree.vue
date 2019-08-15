<template>
    <section>
        <div class="title" v-if="title">{{title}}</div>
        <el-form inline v-if="$slots.topButtonArea || (showTopButton && pvButtons)">
            <el-form-item v-if="hasAdd">
                <slot name="add"/>
                <el-button v-if="!$slots.add" @click="beginAction('add')" type="primary" icon="el-icon-circle-plus-outline" plain class="tableRowButton" size="mini">新增</el-button>
            </el-form-item>
            <el-form-item v-if="hasEdit">
                <slot name="edit"/>
                <el-button v-if="!$slots.edit" :disabled="!isSelect" @click="beginAction('edit')" type="warning" icon="el-icon-edit" plain class="tableRowButton" size="mini">修改</el-button>
            </el-form-item>
            <el-form-item v-if="hasDel">
                <slot name="del"/>
                <el-button v-if="!$slots.del" :disabled="!isSelect" @click="handelDel()" type="danger" icon="el-icon-circle-close-outline" plain class="tableRowButton" size="mini">删除</el-button>
            </el-form-item>
            <el-form-item v-if="dialogEdit && hasSee">
                <slot name="see"/>
                <el-button v-if="!$slots.see" :disabled="!isSelect" @click="beginAction('see')" type="success" icon="el-icon-circle-close-outline" plain size="mini">查看</el-button>
            </el-form-item>
            <el-form-item v-if="$slots.topButtonArea">
                <slot name = "topButtonArea"/>
            </el-form-item>
        </el-form>
        <el-input v-if="filter" v-model="labelModel"  @keyup.enter.native="search" clearable class="input-with-select" style="width:100%">
            <el-button slot="append" icon="el-icon-search" @click.native="search"/>
        </el-input>
        <el-tree ref="tree" :data="rows" v-bind="$attrs" :props="option" :filter-node-method="filterNode" style="width:100%;height:100%"
                 :emptyText="emptyText" :renderAfterExpand="renderAfterExpand" :nodeKey="nodeKey" :checkStrictly="checkStrictly" :defaultExpandAll="defaultExpandAll" :expandOnClickNode="expandOnClickNode" :checkOnClickNode="checkOnClickNode" :checkDescendants="checkDescendants" :autoExpandParent="autoExpandParent" :defaultCheckedKeys="defaultCheckedKeys" :defaultExpandedKeys="defaultExpandedKeys" :currentNodeKey="currentNodeKey" :renderContent="renderContent" :showCheckbox="showCheckbox" :draggable="draggable" :allowDrag="allowDrag" :allowDrop="allowDrop" :lazy="lazy" :highlightCurrent="highlightCurrent" :load="load" :accordion="accordion" :indent="indent" :iconClass="iconClass"
                 @node-click="onClickNode" @node-contextmenu="nodeContextmenu" @check-change="checkChange" @check="check" @current-change="currentChange" @node-expand="nodeExpand" @node-collapse="nodeCollapse" @node-drag-start="nodeDragStart" @node-drag-enter="nodeDragEnter" @node-drag-leave="nodeDragLeave" @node-drag-over="nodeDragOver" @node-drag-end="nodeDragEnd" @node-drop="nodeDrop">
        </el-tree>
        <slot name="dialog" :row="currEditSelection.newData" :action="isSee" :actionType="actionType"/>
    </section>
</template>
<script>
    import tree from '../support/tree';
    export default {
        name: 'XTree',
        mixins: [tree]
    }
</script>
<style scoped>
    .title{
        color: #565758;
        font-size: 20px;
        padding-bottom: 10px;
    }
</style>
