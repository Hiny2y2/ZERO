<template>
    <el-dialog 
        class="addFriend-dialog"
        :visible.sync="dialogVisible"
        title="查找用户"
        top="20vh"
        @closed="reset"
    >
        <div class="search-row" v-if="!searchResult">
            <el-input
                placeholder="请输入好友名称"
                v-model="input"
                @keyup.enter.native="searchAddFriendList"
                clearable>
                <i slot="suffix" class="el-icon-search"
                    @click="searchAddFriendList"
                ></i>
            </el-input>
        </div>
        <search-resultC  v-if="searchResult"
            :resUserList="resUserList"
        >
        </search-resultC>
        <div class="back"
            v-show="searchResult"
        >
            <span @click="searchResult= false">返回</span>
            
        </div>
    </el-dialog>
</template>
<script>
    import searchResultC from './searchFriendList.component'
    import publicText from '@/assets/js/publicText.service'
    export default{
        components: {
            searchResultC
        },
        data (){
            return {
                resUserList: [],
                input: '',
                dialogVisible: false,
                searchResult: false
            }
        },
        methods: {
            reset(){
                this.input= '';
                this.searchResult= false
            },
            // addFriend(){
            //     let msg= `{type:"addFriend",toUserId:"2",message:"hello"}`
            //     this.$ws.sendMsg(msg)
            // },
            getList (){
                this.$bus.$on(publicText.SEARCH_USER, (data)=>{
                    console.log(data,123)
                    this.resUserList= [];
                    this.resUserList= data.users

                }) 
            },
            searchAddFriendList(){
                if(this.input != ''){ //不能搜索空字符
                    let msg= `{type:"searchUser",keyword:"${this.input}",pageIndex:"1"}`
                    this.$ws.sendMsg(msg)
                    this.searchResult= true

                }
            }
        },
        created(){
            this.getList()
        },
        beforedestroy(){
            this.$bus.$off(publicText.SEARCH_USER)
        }
    }
</script>
<style lang="stylus">
  @import '~@/assets/css/common.styl'
    .addFriend-dialog
        .search-row
            padding 10px 20px
            .el-input__suffix
                line-height 45px
        .back
            cursor default
</style>