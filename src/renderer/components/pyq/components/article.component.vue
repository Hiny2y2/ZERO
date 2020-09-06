<template>
    <div class="article-wrap">
        <div class="article-head">
            <div class="head-img">
                <!-- <el-avatar :size="50" :src="require(articleItem.circleUrl)"></el-avatar> -->
                <el-avatar :size="50" :src="require('@/assets/img/xiaomai.jpg')"></el-avatar>

            </div>
            <div class="head-name" v-if="articleItem && articleItem.hasOwnProperty('name')">
                {{articleItem.name || ''}}
            </div>
            <div class="head-time">
                {{time}}
            </div>
        </div>
        <div class="article-content" v-if="articleItem.hasOwnProperty('content')">
            <div class="article-text" >
                {{articleItem.content || ''}}
            </div>
            <div class="article-photo"
                v-show="articleItem.picList.length > 0"
            >
                <el-image 
                    v-for="Pics in articleItem.picList"
                    :key="Pics"
                    style="width: 30.5%; height: 120px; margin: 10px"
                    :src="Pics" 
                    :preview-src-list="articleItem.picList">
                </el-image>
            </div>
        </div>
        <div class="article-handle">
            <div class="article-like"
                @click="dianzan()"
            >
                <img v-show="!like"
                    title="赞一个"
                 :src="require('@/assets/img/article/dianzan_1.png')" alt="">
                <img 
                    title="取消赞"
                v-show="like" :src="require('@/assets/img/article/dianzan.png')" alt="">
            </div>
            <div class="article-reply"
                @click="isReply= !isReply"
            >
                回复ta
            </div>
        </div>
        <div class="article-input"
            v-show="isReply"
        >
            <el-input
                type="textarea"
                :rows="2"
                :placeholder="'回复'+articleItem.name + ':'"
                :resize="'none'"
                v-model="textarea">
            </el-input>
            <el-button
                @click="replyMsg()"
            >
                发表回复
            </el-button>
        </div>
        <div class="article-replyList">
            <div class="replyList-item"
                v-for="(replyItem, i) in articleItem.replies"
                :key="i"
            >
                <span class="replyList-name">{{replyItem.userName}}: </span>
                <span class="replyList-msg">{{replyItem.message}} ({{replyItem.customTime}})</span>
            </div>

        </div>
    </div>
</template>

<script>
export default {
    props: ['articleItem'],
    data(){
        return {
            time: '未知时间',
            isReply: false,
            textarea: '',
            like: false,
            // articleItem: {
            //     picList: [
            //         require('@/assets/img/article/u=640848356,2826851005&fm=26&gp=0.jpg'),
            //         require('@/assets/img/article/u=943522197,4143393355&fm=26&gp=0.jpg'),
            //         require('@/assets/img/article/u=1830914723,3154965800&fm=26&gp=0.jpg'),
            //         require('@/assets/img/article/u=2240119569,3513825766&fm=15&gp=0.jpg'),
            //         require('@/assets/img/article/u=2277222197,3793263302&fm=15&gp=0.jpg'),
            //         require('@/assets/img/article/u=2478011503,1975586342&fm=26&gp=0.jpg'),
            //         require('@/assets/img/article/u=4015697866,1026071628&fm=26&gp=0.jpg'),
            //         require('@/assets/img/article/u=4286944916,3156001358&fm=15&gp=0.jpg'),

            //     ],
            //     content: '蛋蛋的忧桑',
            //     circleUrl: require('@/assets/img/um0.jpg'),
            //     name: '老王'
            // }
        }
    },
    components: {

    },
    methods: {
        replyMsg(){ //发送回复
            let params= `{type:"replyTalk", toMsgId:"${this.articleItem.id}",talk:"${this.textarea}"}`
            this.$ws.sendMsg(params)
            this.textarea= ''
            this.$emit('sendMsg')
        },
        dianzan(){ //点赞
            let msg=''
            if(!this.like){ //如果是未点赞状态
                msg= `{type:"agreeTalk", msgId:"${this.articleItem.id}"}`
            }else{
                let id= ''
                for(let i in this.articleItem.agreeList){
                    if(this.articleItem.agreeList[i].userName == this.$store.state.user.userInfo.userName){
                        id= this.articleItem.agreeList[i].id
                    }
                    
                }
                msg= `{type:"cancelAgreeTalk", agreeId:"${id}"}`
            }
            this.$ws.sendMsg(msg)
            this.like= !this.like
        }
    },
    created(){
        if(this.articleItem && this.articleItem.hasOwnProperty('agreeList')){
            for(let i in this.articleItem.agreeList){
                if(this.articleItem.agreeList[i].userName == this.$store.state.user.userInfo.userName){
                    this.like= !this.like
                }
            }
            for(let i in this.articleItem.replies){
                this.articleItem.replies[i].customTime= this.$moment(this.articleItem.replies[i].createTime)
                            .format('YYYY-MM-DD HH:mm:ss')
            }
        }
        if(this.articleItem && this.articleItem.hasOwnProperty('createTime')){
            this.time= this.$moment(this.articleItem.createTime)
                            .format('YYYY-MM-DD HH:mm:ss')
        }
        console.log(this.articleItem.createTime, 'this.articleItem')
    }
  
};
</script>

<style lang="stylus">
/* CSS */
  @import '~@/assets/css/common.styl'
  .article-wrap
    padding 10px
    margin-bottom 10px
    break-inside avoid
    background #fff
    .article-head
        display flex
        align-items center
        position relative
        color black
        .head-name
            margin-left 10px
            font-size fontMd
            margin-top -40px
        .head-time
            position absolute
            bottom 15px
            left 60px
            font-size 12px
    .article-content
        margin-bottom 10px
        color rgb(20, 23, 26)
        .article-text
            font-size fontMd
    .article-handle
        display flex
        color black
        .article-like
            width 20px
            height 20px
            img
                width 100%
                height 100%
        .article-reply
            cursor pointer
    .article-input
        display flex
        .el-button
            background #cff
    .article-replyList
        padding-left 15px
        border-left 1px solid #92d7ff
        font-size 14px
        color #5a5a5a
        background #eee
        .replyList-item
            margin-top 5px
</style>
