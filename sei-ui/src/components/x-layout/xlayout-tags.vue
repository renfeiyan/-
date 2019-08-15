<template>
    <div class="tags-view">
        <div ref="tagsView" class="tags-outer" @mousewheel="handleScroll" @DOMMouseScroll="handleScroll">
             <el-dropdown class="xbutton" @command="handleCommand">
                <span class="el-dropdown-link">标签操作<i class="el-icon-arrow-down el-icon--right"></i></span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="closeOther">关闭其他</el-dropdown-item>
                    <el-dropdown-item command="closeAll">关闭全部</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <div class="tags-labels" ref="tagsScroll" :style="{ left: tagsScrollLeft + 'px' }">
                <x-tag v-for="(item) in visitedViews" :key="item.path" :active="item.name===viewName" closable @click="(e)=>{goto(item)}" @close="closeTag(item)">{{item.name}}</x-tag>
            </div>
            <div v-if="showSlidder" ref="swipeContainer" class="swipe-bar-container">
                <div ref="slidder" draggable="true" :style="'width:'+slidderWidth+';transform:translateX('+slidderScrollLeft+')'" @dragstart="dragSlidderStart" @drag="dragSlidderMove" @dragend="dragSlidderEnd"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import XTag from '../x-tag';
    export default {
        name: 'XLayoutTags',
        components: {XTag},
        data() {
            return {
                viewName: '',
                tagsScrollLeft: 0,
                slidderWidth: '0px',
                showSlidder: true
            };
        },
        mounted() {
            this.addViewTag();
            window.addEventListener('resize', this.checkSlidderPosition);
        },
        beforeDestroy(){
            window.removeEventListener('resize', this.checkSlidderPosition);
        },
        computed: {
            visitedViews() {
                return this.$store.getters.visitedViews;
            },
            slidderScrollLeft(){
                const tagWrapperElementWidth = this.$refs.tagsScroll ? this.$refs.tagsScroll.offsetWidth : 1, swipeContainerWidth = this.$refs.swipeContainer ? this.$refs.swipeContainer.offsetWidth : 0;
                return -this.tagsScrollLeft / tagWrapperElementWidth * swipeContainerWidth + 'px'
            }
        },
        watch: {
            $route() {
                this.addViewTag();
            }
        },
        methods: {
            dragSlidderStart(e) {
                this.clientX = e.clientX;
                let img = new Image();
                img.src = '';
                e.dataTransfer.setDragImage(img, 0, 0);
                this.$refs.slidder.style.background = '#168d58'
            },
            dragSlidderMove(e) {
                if (e.clientX === 0) {
                    return;
                }
                const absOffset = Math.abs(this.$refs.tagsScroll.offsetWidth - this.$refs.tagsView.offsetWidth + 100),
                    offset = (e.clientX-this.clientX) / this.$refs.swipeContainer.offsetWidth * this.$refs.tagsScroll.offsetWidth;
                if (offset < 0) {
                    this.tagsScrollLeft = Math.min(this.tagsScrollLeft - offset, 0)
                } else {
                    this.tagsScrollLeft = Math.max(this.tagsScrollLeft - offset, -absOffset)
                }
                this.clientX = e.clientX;
            },
            dragSlidderEnd() {
                this.$refs.slidder.style.background = '#42b983'
            },
            computeSlidderWidth() {
                this.$nextTick(() => {
                    this.slidderWidth = (this.$refs.tagsView.offsetWidth - 100) / this.$refs.tagsScroll.offsetWidth * this.$refs.swipeContainer.offsetWidth + 'px';
                })
            },
            handleCommand(command) {
                const router = this.$route;
                switch (command) {
                    case 'closeAll':
                        this.$store.dispatch('removeAllTag');
                        this.$router.push('/index/dashboard');
                        this.viewName = router.name;
                        this.addViewTag();
                        break;
                    case 'closeOther':
                        if (this.visitedViews.length === 1) {
                            break;
                        }
                        this.$store.dispatch('removeOtherTag', router);
                        break;
                    default:
                        break;
                }
            },
            closeTag(tag) {
                if (this.visitedViews.length <= 1) {
                    if (tag.path === '/index/dashboard') {
                        return;
                    }
                    this.$router.push('/index/dashboard');
                } else {
                    for (let i = 0; i < this.visitedViews.length; i++) {
                        if (this.visitedViews[i].path === tag.path) {
                            if (i === 0) {
                                this.$router.push(this.visitedViews[i + 1]);
                            } else {
                                this.$router.push(this.visitedViews[i - 1]);
                            }
                            break;
                        }
                    }
                }
                this.$store.dispatch('removeVisitedTag', tag);
            },
            goto(tag) {
                this.$router.push(tag.path);
                this.viewName = tag.name;
            },
            addViewTag() {
                const route = this.$route;
                if (!route.name) {
                    return false;
                }
                if (this.viewName!==route.name) {
                    this.$nextTick(() => this.checkSlidderPosition())
                }
                this.viewName = route.name;
                this.$store.dispatch('addVisitedTag', route);
            },
            checkSlidderPosition() {
                const tagElement=document.getElementsByClassName('x-tag active ')[0], tagContainerElement=this.$refs.tagsView, tagWrapperElement=this.$refs.tagsScroll;
                if (tagWrapperElement.offsetWidth <= tagContainerElement.offsetWidth - 100) {
                    this.showSlidder=false;
                    return
                } else {
                    this.showSlidder = true;
                }
                if (tagElement.offsetLeft+tagWrapperElement.offsetLeft<10){
                    this.tagsScrollLeft=this.tagsScrollLeft-(tagElement.offsetLeft+tagWrapperElement.offsetLeft-10);
                } else if (tagElement.offsetLeft+tagWrapperElement.offsetLeft+tagElement.offsetWidth+4>tagContainerElement.offsetWidth-100) {
                    this.tagsScrollLeft=this.tagsScrollLeft-(tagElement.offsetLeft+tagWrapperElement.offsetLeft+tagElement.offsetWidth+4-(tagContainerElement.offsetWidth-100))
                } else if (tagWrapperElement.offsetLeft<0&&tagWrapperElement.offsetLeft+tagWrapperElement.offsetWidth<=tagContainerElement.offsetWidth-100) {
                    this.tagsScrollLeft=this.tagsScrollLeft-(tagWrapperElement.offsetLeft+tagWrapperElement.offsetWidth-(tagContainerElement.offsetWidth-100))
                } else if (tagWrapperElement.offsetLeft>=0&&tagWrapperElement.offsetLeft+tagWrapperElement.offsetWidth<=tagContainerElement.offsetWidth-100) {
                    this.tagsScrollLeft=0;
                }
                this.computeSlidderWidth();
            },
            handleScroll(event) {
                let type = event.type;
                let delta = 0;
                if (type === 'DOMMouseScroll' || type === 'mousewheel') {
                    delta = event.wheelDelta ? event.wheelDelta : -(event.detail || 0) * 40;
                }
                let left = 0;
                if (delta > 0) {
                    left = Math.min(0, this.tagsScrollLeft + delta);
                } else {
                    if (this.$refs.tagsView.offsetWidth - 100 < this.$refs.tagsScroll.offsetWidth) {
                        if (this.tagsScrollLeft < -(this.$refs.tagsScroll.offsetWidth - this.$refs.tagsView.offsetWidth + 100)) {
                            left = this.tagsScrollLeft;
                        } else {
                            left = Math.max(this.tagsScrollLeft + delta, this.$refs.tagsView.offsetWidth - this.$refs.tagsScroll.offsetWidth - 100);
                        }
                    } else {
                        this.tagsScrollLeft = 0;
                    }
                }
                this.tagsScrollLeft = left;
            }
        }
    };
