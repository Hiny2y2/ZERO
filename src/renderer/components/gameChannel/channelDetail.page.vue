<template>
    <div class="channel-detail">
        <div class="detail-head">
            <span @click="back2channel">返回</span>
            <div class="detail-name">{{detail.name}}</div>
        </div>
        <div class="detail-main"
            :style="{backgroundImage: `url(${imgSrc})`}"
        >
            <div class="detail-handle">
                <span>{{detail.current}}/{{detail.total}}</span>
                <span><i class="el-icon-right"></i></span>
            </div>
        </div>
        <div class="detail-footer">
            {{detail.desc}}
        </div>
    </div>
</template>

<script>
import publicText from '@/assets/js/publicText.service'

export default {
    components: { 

    },
    data(){
        return {
            detail: {},
            imgSrc: require('@/assets/img/20200810_yyc_325_1.jpg')
        }
    },
    methods: {
        back2channel(){
            this.$router.push({path: '/gameChannel'})
        }
    },
    created(){
        this.detail= this.$route.params
    }
  
};
</script>

<style lang="stylus">
/* CSS */
  @import '~@/assets/css/common.styl'
    .channel-detail
        height 100%
        .detail-head
            height 10%
            display flex
            align-items center
            position relative
            .detail-name
                positionCenter()
        .detail-main
            height 60%
            border-top 1px solid #ccc
            border-bottom 1px solid #ccc
            position relative
            background-size 100% 100%
            .detail-handle
                width 100%
                position absolute
                bottom 0
                display flex
                justify-content space-between
                padding 0 5px
                background #00000078
        .detail-footer
            height 30%
            font-size fontBig
</style>
