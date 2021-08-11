<template>
  <div class="chatPanel"
    @click="clickMenuFlag= false;delGroupFlag= false"
  >
      <div class="person-list">
        <div class="del-group"
            v-show="delGroupFlag"
            :style="{
                left: delGroupPos.left+'px',
                top: delGroupPos.top+'px'
            }"
            @click="delComfirmGroup"
        >删除群组</div>
        <el-scrollbar style="height:100%">
            <el-collapse v-model="activeNames" @change="handleChange">
                <el-collapse-item
                    v-for="personList in linkman"
                    :key="personList.type"
                    :title="personList.groupName" 
                    :name="personList.groupName"
                    @contextmenu.native="openDelMenu($event, personList)"
                >
                    <div
                        v-for="item in personList.person"
                        :key="item.name"
                        class="person-item"
                        @click="onChat(item);"
                        @contextmenu.prevent="openClickMenu($event, item)"
                    >
                        <div class="person-head"
                            @mouseover.stop="openLeftInfo(item, $event)"
                            @mouseleave="leaveLeftInfo()"
                            @click.stop="openFriendDetail(item)"
                        >
                            <img :src="item.headimg" alt="">
                        </div>
                        <div class="person-name">
                            {{item.personName}}
                        </div>
                        <div class="person-unread"
                            v-if="item.unread"
                        >
                            {{item.unread}}
                        </div>
                    </div>
                </el-collapse-item>
            </el-collapse>
            <!-- 好友申请列表 -->
            <div
                v-if="applyLists.length"
            >待处理好友申请：</div>
            <div
                class="apply-list-wrap"
                v-if="applyLists.length"
            >
                <div class="apply-list-item"
                    v-for="item in applyLists"
                    :key="item.id"
                >
                    <div class="apply-row">
                        <div class="A-L"
                            :title="item.fromusername"
                        >
                            {{item.fromusername}}
                        </div>
                        <div class="A-R">
                            <i class="el-icon-circle-check"
                                title="同意"
                                style="color: #67C23A; cursor: pointer"
                                @click="applyFriendHandle(item,1)"
                            ></i>
                            <i class="el-icon-circle-close"
                                title="拒绝"
                                style="color: #F56C6C; cursor: pointer"
                                @click="applyFriendHandle(item,0)"
                            ></i>
                        </div>
                    </div>
                    <div class="apply-row"
                        style="display: block"
                        v-if="item.message"
                    >
                        附加信息：
                        <div
                            class="a-sub-msg"
                        >
                            {{item.message}}
                        </div>
                        
                    </div>
                </div>
            </div>
        </el-scrollbar>
        <div class="click-menu"
            v-show="clickMenuFlag"
            :style="{
                left: clickMenuLeft+'px',
                top: clickMenuTop+'px'
            }"
        >
            <el-cascader-panel 
                v-model="clickMenuModel"  
                :props="{
                    expandTrigger: 'hover',
                }" 
                :options="ClickMenuOptions"
                @change="handleClickMenuChange"
            ></el-cascader-panel>
        </div>
        <div class="person-left-info"
        >
            left
        </div>
        <div class="person-right-info"
            @mouseenter="enterRightInfo= true"
            @mouseleave="enterRightInfo= false; leaveRightInfo()"
        >
            <div class="person-right-info-headimg">
                <el-avatar :size="100" :src="rightInfo.headimg"></el-avatar>
            </div>
            <div>{{rightInfo.personName}}</div>
            <div class="person-right-onRow">
                更多资料
            </div>
            <div class="person-right-onRow">
                修改备注
            </div>
            <div class="person-right-onRow">
                ❤️
            </div>
            <div class="person-right-multi">
                <div class="person-right-multi-button">
                    举报
                </div>
                <div class="person-right-multi-button">
                    屏蔽
                </div>
                <div class="person-right-multi-button"
                    @click="delFriendHandle"
                >
                    删除
                </div>

            </div>
        </div>
      </div>
        <!-- <div class="addFriend"
        @click="addFriendDialog()"
        >+</div> -->
        <div class="addGroup"
            @click="openAddGroupDialog()"
            
        >添加群组</div>

      <div class="chat-content">
        <div class="empty-title"
            v-show="!letsChat"
        >
            一起聊天吧～
        </div>
        <chat-content ref="chatContent"
            v-show="letsChat"
        ></chat-content>
      </div>
      <addFriendDialog
        ref="addFriend"
      ></addFriendDialog>
      <addGroupDialog
        ref="addGroup"
        @change="getFriends"
      ></addGroupDialog>
      <friend-info-dialog
        ref="friendInfoDialog"
      >

      </friend-info-dialog>
  </div>