</script>

<style lang="less" scoped>
    .xbutton {
        height: 34px;
        color: #fff;
        border-color: #42b983;
        background-color: hsl(153, 73%, 32%);
        border-radius: 0;
        position: absolute;
        right: 0;
        font-size: 12px;
        text-align: center;
        line-height: 34px;
        width: 100px;
        z-index: 999;
    }
    .tags-view {
        width: 100%;
        height: 34px;
        position: relative;
        top: 0;
        left: 0;
        z-index: 3;
        border-bottom: 1px solid #e6e6e6;
        box-sizing: border-box;
        &:hover .swipe-bar-container{
            opacity: 1;
        }
        .swipe-bar-container{
            opacity:0;
            transition: opacity 0.5s ease-in-out;
            width: 100%;
            height: 6px;
            top: 33px;
            cursor: pointer;
            position: absolute;
            border-radius: 10px;
            background: #e4e4e4;
            &:hover{
                opacity: 1;
                height: 12px;
            }
            &>div{
                height:100%;
                position:relative;
                background: #42b983;
                border-radius: 10px;
            }
        }
        .tags-outer {
            width: 100%;
            height: 100%;
            position: relative;
            box-sizing: border-box;
            padding-right: 120px;
            .tags-labels {
                height: 100%;
                box-sizing: border-box;
                padding: 2px 10px;
                position: absolute;
                white-space: nowrap;
                .x-tag {
                    transition: all 0.3s;
                    border-radius: 2px;
                    margin: 1px 4px 0 0;
                    user-select: none;
                }
            }
        }
    }
</style>
