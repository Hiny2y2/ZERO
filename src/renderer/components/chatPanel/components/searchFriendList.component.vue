<template>
    <div 
        class="searchFriend"
    >
        <div class="SF-item"
            v-for="item in resUserList"
            :key="item.username"
        >
            <div class="user-img">
                <el-avatar :size="30" :src="squareUrl"></el-avatar>
            </div>
            <div class="user-name">
                {{item.username}}
            </div>
            <div class="add-user">
                <i class="el-icon-circle-plus-outline"
                    @click="addFriendHandle(item)"
                ></i>
            </div>
        </div>
        <el-dialog
            width="30%"
            title="添加好友"
            :visible.sync="innerVisible"
            append-to-body
            @closed="subMessage= ''"
        >
            <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入附加内容"
                v-model="subMessage"
                :resize="'none'"
            >
            </el-input>

            <span slot="footer" class="dialog-footer">
                <el-button @click="innerVisible = false; focusFriend= {}">取 消</el-button>
                <el-button type="primary" @click="sendAddMsg">确 定</el-button>
            </span>

        </el-dialog>

    </div>
</template>
<script>
    export default{
        props: {
            resUserList: {
                type: Array,
                default: []
            },
        },
        data (){
            return {
                subMessage: '', //添加好友附加信息
                focusFriend: {}, //要添加的好友
                innerVisible: false,
                squareUrl: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
            }
        },
        methods: {
            sendAddMsg(){
                let msg= `{type:"addFriend",toUserId:"${this.focusFriend.id}",message:"${this.subMessage}"}`
                this.$ws.sendMsg(msg)
                this.innerVisible= false
            },
            addFriendHandle(item){
                this.focusFriend= item;
                this.innerVisible= true
            },
            searchAddFriendList(){
                
                let msg= `{type:"searchUser",keyword:"${this.input}",pageIndex:"1"}`
                this.$ws.sendMsg(msg)
                this.addFriend()
            }
        }
    }
</script>
<style lang="stylus">
  @import '~@/assets/css/common.styl'
    .searchFriend
        padding 10px 20px
        font-size fontMd
        .SF-item
            display flex
            justify-content center
            border-bottom 1px solid #ccc
            .add-user
                margin-left auto
            .user-name
                margin-left 10px
</style>