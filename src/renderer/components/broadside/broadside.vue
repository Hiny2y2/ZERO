<template>
  <div class="broadside">
        <div class="broadside-item"
      :class="[ $route.name == 'chatPanel' ? 'item-active' : null ]"
    >
        <img :src="require('@/assets/img/broadside/ziyuan.png')" alt=""
          @click="jumpTo('/chatPanel');active=2"
        >
    </div>

    <div class="broadside-item"
      :class="[ $route.name == 'gameChannel' ? 'item-active' : null ]"
    >
        <img :src="require('@/assets/img/broadside/world.png')" alt=""
          @click="jumpTo('/gameChannel');active=1"
        >
    </div>

    <div class="broadside-item"
      :class="[ $route.name == 'pyq' ? 'item-active'  : null ]"
    >
        <img :src="require('@/assets/img/broadside/pengyouquan.png')" alt=""
          @click="jumpTo('/pyq');active=3"
        >

        <!-- <i
            class="el-icon-basketball"
            @click="jumpTo('/pyq')"
        ></i> -->
    </div>
    <!-- <div class="broadside-item"
      :class="[ active == 4 ? 'item-active' : null ]"

    >
        <img :src="require('@/assets/img/broadside/pengyouquan.png')" alt=""
          @click="jumpTo('/login');active=4"
        >
    </div> -->

    <div class="broadside-item">
      <el-dropdown
         trigger="click"
         @command="handleCommand"
      >
        <img :src="require('@/assets/img/broadside/shezhi.png')" alt=""
        >
        <el-dropdown-menu slot="dropdown"
          
        >
          <el-dropdown-item
             command="setting"
          >设置
          </el-dropdown-item>
          <el-dropdown-item
             command="changeUser"
          >切换账号
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <setting-dialog ref="setting"></setting-dialog>
        <!-- <i 
            class="el-icon-setting"
        ></i> -->
    </div>

  </div>
</template>

<script>
import settingDialog from '@/components/setting/setting.dialog'
import publicText from '@/assets/js/publicText.service'
export default {
  components: { 
    settingDialog
  },
  data(){
    return {
      active: 1,
    }
  },
  methods: {
    handleCommand(key){
      console.log(key, 'key')
      if(key == 'setting'){
        this.$refs.setting.dialogVisible= true
      }else if(key == 'changeUser'){ //切换账号
        this.$bus.$emit(publicText.LOGIN, false)
        this.$router.push({path: '/login'})
      }
    },
    jumpTo(url){
      this.$router.push({path: url})
    }
  }
  
};
</script>

<style lang="stylus">
/* CSS */
  @import '~@/assets/css/common.styl'
  .broadside
    height 100%
    background #003470
    position relative
    -webkit-app-region drag
    .item-active
      position relative
      &:before
        content ''
        position absolute
        opacity 1
        left 50%
        top 50%
        transform translate(-50%, -50%)
        transition all .4s
        width 90%
        height 100%
        border-radius 100px
        background #AD5C00
      &:hover::before
        opacity 1
        width 100%
        height 100%
        border-radius 10px

    .broadside-item
        font-size 40px
        text-align center
        height 50px
        display flex
        justify-content center
        align-items center
        position relative
        user-select none
        margin-bottom 5px
        -webkit-app-region none
        &:after
          content ''
          position absolute
          opacity 0
          left 50%
          top 50%
          transform translate(-50%, -50%)
          transition all .4s
          width 90%
          height 100%
          border-radius 100px
          background #AD5C00
        &:hover::after
          opacity 1
          width 100%
          height 100%
          border-radius 10px

        img
          width 40px
          height 40px
          z-index 1
    .broadside-item:nth-last-child(1)
        position absolute
        width 100%
        bottom 5px
        .el-dropdown
          z-index 1
</style>
