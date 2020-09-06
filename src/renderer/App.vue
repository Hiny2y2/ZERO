<template>
  <div id="app">
    <div class="main-header" v-show="isLogin">
      <commonHeader></commonHeader>
    </div>
    <div class="main-content" :style="'height:' + (isLogin ? '' : '100%')">
      <div class="main-broadside" v-show="isLogin">
        <broadside></broadside>
      </div>
      <div class="main-body" :style="'width:' + (isLogin ? '' : '100%')">
        <keep-alive>
          <router-view v-if='$route.meta.keepAlive'></router-view>
        </keep-alive>
        <router-view v-if='!$route.meta.keepAlive'></router-view>
      </div>
      <div class="clear-fix"></div>
    </div>

    
  </div>
</template>

<script>
import commonHeader from '@/components/commonHeader/commonHeader'
import broadside from '@/components/broadside/broadside'
import publicText from '@/assets/js/publicText.service'
export default {
  name: "qq",
  components: {
    commonHeader,
    broadside
  },
  data(){
    return {
      isLogin: true,
    }
  },
  computed: {
    login(){
      let flag= false
      if(this.$store.state.user.isLogin){
        flag= true
      }
      console.log(this.$store.state.user.isLogin, 'flag')
      // flag= false
      return flag
    }
  },
  methods:{
    
  },
  mounted(){
    this.$bus.$on(publicText.LOGIN,(flag)=>{
      this.isLogin= flag
    })
    console.log('counter1', this.$store.state.user.isLogin)

  }
};
</script>

<style lang="stylus">
/* CSS */
  @import '~@/assets/css/common.styl'
#app
  height 100%
  background #fff
  .main-header
    height 90px
  .main-content
    height calc(100% - 90px)
    .main-broadside
      width 80px
      height 100%
      float left
    .main-body
      width calc(100% - 80px)
      height 100%
      float right
      background #001935
      >div
        width 100%
        height 100%
</style>
