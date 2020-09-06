<template>
  <div class="commonHeader">
      <div class="drag-able"></div>
      <div class="header-profilePhoto"
        @click="openUserInfo"
      >
          <img :src="require('@/assets/img/timg.jpeg')" alt="">
      </div>
      <div class="header-name">
          <div class="header-id">
                {{$store.state.user.userInfo.userName}}
          </div>
          <div class="header-sign">
                123
          </div>
          
      </div>
      <div class="header-search" ref="searchWrap">
            <el-input
                placeholder="请输入搜索内容"
                v-model="searchKey"
                @click.native="searchResShow=true"
                >
                <i slot="suffix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <div class="search-result"
                v-show="searchResShow && searchKey != ''"
            >
                <div class="result-item"
                    @click="searchHandle('1')"
                >
                    <p><span class="subText">查找好友-- </span>{{searchKey}}</p>
                </div>
                <div class="result-item"
                    @click="searchHandle('2')"
                >
                    <p><span class="subText">搜陌生人-- </span>{{searchKey}}</p>
                </div>
                <div class="result-item"
                    @click="searchHandle('3')"
                >
                    <p><span class="subText">搜服务器-- </span>{{searchKey}}</p>
                </div>

            </div>
      </div>
      <div class="display-handle">
          <span
            class="display-min"
            @click="min()"
          >-</span>
          <span
            class="display-close"
            @click="close()"
          >x</span>
          
      </div>
      <userInfo ref="userInfo"></userInfo>
      <addFriendDialog ref='addFriendDialog'></addFriendDialog>
  </div>
</template>

<script>
    import userInfo from './components/userInfo.dialog'
    import addFriendDialog from '@/components/chatPanel/components/addFriend.dialog'
    const {ipcRenderer: ipc} = require('electron');
    export default {
        name: "commonHeader",
        components: {
            userInfo,
            addFriendDialog
        },
        data (){
            return {
                searchContent: '',
                searchResShow: false, //显示下拉搜索框
                searchKey: ''
            }
        },
        methods: {
            handleClick(event){                
                if(!this.$refs.searchWrap.contains(event.target)){
                    this.searchResShow= false
                }
            },
            searchHandle(key){
                switch(key){
                    case '1': //搜好友
                        let param= {
                            name: this.searchKey
                        }
                        this.$router.push({name: 'chatPanel', params: param})
                        break;
                    case '2':  //搜陌生人(其实是添加好友)
                        this.$refs.addFriendDialog.dialogVisible= true
                        // this.$router.push({name: 'chatPanel', params: param})
                        break;
                }
                this.searchResShow= false
            },
            openUserInfo(){
                let msg= `{type: "getUserBasicInfo"}`
                // console.log(msg)
                this.$ws.sendMsg(msg)
                this.$refs.userInfo.showDialog= true
            },
            min(){
                console.log(ipc)
                ipc.send('min')

            },
            close(){
                console.log(ipc)
                ipc.send('close')
            }
        },
        mounted(){
            document.addEventListener('click', this.handleClick)
            console.log(this.$router, '$router')
        },
        watch: {
            // $router(to, fromPath){
            //     console.log(to)
            // }
        }
    };
</script>

<style lang="stylus">
  @import '~@/assets/css/common.styl'
    .commonHeader
        height 100%
        background linear-gradient(to right, #003470   0%, #330031  50%, #001935  100%)
        display flex
        align-items center
        position relative
        -webkit-app-region drag
        z-index 3
        .drag-able
            position absolute
            top 0 
            left 0
            height 20px 
            z-index 3
            width 100%
            
        .header-profilePhoto
            margin-left 10px
            width 60px
            height 60px
            border-radius 50%
            overflow hidden
            -webkit-app-region no-drag
            img
                width 100%
                height 100%
                -webkit-user-drag none
        .header-name
            font-size fontMd
            margin-left 10px
            .header-id
                font-size fontBig
            .header-sign
                font-size 18px
                color #ccc
                margin-top -5px
        .header-search
            position absolute
            left 50%
            transform translate(-80%, 0)
            min-width 350px
            position relative
            -webkit-app-region no-drag
            .el-input
                opacity .8
            .search-result
                padding 10px 0
                background #fff
                position absolute
                top 40px
                width 100%
                color #0051ad
                .result-item
                    padding 10px
                    &:hover
                        background #e6a23c
                        color #000
                        cursor default
                    .subText
                        font-size fontSm
        .display-handle
            position absolute 
            right 20px
            top 20px
            height 20px
            z-index 4
            -webkit-app-region no-drag
            span
                padding 0px 20px
                color #fff
                -webkit-user-drag none
                cursor default
                font-size 30px
                -webkit-app-region no-drag
            .display-min
                &:hover
                    background #abb2f7
            .display-close
                &:hover
                    background rgb(255, 93, 93)
</style>
