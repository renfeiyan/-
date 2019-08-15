<template>
    <div>
        <el-upload v-if="actionType!=='see'" ref="upload" :action="action" :multiple="multiple" :show-file-list="showFileList" :drag="drag"
                   :dragger="dragger" :file-list=myFileList :data="dataX" :headers="headers" :withCredentials="withCredentials" :name="name"
                   :accept="accept" :type="type" :beforeRemove="beforeRemove" :onChange="onChange" :onPreview="onPreview" :onProgress="onProgress" :onError="onError"
                   :autoUpload="autoUpload" :listType="listType" :httpRequest="httpRequest" :disabled="disabled" :limit="limit" :onExceed="onExceed"
                   :on-success="uploadSuccess" :before-upload="onBeforeUpload" :on-remove="remove">
            <el-button size="small" type="primary">点击上传</el-button>
            <input ref="input" v-model="value" type="hidden"/>
        </el-upload>
        <a class="down" v-else v-for="(item) in myFileList" :key="item" @click="down(item.name)">{{item.name}}<br/></a>
    </div>
</template>
<script>
    import tools from '../../utils/tools';
    import {Message} from 'element-ui';
    import http from '../../utils/http';
    export default {
        name: 'XUpload',
        props: {
            uploadSuccessCallBack: Function, /* 文件上传成功后的回调 */
            actionType: String,
            docID: [String, Number], /* 文件所属主记录主键值,用于确定文件目录 */
            action: {type: String, default: '/api/file/upload'},
            value: [String, Number, Array],
            data: {type: Object, default: null},
            multiple: Boolean,
            drag: Boolean,
            dragger: Boolean,
            withCredentials: Boolean,
            showFileList: {type: Boolean, default: true},

            headers: {type: Object, default() {return {};}},
            name: {type: String, default: 'file'},
            accept: String,
            type: {type: String, default: 'select'},
            beforeUpload: Function,
            beforeRemove: Function,
            onRemove: {type: Function, default: () => 0},
            onChange: {type: Function, default: () => 0},
            onPreview: {type: Function},
            onSuccess: {type: Function, default: () => 0},
            onProgress: {type: Function, default: () => 0},
            onError: {type: Function, default: () => 0},
            fileList: {type: Array, default() {return [];}},
            autoUpload: {type: Boolean, default: true},
            listType: {type: String, default: 'text'},
            httpRequest: Function,
            disabled: Boolean,
            limit: Number,
            onExceed: {type: Function, default: () => 0}
        },
        data() {
            return {
                dataX: this.data || this.getData(),
                myFileList: this.fileList || []
            }
        },
        mounted() {
            if (this.value) {
                let v = [];
                this.value.split(',').forEach(o => {
                    v.push({name: o});
                });
                this.myFileList = v;
            }
        },
        methods: {
            getData() {
                let v = this.$parent;
                while (v && (!v.dataSource || v.actionType == null)) {
                    v = v.$parent;
                }
                if (!v.dataSourceX){
                    return;
                }
                return {
                    module: v.dataSourceX.head.module,
                    action: v.actionType,
                    key: this.docID
                }
            },
            onBeforeUpload(file) {
                this.beforeUpload && this.beforeUpload(file);
                if (file.name.indexOf(',') != -1) {
                    Message.error(file.name + '文件名中不能含有英文逗号,请改正!');
                    return false;
                }
                let fileList = this.$refs.upload.uploadFiles;
                let i = tools.arrayIndexCount(fileList, file, 'name');
                if (i > 1) {
                    Message.error('已经上传有同名的文件(' + file.name + '),请改正！');
                    return false;
                }
            },
            uploadSuccess(res, file, fileList) {
                this.onSuccess && this.onSuccess(res, file, fileList);
                if (!res || res.code !== 1) {
                    let msg = '';
                    res && res.data && res.data.fail && res.data.fail.forEach(v => {
                        let i = tools.arrayIndexOf(fileList, v.originalFileName, 'name');
                        if (i !== null) {
                            fileList.splice(i, 1);
                            msg = msg + '\n' + v.name ;
                        }
                    });
                    Message.error('文件上传失败' + msg);
                }
                let f = '';
                fileList.forEach(v => f = f + ',' + v.name);
                this.$emit('input', f !== '' && f.substr(1) || '');
                this.uploadSuccessCallBack && this.uploadSuccessCallBack(f);
            },
            remove(file, fileList) {
                this.onRemove && this.onRemove(file, fileList);
                this.dataX.name = file.name;
                http.post('/file/del', this.dataX);
                let f = '';
                fileList.forEach(v => f = f + ',' + v.name);
                this.$emit('input', f !== '' && f.substr(1) || '');
            },
            down(item){
                http.fileDown('/file/down', {module: this.dataX.module, path: this.dataX.module + '/' + this.docID + '/' + item});
            }
        }
    }
</script>
<style scoped>
    .down{
        cursor:pointer;
        color: #337AB7;
        text-decoration:underline;
    }
</style>
