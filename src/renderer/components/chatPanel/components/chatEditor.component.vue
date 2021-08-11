<template>
    <div class="chat-editor-component">
        <div class="emoji-panel"
            v-show="emojiShow"
        >
            <emoji-component
                :imgSrc="imgSrc"
                @change="sendEmoji"
                 v-clickoutside="handleClick"
            ></emoji-component>
        </div>
        <div class="chat-editor-bar">
            <!-- <span
                class="bar-item"
                @click="sendImg"
            >
                <el-upload
                    action="https"
                    ref="uploadImg"
                    :auto-upload="false"
                    :show-file-list="false"
                    :on-change="beforeUploadImg"
                    >
                    <i class="el-icon-picture-outline"></i>
                </el-upload>
            </span> -->
            <span
                class="bar-item"
                @click="openEmoji"
            >
                <img :src="require('@/assets/img/emoji/emoji.png')" alt="">
            </span>
        </div>
        <div class="chat-editor-content"
        >
            <v-text-editor-div 
                v-model='msg' 
                placeholder="请输入内容，按Enter键发送"
                @enter="sendMsg"
            ></v-text-editor-div>
        </div>
    </div>
</template>

<script>
import vTextEditorDiv from '@/components/common/vTextEditorDiv.component'
import emojiComponent from './emoji.component'
// import Clickoutside from '@/assets/js/clickOutSide'
import Clickoutside from "element-ui/src/utils/clickoutside";

export default {
    directives: {
        Clickoutside
    },
    data(){
        return {
            emojiShow: false,
            imgSrc: [],
            msg: ''
        }
    },
    created(){
        for(let i= 1; i <= 32; i++){
            this.imgSrc.push({
                    url: require(`@/assets/img/emoji/${i}.png`),
                    number: i
                }
            )
        }
    },
    methods: {
        handleClick(){
            this.emojiShow= false
        },
        sendEmoji(number){ //发送表情
            console.log(number)
            //定义表情为 $/number; 格式
            let emojiMsg= `$/${number};`
            this.emojiShow= false
            this.$emit('sendMsg', emojiMsg)
        },
        openEmoji(){
            this.emojiShow= true
        },
        beforeUploadImg(file){
            console.log(file, 'file')
            // this.imageToBase64(file.raw)
        },
        sendImg(){

        },
        handleInput($event){
            this.msg = $event.target.innerText;
            // 拓展 如果想要只需要前100位数据
            //this.msg = this.content.substring(0,100)
        },
        sendMsg(){
            this.$emit('sendMsg', this.msg)
            this.$nextTick(()=>{
                this.msg= '';
            })
            
        }
    },
    components: {
        vTextEditorDiv,
        emojiComponent
    }
};
</script>

<style lang="stylus">
/* CSS */
  @import '~@/assets/css/common.styl'
  .chat-editor-component
    height 100%
    border-top 1px solid #0051ad
    position relative
    .emoji-panel
        position absolute
        top -300px
        width 500px
        height 300px
        background #fff
    .chat-editor-bar
        height 35px
        display flex
        align-items center
        border-bottom 1px solid #063a75 
        .bar-item
            display flex
            align-items center
            &:first-child
                margin-left 5px
            &+.bar-item
                margin-left 5px
            img
                width 16px
                height 16px
    .chat-editor-content
        height calc(100% - 35px)
        overflow auto
        padding 10px
        outline none
</style>
