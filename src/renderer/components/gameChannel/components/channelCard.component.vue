<template>
    <div class="channelCard">
        <div
            class="cover"
            @click="jump2detail"
            :style="{'background-image': `url(${require('@/assets/img/SAO.jpeg')})`}"
        >
            <div class="cover-mask">
            </div>
        </div>
        <div class="channelInfo">
            <span class="locked" v-show="roomDetail.isEncrp">
                <i class="el-icon-lock"></i>
            </span>
            <span class="map-name">{{roomDetail.name}}</span>
            <span class="online-number">{{roomDetail.current}}/{{roomDetail.total}}</span>
        </div>
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
            like: false,
        };
    },
    methods: {
        enterJump(){ //有密码房间确认进入
            this.$router.push({name: 'channelDetail', params: this.roomDetail })


        },
        jump2detail(){
            // if(this.roomDetail.isEncrp){ //如果房间有密码
            //     this.dialogVisible= true
            // }else{
                this.$router.push({name: 'channelDetail', params: this.roomDetail })
            // }
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
            opacity 0
            z-index 1
            &:hover
                opacity .5
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
