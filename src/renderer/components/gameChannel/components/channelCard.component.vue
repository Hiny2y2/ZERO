<template>
    <div class="channelCard">
        <div
            class="cover"
            :style="{'background-image': `url(${require('@/assets/img/999.jpeg')})`}"
        >
            <div class="cover-detail">...</div>
            <div class="cover-mask">
                <div class="el-icon-video-play" @click="jump2detail"></div>
            </div>
        </div>
        <div class="channelInfo">
            <span class="locked" v-show="roomDetail.isEncrp">
                <i class="el-icon-lock"></i>
            </span>
            <span class="map-name">{{roomDetail.name}}</span>
            <span class="online-number">{{roomDetail.total}}人</span>
        </div>
        <div class="bottom">
            <div class="bottom-left">
                <div class="bottom-like">
                    <img
                        v-show="!like"
                        title="赞一个"
                        :src="require('@/assets/img/article/dianzan_1.png')"
                        alt
                    />
                    <img
                        title="取消赞"
                        v-show="like"
                        :src="require('@/assets/img/article/dianzan.png')"
                        alt
                    />
                </div>
            </div>
            <div class="bottom-right">
                <div class="bottom-download">
                    <i class="el-icon-download"></i>
                </div>
            </div>
        </div>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
            <span>
                <el-input v-model="pwd" placeholder="请输入密码"></el-input>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="enterJump">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
export default {
    components: {},
    props: {
        roomDetail: {
            type: Object,
            default (){
                return {}
            }
        }
    },
    data() {
        return {
            pwd: '', //房间密码
            like: false,
            dialogVisible: false
        };
    },
    methods: {
        handleClose(){
            this.pwd= ''
             
        },
        enterJump(){ //有密码房间确认进入
            if(this.roomDetail.roomDetail.isEncrp){ //如果房间有密码
                
            }else{
                this.$router.push({name: 'channelDetail', params: this.roomDetail })

            }

        },
        jump2detail(){
            if(this.roomDetail.roomDetail.isEncrp){ //如果房间有密码
                this.dialogVisible= true
            }else{
                this.$router.push({name: 'channelDetail', params: this.roomDetail })
            }
        }
    },
};
</script>

<style lang="stylus">
/* CSS */
@import '~@/assets/css/common.styl'
.channelCard
    height 100%
    border 1px solid #074dce
    .cover
        height 170px
        background-size 100% 100%
        position relative
        .cover-detail
            position absolute
            z-index 2
            right 10px
            top 10px
            width 30px
            height 15px
            line-height 5px
            text-align center
            cursor pointer
            background #fff
            color black
        .cover-mask
            width 100%
            height 100%
            position absolute
            background #484848
            opacity 0.5
            z-index 1
            &:hover
                background #000
            &>div
                position absolute
                left 50%
                top 50%
                transform translate(-50%, -50%)
                font-size 80px
                transition all 0.2s
                &:hover
                    transform translate(-50%, -50%) scale(1.2)
    .channelInfo
        font-size fontMd
        height 40px
        line-height 40px
        padding 0 5px
        border-bottom 1px solid #16399c
        color #039eff
        .online-number
            float right
    .bottom
        height 40px
        display flex
        .bottom-left
            width 50%
            padding-left 10px
        .bottom-right
            width 50%
            padding-right 10px
            text-align right
        .bottom-like
            width 30px
            height 30px
            img
                height 100%
                height 100%
        .bottom-download
            font-size 25px
</style>