</template>

<script>
import chatContent from './components/chatContent.component'
import addFriendDialog from './components/addFriend.dialog'
import addGroupDialog from './components/addGroup.dialog'
import publicText from '@/assets/js/publicText.service'
import friendInfoDialog from './components/friendBasicInfo.dialog'

export default {
    components: {
        chatContent,
        addFriendDialog,
        addGroupDialog,
        friendInfoDialog
    },
    data(){
        return {
            applyLists: [],
            delGroupPos: {
                left: 0,
                top: 0
            },
            delGroupFlag: false,
            focusGroup: {},
            unreadList: [], //未读的好友消息
            currentFocusPerson: {},
            clickRightFocusPerson: {}, //右键击中的好友
            clickMenuModel: '',
            ClickMenuOptions: [
                {
                    value: 'zhinan',
                    label: '移动好友至',
                    children: []
                },
                {
                    value: 'detail',
                    label: '好友信息',
                    
                },
                {
                    value: 'del',
                    label: '删除好友',
                    
                },
 
            ],
            clickMenuTop: 0, 
            clickMenuLeft: 0,
            clickMenuFlag: false, //右键菜单
            letsChat: false, 
            enterRightInfo: false, //判断鼠标是否进入右侧详情区域
            rightInfo: {},
            activeNames: '',
            linkman: [
                // {
                //     groupName: '默认好友',
                //     person: [
                //         // {
                //         //     headimg: require('@/assets/img/cat.jpg'),
                //         //     personName: 'Old KING'
                //         // },
                //     ]
                // }

            ]
        }
    },
    methods: {
        applyFriendHandle(item, flag){
            //1为同意，0为拒绝，默认同意
            let applyMsg= `{type:"approveFriend",applyId:"${item.id}"}`
            if(!flag){ //拒绝
                applyMsg= `{type:"refuseFriend",applyId:"${item.id}"}`
            }
            this.$ws.sendMsg(applyMsg)

            //再获取一下添加好友列表
            let msg= `{type: "${publicText.GET_APPLY_FRIEND_LIST}"}`
            this.$ws.sendMsg(msg)

            this.getFriends()
        },
        openFriendDetail(item){
            console.log(item)
        },
        delComfirmGroup(){
            let msg= 
            `{type:"deleteFriendGroup",friendGroupId:"${this.focusGroup.type}"}`
            this.$ws.sendMsg(msg)
            this.delGroupFlag= false
        },
        openDelMenu(event, item){
            this.focusGroup= item
            const menuMinWidth = 0
            const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
            const offsetWidth = this.$el.offsetWidth // container width
            const maxLeft = offsetWidth - menuMinWidth // left boundary
            // const left = event.clientX - offsetLeft // 15: margin right
            const left = event.clientX // 15: margin right
            if (left > maxLeft) {
                this.delGroupPos.left= maxLeft;
            } else {
                this.delGroupPos.left= left;
            }
            this.delGroupPos.top= event.clientY;
            this.delGroupFlag= true
        },
        delFriendHandle(){
            let delMsg= `{type:"${publicText.DELETE_FRIEND}",friendId:"${this.rightInfo.friendId}"}`
            this.$ws.sendMsg(delMsg)
            //删除好友后刷新好友列表
            let msg= `{type: "getFriendList"}`
            this.$ws.sendMsg(msg)

        },
        handleClickMenuChange(e){ //移动好友分组
            if(e[0] == 'del'){ //删除好友
                let msg= 
                `{type:"deleteFriend",friendId:"${this.clickRightFocusPerson.friendId}"}`
                
                this.$ws.sendMsg(msg)
                this.getFriends()
            }else
            if(e[0] == 'detail'){ //查看好友详情
                // console.log(this.clickRightFocusPerson)
                // let msg= 
                //     `{type:"${publicText.GET_FRIEND_BASIC_INFO}",friendId:"${this.clickRightFocusPerson.friendId}"}`
                // this.$ws.sendMsg(msg)
                this.$refs.friendInfoDialog.friendInfo= this.clickRightFocusPerson
                this.$refs.friendInfoDialog.open()

            }else{
                let msg= `{type:"moveFriendtoGroup",friendGroupId:"${e[1]}",friendId:"${this.clickRightFocusPerson.friendId}"}`
                this.$ws.sendMsg(msg)
                this.getFriends()

            }
            this.clickMenuFlag= false
            this.clickMenuModel= []
        },
        openClickMenu(event, itemPerson){ //右键菜单
            this.enterRightInfo= false
            this.leaveRightInfo()
            const menuMinWidth = 0
            const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
            const offsetWidth = this.$el.offsetWidth // container width
            const maxLeft = offsetWidth - menuMinWidth // left boundary
            // const left = event.clientX - offsetLeft // 15: margin right
            const left = event.clientX // 15: margin right
            if (left > maxLeft) {
                this.clickMenuLeft= maxLeft;
            } else {
                this.clickMenuLeft= left;
            }
            this.clickMenuTop= event.clientY;
            this.ClickMenuOptions[0].children= this.linkman.map(item=>{
                item.value=item.type
                item.label=item.groupName
                return item
            })
            this.clickRightFocusPerson= itemPerson
            this.clickMenuFlag= true
        },
        getMsg(){ //获取好友发来的消息
            this.$bus.$on( publicText.GET_CHAT, (data)=>{
                if(data.userId != this.currentFocusPerson.friendId){ //如果消息不是当前聚焦好友发来的
                    for(let i in this.linkman){
                        for(let j in this.linkman[i].person){
                            if(this.linkman[i].person[j].friendId == data.userId){ 
                                let num= this.linkman[i].person[j].unread
                                num++
                                this.$set(this.linkman[i].person[j], 'unread', num)
                                this.unreadList.push(data) //往未读列表添加数组
                                break
                            }
                        }
                    }
                }else{
                    this.$refs.chatContent.getMsg(data)
                }
                //friendId
                
            })
            
        },

        openAddGroupDialog(){
            this.$refs.addGroup.dialogVisible= true
        },
        addFriendDialog(){
            this.$refs.addFriend.dialogVisible= true
        },
        leaveLeftInfo(){

        },
        openLeftInfo(item, even){
            this.leaveRightInfo()
            //this.rightInfo= item
            if(even.target.className != 'person-item'){
                return
            }
            let leftInfoDiv= document.querySelector('.person-left-info')
            leftInfoDiv.style.top= even.target.offsetTop + 'px'
            leftInfoDiv.style.left=even.target.offsetLeft + 'px'
            leftInfoDiv.style.opacity= '1'

        },
        onChat(item){
            //friendId
            this.currentFocusPerson= item
            this.$refs.chatContent.chatPerson= item
            let list= _.clone(this.unreadList)
            for(let i in list){
                if(list[i].userId == this.currentFocusPerson.friendId){
                    this.$refs.chatContent.getMsg(list[i])
                    this.unreadList.splice(i, 1)
                    for(let x in this.linkman){
                        for(let j in this.linkman[x].person){
                            if(this.linkman[x].person[j].friendId == this.currentFocusPerson.friendId){
                                this.linkman[x].person[j].unread= 0
                            }
                        }
                    }
                }
            }
            this.letsChat= true
        },
        leaveRightInfo(){
            if(!this.enterRightInfo){ //如果鼠标没有进入弹出的右侧详情区域 就关闭
                let rightInfoDiv= document.querySelector('.person-right-info')
                rightInfoDiv.style.opacity= '0'
                rightInfoDiv.style.zIndex= '-1'
            }
        },
        openRightInfo(item, even){
            if(even.target.className != 'person-item'){
                return
            }
            this.enterRightInfo= true
            this.rightInfo= item
            let rightInfoDiv= document.querySelector('.person-right-info')
            rightInfoDiv.style.top= even.target.offsetTop + 'px'
            rightInfoDiv.style.left=even.target.offsetLeft + even.target.offsetWidth + 'px'
            rightInfoDiv.style.zIndex= '3'
            rightInfoDiv.style.opacity= '1'
        },
        handleChange(){

        },
        applyListener(){//监听好友申请
            this.$bus.$on(publicText.GET_APPLY_FRIEND_LIST, resx=>{
                // this.$message('收到好友申请')
                console.log(resx,'resx2222')
                this.applyLists= resx.data.applies
                this.getFriends()
            })
            let msg= `{type: "${publicText.GET_APPLY_FRIEND_LIST}"}`
            this.$ws.sendMsg(msg)


        },
        getFriends(){ //获取好友
            let msg= `{type: "getFriendList"}`
            this.$ws.sendMsg(msg)
            this.$bus.$on(publicText.GET_FRIEND_LIST, (res)=>{
                this.linkman= []
                this.linkman.push({
                    groupName: '默认分组',
                    type: 0,
                    person: []

                })
                for(let i in res.friendsType){
                    this.linkman.push({
                        groupName: res.friendsType[i].name,
                        type: res.friendsType[i].type,
                        person: []

                    })
                }

                res.friends.forEach((item)=>{
                    item.personName= item.friendName
                    item.unread= 0
                    if( item.friendType === 0 ){
                        this.linkman[0].person.push(item)
                    }else{
                        for(let i in this.linkman){
                            if( item.friendType == this.linkman[i].type ){
                                this.linkman[i].person.push(item)
                                if(item.headimg && item.headimg != ''){
                                    item.headimg= require(`@/assets/img/headimg/${item.headimg}.jpg`)
                                }else{
                                    item.headimg= require('@/assets/img/headimg/1.jpg')
                                }
                            }
                        }
                    }
                })
                //将好友列表缓存起来，用于全局搜索
                this.$store.dispatch('saveFriends', this.linkman)
            })
        }
    },
    created(){
        this.getFriends()
        this.getMsg()
        this.applyListener()//监听好友申请
    },
    watch:{
        $route(val){
            if(val.name == 'chatPanel'){ //在好友面板搜索好友
                this.getFriends()
                this.applyListener()
                if(val.params.friendName){ //从顶部搜索过来的
                    this.onChat(val.params)                    
                }

            }
        }
    }
};
</script>

