<template>
    <div class="chat-content-component">
        <div class="chat-head">
            {{chatPerson.personName || '|'}}
        </div>
        <div class="chat-dialogue">
            <el-scrollbar style="height: 100%" ref="chatContent">
                <!-- <div class="chat-object">
                    <div class="chat-headimg">
                        <el-avatar :size="50" :src="chatPerson.headimg"></el-avatar>
                    </div>
                    <div class="chat-item">
                        你好
                    </div>
                </div>
                <div class="chat-mine">
                    <div class="chat-headimg">
                        <el-avatar :size="50" :src="chatPerson.headimg"></el-avatar>
                    </div>
                    <div class="chat-item">
                        konnichiwa konnichiwakonnichiwakonnichiwakonnichiwakonnichiwakonnichiwakonnichiwakonnichiwa
                    </div>
                </div> -->
                <div 
                    v-for="(item, index) in chatMsg"
                    :key="index"
                    :class="[ item.type == 'mine' ? 'chat-mine' : 'chat-object']"
                >
                    <div class="chat-headimg">
                        <el-avatar :size="50" :src="chatPerson.headimg"></el-avatar>
                    </div>
                    <div class="chat-item">
                        <message :message="item.message"></message>
                    </div>
                </div>

            </el-scrollbar>
        </div>
        <div class="chat-editor">
            <chatEditor @sendMsg='sendMsg'></chatEditor>
        </div>

    </div>
</template>

<script>
import chatEditor from './chatEditor.component'
import publicText from '@/assets/js/publicText.service'
import message from './message.component'
export default {
    data(){
        return {
            chatMsg: [
                // {
                //     message: '你好',
                //     type: 'object',
                //     time: ''
                // },
                // {
                //     message: 'konnichiwakonnichiwakonnichiwa',
                //     type: 'mine',
                //     time: ''
                // },

            ],
            chatPerson: {
                //headimg
            },
        }
    },
    components: {
        chatEditor,
        message
    },
    methods: {
        getMsg(data){ //对方发来的消息
            console.log(data, 'getmsg')
            let objectMsg= {
                message: data.message,
                type: 'object',
                time: data.time
            }
            this.chatMsg.push(objectMsg)
            this.$nextTick(()=>{
                let scrollWrap= this.$refs.chatContent.$refs.wrap
                scrollWrap.scrollTop = scrollWrap.scrollHeight

            })

            //login-pos
        },
        sendMsg(e){
            if(e != ''){
                console.log(e)
                console.log(this.chatPerson, 'chatPerson')
                let msg= `{type:"${publicText.SEND_MSG}",toUserId:"${this.chatPerson.friendId}",message:"${e}"}`
                this.$ws.sendMsg(msg)
                
                let mineMsg= {
                    message: e,
                    type: 'mine',
                    time: Date.now().toString()
                }
                this.chatMsg.push(mineMsg)
                this.$nextTick(()=>{
                    let scrollWrap= this.$refs.chatContent.$refs.wrap
                    scrollWrap.scrollTop = scrollWrap.scrollHeight

                })
            }
        }
    }
};
</script>

<style lang="stylus">
/* CSS */
  @import '~@/assets/css/common.styl'
  .chat-content-component
    height 100%
    background #001935
    .chat-head
        padding 10px
        height 40px
    .chat-dialogue
        overflow auto
        height calc(65% - 40px)
        padding 10px
        .chat-object
            display flex
            margin-bottom 10px
            .chat-item
                margin-left 10px
                background #eee
                color black
                border-radius 10px
                padding 10px
                height max-content
                word-break break-word

        .chat-mine
            display flex
            margin-bottom 10px
            flex-direction row-reverse
            .chat-item
                margin-right 10px
                background #eee
                color black
                border-radius 10px
                padding 10px
                height max-content
                word-break break-word
    .chat-editor
        height 35%
</style>
