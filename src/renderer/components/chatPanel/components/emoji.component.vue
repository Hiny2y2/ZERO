<template>
    <div class="emoji-wrap">
        <el-scrollbar
            style="height: 100%"
        >
            <div class="emoji-item"
                v-for="item in imgSrc"
                :key="item.url"
                @click="selectEmoji(item.number)"
            >
                <img :src="item.url" alt="">
            </div>
        </el-scrollbar>
    </div>
</template>

<script>
export default {
    props: {
        imgSrc: {
            type: Array,
            default: ()=>{
                return []
            }
        }
    },
    data(){
        return {

        }
    },
    methods: {
        selectEmoji(number){
            this.$emit('change', number)
        }
    },
    components: {
        
    }
};
</script>

<style lang="stylus">
/* CSS */
  @import '~@/assets/css/common.styl'
  .emoji-wrap
    height 100%
    .emoji-item
        float left
        width 20%
        display flex
        align-items center
        justify-content center
        &:hover
            background #ccc
</style>
