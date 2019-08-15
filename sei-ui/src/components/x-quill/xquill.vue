<template>
    <div class="quill-editor">
        <slot name="toolbar"></slot>
        <div ref="editor"></div>
    </div>
</template>

<script>
    import 'quill/dist/quill.core.css'
    import 'quill/dist/quill.snow.css'
    import 'quill/dist/quill.bubble.css'
    import {ImageDrop} from 'quill-image-drop-module';
    import imageResize from 'quill-image-resize-module';
    import _Quill from 'quill'
    import defaultOptions from './options'
    const Quill = window.Quill || _Quill;
    Quill.register('modules/imageDrop', ImageDrop);
    Quill.register('modules/imageResize', imageResize);
    import http from '../../utils/http';

    // pollfill
    if (typeof Object.assign != 'function') {
        Object.defineProperty(Object, 'assign', {
            value(target) {
                if (target == null) {
                    throw new TypeError('Cannot convert undefined or null to object')
                }
                const to = Object(target);
                for (let index = 1; index < arguments.length; index++) {
                    const nextSource = arguments[index];
                    if (nextSource != null) {
                        for (const nextKey in nextSource) {
                            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                                to[nextKey] = nextSource[nextKey]
                            }
                        }
                    }
                }
                return to
            },
            writable: true,
            configurable: true
        })
    }

    export default {
        name: 'XQuill',
        data() {
            return {
                myOptions: {},
                myContent: ''
            }
        },
        props: {
            attFile: {type: Object, default: () => ({})}, /* 附件配置项,{module:'模块编号', key:'文档编号(即文档主键值)',action:'当前操作类型'} */
            action: {type: String, default: '/file/upload'}, /* 上传图片的地址 */
            content: String, /* 内容 */
            value: String, /* v-model内容 */
            disabled: {type: Boolean, default: false},
            options: {type: Object, required: false, default: () => ({})} /* 配置参数 */
        },
        mounted() {
            this.initialize()
        },
        beforeDestroy() {
            this.quill = null;
            delete this.quill
        },
        methods: {
            initialize() {
                if (this.$el) {
                    this.myOptions = Object.assign({}, defaultOptions, this.options);
                    this.quill = new Quill(this.$refs.editor, this.myOptions);
                    this.quill.enable(false);
                    if (this.value || this.content) {
                        this.quill.pasteHTML(this.value || this.content)
                    }
                    if (!this.disabled) {
                        this.quill.enable(true)
                    }
                    this.quill.on('selection-change', range => {
                        if (!range) {
                            this.$emit('blur', this.quill)
                        } else {
                            this.$emit('focus', this.quill)
                        }
                    });
                    this.quill.on('text-change', () => {
                        let html = this.$refs.editor.children[0].innerHTML;
                        const quill = this.quill;
                        const text = this.quill.getText();
                        if (html === '<p><br></p>') {
                            html = '';
                        }
                        this.myContent = html;
                        this.$emit('input', this.myContent);
                        this.$emit('change', {html, text, quill})
                    });

                    let toolbar = this.quill.getModule('toolbar');
                    toolbar.addHandler('image', () => {
                        let fileInput = this.quill.container.querySelector('input.ql-image[type=file]');
                        if (fileInput == null) {
                            fileInput = document.createElement('input');
                            fileInput.style.display = 'none';
                            fileInput.setAttribute('type', 'file');
                            fileInput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon');
                            fileInput.classList.add('ql-image');
                            fileInput.addEventListener('change', () => {
                                if (fileInput.files != null && fileInput.files[0] != null) {
                                    let formData = new FormData();
                                    formData.append('isRename', true);
                                    Object.keys(this.attFile).forEach(key => {
                                        formData.append(key, this.attFile[key]);
                                    });
                                    formData.append('file', fileInput.files[0], fileInput.files[0].name);
                                    http.fileUpload(this.action || '/file/upload', formData).then((res) => {
                                        let range = this.quill.getSelection(true);
                                        this.quill.insertEmbed(range.index, 'image', '/api/file/see/' + this.attFile.module + '/' + this.attFile.key + '/' + res.data.success[0].newFileName);
                                        this.quill.setSelection(range.index + 1);
                                        fileInput.value = '';
                                    })
                                }
                            });
                            this.quill.container.appendChild(fileInput);
                        }
                        fileInput.click();
                    });
                    this.$emit('ready', this.quill)
                }
            }
        },
        watch: {
            content(newVal) {
                if (this.quill) {
                    if (newVal && newVal !== this.myContent) {
                        this.myContent = newVal;
                        this.quill.pasteHTML(newVal)
                    } else if (!newVal) {
                        this.quill.setText('')
                    }
                }
            },
            value(newVal) {
                if (this.quill) {
                    if (newVal && newVal !== this.myContent) {
                        this.myContent = newVal;
                        this.quill.pasteHTML(newVal)
                    } else if (!newVal) {
                        this.quill.setText('')
                    }
                }
            },
            disabled(newVal) {
                if (this.quill) {
                    this.quill.enable(!newVal)
                }
            }
        }
    }
</script>
