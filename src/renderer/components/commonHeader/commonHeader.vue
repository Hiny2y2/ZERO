<template>
  <div class="commonHeader">
      <div class="drag-able"></div>
      <div class="header-profilePhoto"
        @click="openUserInfo"
      >
          <img 
          :src="headimgUrl" 
          alt="">
      </div>
      <div class="header-name">
          <div class="header-id">
                {{$store.state.user.userInfo.userName}}
          </div>
          <div class="header-sign">
                {{$store.state.user.userInfo.signature}}
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
                    
                >
                    <p><span class="subText">查找好友</span></p>
                    
                    <ul>
                        <li
                            v-for="friendUSER in friendList"
                            :key="friendUSER.friendId"
                            @click="openFriend(friendUSER)"
                        >{{friendUSER.friendName}}</li>
                    </ul>

                </div>
                <div class="result-item"
                    
                >
                    <p><span class="subText">陌生人</span></p>
                    <ul>
                        <li
                            v-for="user in usrList"
                            :key="user.id"
                            @click="openStanger(user)"
                        >{{user.username}}</li>
                    </ul>
                </div>
                <div class="result-item"
                    @click="searchHandle('3')"
                >
                    <p><span class="subText">搜服务器</span></p>
                    
                    <ul>
                        <li
                            v-for="rooms in roomList"
                            :key="rooms.id"
                            @click="enterRoom(rooms)"
                        >{{rooms.name}}</li>
                    </ul>

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
      <friend-basic-info
        ref="friendBasicInfoDialog"
      >

      </friend-basic-info>
  </div>
</template>

<script>
    import userInfo from './components/userInfo.dialog'
    import addFriendDialog from '@/components/chatPanel/components/addFriend.dialog'
    const {ipcRenderer: ipc} = require('electron');
    import publicText from '@/assets/js/publicText.service'
    import friendBasicInfo from '@/components/chatPanel/components/friendBasicInfo.dialog'

    export default {
        name: "commonHeader",
        components: {
            userInfo,
            addFriendDialog,
            friendBasicInfo
        },
        data (){
            return {
                friendList: [],
                timer: null,
                roomList: [], //搜索到的房间列表
                usrList: [], //搜索的陌生用户列表
                searchContent: '',
                searchResShow: false, //显示下拉搜索框
                searchKey: ''
            }
        },
        methods: {
            openFriend(fri){
                this.$router.push({name: 'chatPanel', params: fri})
                this.searchResShow= false
            },
            openStanger(user){
                this.$refs.friendBasicInfoDialog.addFriend(user.id)
            },
            enterRoom(item){
                if(this.timer){
                    clearTimeout(this.timer)
                    this.timer= null
                }
                this.timer= setTimeout(()=>{
                    this.$bus.$emit('enterDetail', item)
                }, 200)
                
                // if(this.$route.name == 'gameChannel'){
                //     console.log('item')
                //     this.$bus.$emit('enterDetail', item)
                // }else{
                //     this.$router.push({name: 'channelDetail', params: item })
                // }

            },
            registerHandle(){ //注册监听事件    
                this.$bus.$on(publicText.SEARCH_USER, res=>{ //搜索好友
                    let resp= _.clone(res.users)
                    this.usrList= resp.splice(0, 4)
                })
                this.$bus.$on(publicText.SEARCH_ROOM_COPY, res=>{ //搜索好友
                    let resp= _.clone(res)
                    this.roomList= resp.roomList
                })

            },
            handleClick(event){
                if(this.$refs.searchWrap && !this.$refs.searchWrap.contains(event.target)){
                    this.searchResShow= false
                }
            },
            searchHandle(key){
                switch(key){
                    case '1': //搜好友
                        // let param= {
                        //     name: this.searchKey
                        // }
                        // this.$router.push({name: 'chatPanel', params: param})
                        break;
                    case '2':  //搜陌生人(其实是添加好友)
                        this.$refs.addFriendDialog.dialogVisible= true
                        // this.$router.push({name: 'chatPanel', params: param})
                        break;
                    case '3':  //搜服务器
                        if(this.$route.name == 'gameChannel'){ //如果当前路由在游戏频道
                            this.$bus.$emit('searchChannel', {name: this.searchKey})
                        }else{
                            this.$router.push({name: 'gameChannel', params: {
                                name: this.searchKey
                            }})

                        }
                        break;
                }
                this.searchResShow= false
            },
            openUserInfo(){
                let msg= `{type: "getUserBasicInfo"}`
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
        computed:{
            headimgUrl(){
                let src= '1'
                if(this.$store.state.user.userInfo.figure && this.$store.state.user.userInfo.figure !== 'null'){
                    src= this.$store.state.user.userInfo.figure
                }
                return require(`@/assets/img/headimg/${src}.jpg`)
            }
        },
        mounted(){
            document.addEventListener('click', this.handleClick)
            this.registerHandle()
            
            ipc.send('receiving-broadcast')
        },
        watch: {
            searchKey(val){
                if(val != ''){
                    let storeList= this.$store.state.user.friendsList;
                    this.friendList= []
                    for(let i in storeList){
                        storeList[i].person.forEach(item=>{
                            if(item.friendName.indexOf(val) != -1){
                                this.friendList.push(item) 
                            }
                        })
                    }
                    let searchFreind= 
                        `{type:"${publicText.SEARCH_USER_COPY}",keyword:"${val}",pageIndex:"1"}`
                    this.$ws.sendMsg(searchFreind) //搜索陌生人

                    let roomParams=
                    `{type:"${publicText.SEARCH_ROOM_COPY}",keyword:"${val}"}`
                    this.$ws.sendMsg(roomParams) //搜索房间
                }
            }
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
                margin-top 0px
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
                    padding 0 10px
                    margin 5px
                    border-bottom 1px solid #efefef
                    p
                        color black
                    li
                        &:hover
                            background #e1f5ff
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
