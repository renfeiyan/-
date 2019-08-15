<!-- 个人资料柜 -->
<template>
    <x-table-edit ref="xtableEdit" :multiSelect="true" :singleSelect="false" :data-source="{head:{module:'sys_owndisk'},option:{privilege:'add,del,see'},query:{url:'/owndisk/query'},save:{add:{url:'/owndisk/edit'},edit:{url:'/owndisk/edit'},del:{url:'/owndisk/del'}}}">
        <x-query slot="query">
            <x-query-item prop="name" opt="like" label="文件名"/>
        </x-query>
        <template slot="add">
            <el-form-item>
                <el-button type="primary" @click="handelMakeDir" icon="el-icon-mobile-phone" plain size="mini">新建目录</el-button>
            </el-form-item>
            <el-form-item>
                <el-upload action="/owndisk/upload" :on-success="uploadSuccess" :show-file-list="false" :data="{path:this.path.join('/')}">
                    <el-button type="primary" icon="el-icon-upload2" plain size="mini">上传</el-button>
                </el-upload>
            </el-form-item>
        </template>
        <template slot="see">
            <el-form-item>
                <el-button type="success" @click="handelDown" icon="el-icon-download" plain size="mini">下载</el-button>
            </el-form-item>
        </template>
        <template slot="topButtonAreaTail">
            <el-form-item>
                当前路径:&nbsp;<span v-for="(val,index) of path" :key="index" >&nbsp;/&nbsp;<a class='a' @click="comeIndex(index)" :key="index">{{val==='/'?'根目录':val}}</a></span>
            </el-form-item>
        </template>
        <x-table-column prop="isFile" label="类型" :sortable="true" :edit="false" width="100">
            <template slot-scope="scope" slot="show">
                {{scope.row.isFile==='true'?'文件':'目录'}}
            </template>
        </x-table-column>
        <x-table-column prop="name" label="名称" :sortable="true" width="400">
            <template slot-scope="scope" slot="show">
                <a class="a" @click="comePath(scope.row.path)" v-if="scope.row.isFile!=='true'">{{scope.row.name}}</a>
                <span v-else>{{scope.row.name}}</span>
            </template>
        </x-table-column>
        <x-table-column prop="ext" label="扩展名" :sortable="true" :edit="false" width="100"/>
        <x-table-column prop="size" label="大小" :sortable="true" :edit="false" width="100"/>
        <x-table-column prop="createTime" label="创建时间" :sortable="true" :edit="false" width="200"/>
        <x-table-column prop="path" label="路径" :sortable="true" :edit="false"/>
    </x-table-edit>
</template>

<script>
    import {Message, MessageBox} from 'element-ui';
    import http from '../../utils/http';
    import {XTableEdit, XTableColumn} from '../x-table-edit/index';
    import {XQuery, XQueryItem} from '../x-query';

    export default {
        name: 'SysOwnDisk',
        components: {XTableEdit, XTableColumn, XQuery, XQueryItem},
        data() {
            return {
                path: ['/']
            }
        },
        methods: {
            comePath(path) {
                this.$refs.xtableEdit.handelQuery(null, (query) => {
                    query.path = path;
                }, () => {
                    this.path.push(path.substring(path.lastIndexOf('/')+1));
                });
            },
            comeIndex(index) {
                if (index <= 0) {
                    this.$refs.xtableEdit.handelQuery();
                    this.path=['/'];
                } else {
                    this.path.splice(index+1);
                    let path = this.path.join('/');
                    this.$refs.xtableEdit.handelQuery(null, (query) => {
                        query.path = path;
                    });
                }
            },
            refresh() {
                this.$refs.xtableEdit.handelQuery(null, (query) => {
                    query.path = this.path.join('/');
                });
            },
            handelMakeDir() {
                MessageBox.prompt('请输入新目录名称', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(({value}) => {
                    let path = this.path.join('/');
                    let mkdir={path: path, name: value};
                    http.post('/owndisk/makedir', mkdir).then((res) => {
                        if (res && res.code==1) {
                            Message.success('目录创建成功。');
                            this.refresh();
                        }
                    });
                }).catch(() => {
                    Message.info('取消创建目录');
                });
            },
            afterTableRowSave(it, index) {
                let path = it.rows[index].path;
                path = path.substring(0, path.lastIndexOf('/'));
                it.rows[index].path = path + '/' + it.rows[index].name;
            },
            uploadSuccess() {
                Message.success('上传成功。');
                this.refresh();
            },
            handelDown() {
                let rows = this.$refs.xtableEdit.getMultiSelection();
                if (!rows || rows.length <= 0) {
                    Message.error('请选中要下载的文件或目录');
                    return;
                }
                let down={rows: []};
                rows.forEach((v) => down.rows.push({action: 'down', id: v.path}));
                http.fileDown('/owndisk/down', down);
            }
        }
    };
</script>
<style scoped>
    .a{color: #42a3fb;text-decoration:underline;cursor:pointer;}
</style>
