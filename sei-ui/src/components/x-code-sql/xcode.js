
import 'codemirror/lib/codemirror.css';
/* 编辑器代码高亮css文件 */
import 'codemirror/addon/hint/show-hint.css';

import CodeMirror from 'codemirror/lib/codemirror';

import 'codemirror/addon/hint/show-hint';


// active-line.js
import 'codemirror/addon/selection/active-line.js'
// styleSelectedText
import 'codemirror/addon/selection/mark-selection.js'
import 'codemirror/addon/search/searchcursor.js'

// highlightSelectionMatches
import 'codemirror/addon/scroll/annotatescrollbar.js'
import 'codemirror/addon/search/matchesonscrollbar.js'
import 'codemirror/addon/search/searchcursor.js'
import 'codemirror/addon/search/match-highlighter.js'

// keyMap
import 'codemirror/mode/clike/clike.js'
import 'codemirror/addon/edit/matchbrackets.js'
import 'codemirror/addon/comment/comment.js'
import 'codemirror/addon/dialog/dialog.js'
import 'codemirror/addon/dialog/dialog.css'
import 'codemirror/addon/search/searchcursor.js'
import 'codemirror/addon/search/search.js'
import 'codemirror/keymap/sublime.js'

// foldGutter
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/brace-fold.js'
import 'codemirror/addon/fold/comment-fold.js'
import 'codemirror/addon/fold/foldcode.js'
import 'codemirror/addon/fold/foldgutter.js'
import 'codemirror/addon/fold/indent-fold.js'
import 'codemirror/addon/fold/markdown-fold.js'
import 'codemirror/addon/fold/xml-fold.js'

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
    name: 'xcode',
    props: {
        width: {Type: String, default: '100%'}, /* 编辑器宽度 */
        height: {Type: String, default: '100px'}, /* 编辑器高度 */
        code: String,
        theme: {type: String, default: 'default'},
        options: {type: Object, default: () => ({})},
        marker: Function,
        events: {type: Array, default: () => []}
    },
    data() {
        return {
            cminstance: null
        }
    },
    mounted () {
        this._xCodeEditInit();
    },
    beforeDestroy() {
        this.destroy()
    },
    watch: {
        options: {
            deep: true,
            handler(options) {
                for (const key in options) {
                    this.cminstance.setOption(key, options[key])
                }
            }
        },
        code(newVal) {
            this.handerCodeChange(newVal)
        }
    },
    methods: {
        getCode() {
            return this.cminstance.getValue();
        },
        _xCodeEditInit() {
            const cmOptions = Object.assign({}, {
                foldGutter: true,
                styleActiveLine: true,
                mode: this.mime,
                indentWithTabs: true,
                smartIndent: true,
                lineNumbers: true,
                matchBrackets: true,
                theme: this.theme,
                line: true,
                keyMap: 'sublime',
                autofocus: true,
                hintOptions: this.hintOptions,
                /* 自定义快捷键 */
                extraKeys: {
                    'Ctrl': 'autocomplete',
                    'F11'(cm) {
                        cm.setOption('fullScreen', !cm.getOption('fullScreen'))
                    },
                    'Esc'(cm) {
                        if (cm.getOption('fullScreen')) {
                            cm.setOption('fullScreen', false)
                        }
                    }
                }
            }, this.options);
            this.cminstance = CodeMirror.fromTextArea(this.$refs.code, cmOptions);
            if (this.code) {
                this.cminstance.setValue(this.code);
            }

            this.cminstance.setSize('width', this.width);
            this.cminstance.setSize('height', this.height);
            /* 代码自动提示功能，记住使用cursorActivity事件不要使用change事件，这是一个坑，那样页面直接会卡死 */
            this.cminstance.on('cursorActivity', () => {
                this.cminstance.showHint()
            });
            // this.cminstance.on('change', cm => {
            //     this.code = cm.getValue();
            //     if (this.$emit) {
            //         this.$emit('input', this.code);
            //     }
            // });
            // 所有有效事件（驼峰命名）+ 去重
            const tmpEvents = {};
            [
                'scroll',
                'changes',
                'beforeChange',
                'cursorActivity',
                'keyHandled',
                'inputRead',
                'electricInput',
                'beforeSelectionChange',
                'viewportChange',
                'swapDoc',
                'gutterClick',
                'gutterContextMenu',
                'focus',
                'blur',
                'refresh',
                'optionChange',
                'scrollCursorIntoView',
                'update'
            ].concat(this.events)
                .filter(e => !tmpEvents[e] && (tmpEvents[e] = true))
                .forEach(event => {
                    // 循环事件，并兼容 run-time 事件命名
                    this.cminstance.on(event, (...args) => {
                        // console.log('当有事件触发了', event, args)
                        this.$emit(event, ...args);
                        const lowerCaseEvent = event.replace(/([A-Z])/g, '-$1').toLowerCase();
                        if (lowerCaseEvent !== event) {
                            this.$emit(lowerCaseEvent, ...args)
                        }
                    })
                });
            this.unseenLineMarkers();
            this.refresh()
        },
        refresh() {
            this.$nextTick(() => {
                this.cminstance.refresh()
            })
        },
        handerCodeChange(newVal) {
            const cmValue = this.cminstance.getValue();
            if (newVal !== cmValue) {
                const scrollInfo = this.cminstance.getScrollInfo();
                this.cminstance.setValue(newVal);
                this.code = newVal;
                this.cminstance.scrollTo(scrollInfo.left, scrollInfo.top)
            }
            this.unseenLineMarkers()
        },
        unseenLineMarkers() {
            if (this.unseenLines !== undefined && this.marker !== undefined) {
                this.unseenLines.forEach(line => {
                    const info = this.cminstance.lineInfo(line);
                    this.cminstance.setGutterMarker(line, 'breakpoints', info.gutterMarkers ? null : this.marker())
                })
            }
        },
        destroy() {
            const element = this.cminstance.doc.cm.getWrapperElement();
            element && element.remove && element.remove();
        }
    }
}
