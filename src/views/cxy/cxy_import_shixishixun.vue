<!-- 实习实训基地管理 -->
<template>
    <x-table-edit :singleSelect="false" :showRowButton="true" :showTopButton="false" :data-source="{head:{module:'cxy_import_shixishixun'},query:{order:'year desc'},option:{privilege:'see',keyField:true}}">
        <x-query slot="query">
            <x-query-item prop="year" label="年度：" opt="=" >
                 <el-date-picker slot-scope="scope" style="width:130px" v-model="scope.row.year" value-format="yyyy" type="year" align="right"/>
            </x-query-item>
            <x-query-item>
                <x-select prop="co_name" label="合作单位/机构：" :data-source="{head:{module:'cxy_import_shixishixun'},option:{fields:'co_name'},query:{fields:'co_name',group:'co_name'},data:{option:{id:'co_name',label:'co_name'}}}"/>
            </x-query-item>
            <x-query-item prop="undertake_dept"  opt="=" label="承担单位：" >
                 <x-select slot-scope="scope" v-model="scope.row.undertake_dept" :data-source="{head:{module:'cxy_import_shixishixun'},option:{fields:'undertake_dept'},query:{group:'undertake_dept'},data:{option:{id:'undertake_dept',label:'undertake_dept'}}}" style="width:150px"/>
            </x-query-item>
        </x-query>
        <x-table-column prop="co_name" label="合作单位/机构" width="150" />
        <x-table-column prop="year" label="年度" width="60"/>
        <x-table-column prop="undertake_dept" label="承担单位" width="120"/>
        <x-table-column prop="face_subject" label="面向校内专业" width="240"/>
        <x-table-column prop="address" label="地址" width="200"/>
        <x-table-column prop="accept_stu_number" label="接纳学生(人/次)" width="130"/>
        <x-table-column prop="shiji_accept_stu_number" label="接纳学生(人/年)" width="130"/>
        <x-table-column prop="response_man" label="校内负责人" width="100"/>
        <x-table-column prop="linkman" label="校内联系人" width="100"/>
        <x-table-column prop="linkman_tel" label="校内联系人电话" width="130"/>
        <x-table-column prop="co_linkman" label="校外联系人" width="100"/>
        <x-table-column prop="co_linkman_tel" label="校外联系人电话" width="130"/>

        <x-dialog-edit slot="dialog" slot-scope="scope" title="实习实训" width="1100px" :show-close="true">
            <el-form label-position="right" label-width="130px" inline cols="3">
                <x-form-item label="合作单位/机构">
                    <x-input v-model="scope.row.co_name" :disabled="scope.action"/>
                </x-form-item>
                <x-form-item label="年度">
                    <x-input v-model="scope.row.year" :disabled="scope.action"/>
                </x-form-item>
                <x-form-item label="承担单位">
                    <x-input v-model="scope.row.undertake_dept" :disabled="scope.action"/>
                </x-form-item>
                <x-form-item label="面向校内专业">
                    <x-input v-model="scope.row.face_subject" :disabled="scope.action"/>
                </x-form-item>
                <x-form-item label="地址">
                    <x-input v-model="scope.row.address" :disabled="scope.action"/>
                </x-form-item>
                <x-form-item label="校内负责人">
                    <x-input v-model="scope.row.response_man" :disabled="scope.action"/>
                </x-form-item>
                <x-form-item label="每次接纳学生数">
                    <x-input v-model="scope.row.accept_stu_number" :disabled="scope.action"/>
                </x-form-item>
                <x-form-item label="当年接纳学生数">
                    <x-input v-model="scope.row.shiji_accept_stu_number" :disabled="scope.action"/>
                </x-form-item>
                <x-form-item label="校内联系人">
                    <x-input v-model="scope.row.linkman" :disabled="scope.action"/>
                </x-form-item>
                <x-form-item label="校内联系人电话">
                    <x-input v-model="scope.row.linkman_tel" :disabled="scope.action"/>
                </x-form-item>
                <x-form-item label="校外联系人">
                    <x-input v-model="scope.row.co_linkman" :disabled="scope.action"/>
                </x-form-item>
                <x-form-item label="校外联系人电话">
                    <x-input v-model="scope.row.co_linkman_tel" :disabled="scope.action"/>
                </x-form-item>
            </el-form>
        </x-dialog-edit>
    </x-table-edit>
</template>

<script>
    import {XTableEdit, XTableColumn, XQuery, XQueryItem, XSelect, XDialogEdit, XInput, XFormItem} from 'sei-ui'
    export default {
        name: 'cxy_import_shixishixun',
        components: {XTableEdit, XTableColumn, XQuery, XQueryItem, XSelect, XDialogEdit, XInput, XFormItem}
    };
</script>
