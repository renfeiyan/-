<template>
    <x-splitter ref="splitter" layout="vertical">
        <template slot="1">
            <textarea ref="code" v-bind="$attrs" class="code" v-model="code"></textarea>
        </template>
        <template slot="2" style="overflow: hidden">
            <x-table-edit style="height:100%" ref="xtable" class="resultTab" border :data="rows" :edit="false">
                <el-table-column :prop="key" :label="key" v-for ="(val, key) in rows[0]" :key="key" :showOverflowTooltip="false"></el-table-column>
            </x-table-edit>
        </template>
    </x-splitter>
</template>

<script>
    import XTableEdit from '../x-table-edit';
    import xcode from './xcode';
    import http from '../../utils/http';
    import XSplitter from '../x-splitter';
    require('codemirror/addon/hint/sql-hint');
    require('codemirror/mode/sql/sql');
    export default {
        name: 'XCodeEditSql',
        components: {XTableEdit, XSplitter},
        mixins: [xcode],
        data () {
            return {
                mime: 'text/x-mariadb',
                hintOptions: [],
                rows: []
            }
        },
        created(){
            this._getDBTableField();
        },
        methods: {
            _getDBTableField() {
                http.post('/cache/getAllTableAllFieldsName', {}).then((res) => {
                    if (res && res.code === 1) {
                        this.hintOptions = res.data;
                        this.cminstance && this.cminstance.setOption('hintOptions', this.hintOptions);
                    }
                });
            },
            run() {
                let query = {sql: this.getCode(), page: 1, size: 10};
                http.post('/data/querySQL', query).then(res => {
                    if (res.code == 1) {
                        this.rows = JSON.parse(res.data.rows);
                        this.$refs.xtable.total = res.data.total;
                    }
                });
            }
        }
    }
</script>
<style scoped>
    .code {
        height: 100%;
        width: 100%;
        font-size: 11pt;
        font-family: Consolas, Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, serif;
    }
</style>
<style >
    .CodeMirror-hints{
        z-index: 100000!important;
    }
    .code + .cm-s-default{
        height: 100%!important;
    }
    .resultTab>.el-table th>.cell, .resultTab>.el-table td>.cell{
        white-space: nowrap;
    }
</style>