<style lang="stylus">
/* CSS */
  @import '~@/assets/css/common.styl'
  .chatPanel
    height 100%
    display flex
    position relative
    .addGroup
        font-size 16px
        position absolute
        left 125px
        bottom 6px
        cursor default
    .addFriend
        font-size 30px
        position absolute
        left 5px
        bottom 0
        cursor default
    .person-list
        width 200px
        height calc(100% - 40px)
        border-right 1px solid #0051ad
        overflow auto
        margin-bottom 40px
        .del-group
            position fixed
            z-index 4
            background #fff
            color #4a4a4a
            padding 5px
        .apply-list-wrap
            border 1px solid #0051ad
            padding 5px
            .apply-list-item
                .apply-row
                    display flex
                    justify-content space-between
                    align-items center
                    .A-L
                        width 140px
                        text-overflow ellipsis
                        white-space nowrap
                        overflow hidden
                    .a-sub-msg
                        word-break break-all
            .apply-list-item + .apply-list-item
                margin-top 5px
                border-top 1px solid #003470
        .click-menu
            position fixed
            z-index 4
            .el-cascader-panel
                border none
                .el-scrollbar__wrap
                    height auto
            .el-cascader-menu__list
                background #fff
            .el-cascader-menu
                background transparent

            .el-cascader-menu:nth-child(1)
                height auto
                background #fff
                height 110px
            
        .person-left-info
            width 150px
            position fixed
            right 0
            background #fff
            border 1px solid #eee
            border-radius 5px
            transition all .2s
            opacity 0
            text-align center

        .person-right-info
            width 150px
            position fixed
            right 0
            background #fff
            border 1px solid #eee
            border-radius 5px
            transition all .2s
            opacity 0
            text-align center
            z-index 3
            color black
            .person-right-onRow
                border-top 1px solid #eee
                cursor default
            .person-right-multi
                border-top 1px solid #eee
                display flex
                .person-right-multi-button
                    width 33.3%
                    border 1px solid #eee
                    cursor pointer
        .person-item
            display flex
            align-items center
            padding 5px 10px
            cursor default
            border-top 1px solid #0051AD
            position relative
            background #003470
            color #fff
            &:hover
                background #0051AD
            .person-head
                width 40px
                height 40px
                border-radius 50%
                overflow hidden
                img
                    width 100%
                    height 100%
            .person-name
                margin-left 10px
            .person-unread
                background red
                border-radius 10px
                margin-left auto
                width 20px
                height 20px
                line-height 20px
                text-align center
        .el-collapse
            border-color #0051ad
        .el-collapse-item__header
            color #fff
            background #003470
            border-color #0051ad
            cursor default
        .el-collapse-item__header.is-active
            border-bottom-color #003470
            background #003470
            color #fff

        .el-collapse-item__wrap
            border-bottom 1px solid  #0051AD
        .el-collapse-item__content
            padding-bottom 0
        .el-collapse-item
            user-select none
    .chat-content
        width calc(100% - 200px)
        position relative
        .empty-title
            position absolute 
            left 50%
            top 50%
            transform translate(-50%, -50%)
            color #fff
</style>
