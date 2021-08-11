<template>
    <div class="gameChannel">
        <div class="card-wrap">
            <el-scrollbar style="height:100%">
                <!-- <channel-card></channel-card> -->

                <channel-card
                    v-for="item in roomList"
                    :key="item.id"
                    :roomDetail="item"
                ></channel-card>
                <div class="empty-div"></div>
            </el-scrollbar>
        </div>
        <div class="page-wrap">
            <div class="refresh"
                @click="refreshRoom"
            >
                <i class="el-icon-refresh"></i>
            </div>
            <div class="add-room" @click="openAddRoomDialog">新建房间</div>
            <!-- <div
                class="prevPage"
                @click="sharp"
                :style="{'background-image': `url(${require('@/assets/img/page/arrow.png')})`}"
            ></div> -->

            <el-pagination 
                layout="prev, pager, next" 
                :total="allRoom.length"
                :current-page.sync="currentPage"
                @current-change="handleCurrentChange"
            ></el-pagination>
            <!-- <div
                class="nextPage"
                @click="plus"
                :style="{'background-image': `url(${require('@/assets/img/page/arrow.png')})`}"
            ></div> -->
        </div>
        <add-room-dialog 
            ref="addRoomDialog"
            @updateRoomList="getRoomList"
        ></add-room-dialog>
    </div>
</template>

<script>
import channelCard from "./components/channelCard.component";
import addRoomDialog from "./components/addRoom.dialog";
import publicText from "@/assets/js/publicText.service";

export default {
    components: {
        channelCard,
        addRoomDialog,
    },
    data() {
        return {
            pageSize: 8,
            currentPage: 1,
            allRoom: [],
            emptyDiv: 0,
            roomList: [],
        };
    },
    methods: {
        refreshRoom(){
            this.getRoomList()
        },
        handleCurrentChange(e){
            this.currentPage= e
            let arr= _.clone(this.allRoom)
            let startNum= this.pageSize*this.currentPage-this.pageSize;
            let endNum= this.pageSize*this.currentPage
            this.roomList= arr.slice(startNum, endNum)

        },
        searchChannel(key){ //搜索频道
            let msg= `{type:"searchRoom",keyword: "${key}"}`
            this.$ws.sendMsg(msg)
            this.currentPage= 1 //初始化分页
        },
        openAddRoomDialog() {
            //打开新建房间弹框
            this.$refs.addRoomDialog.dialogVisible = true;
        },
        getRoomList() {
            let msg = `{type:"getRoomList"}`;
            this.$ws.sendMsg(msg);
            this.$bus.$on(publicText.GET_ROOM_LIST, (res) => {
                this.allRoom = res.roomList;
                let arr= _.clone(this.allRoom)
                let startNum= this.pageSize*this.currentPage-this.pageSize;
                let endNum= this.pageSize*this.currentPage
                this.roomList= arr.slice(startNum, endNum)
                console.log(this.roomList, "listByAll");
            });
            this.$bus.$on(publicText.SEARCH_ROOM, (res) => { //搜索房间
                this.allRoom = res.roomList;
                let arr= _.clone(this.allRoom)
                let startNum= this.pageSize*this.currentPage-this.pageSize;
                let endNum= this.pageSize*this.currentPage
                this.roomList= arr.slice(startNum, endNum)
                console.log(this.roomList, "listBySearch");
            });
            //this.currentPage
            
        },
        getServerList() {
            let msg = `{type:"searchRoom",keyword:""}`;
            this.$ws.sendMsg(msg);
        },
    },
    created() {
        this.getRoomList();
        this.$bus.$on('searchChannel', (key)=>{ //搜索
            this.searchChannel(key.name)
        })
        this.$bus.$on('enterDetail', (params)=>{ //从顶部搜索来的
            this.$router.push({name: 'channelDetail', params: params })
        })
        if(this.$route.params.name){ //搜索
            this.searchChannel(this.$route.params.name)
        }
    },
};
</script>

<style lang="stylus">
/* CSS */
@import '~@/assets/css/common.styl'
.gameChannel
    height 100%
    padding 10px
    .card-wrap
        height calc(100% - 35px)
        .el-scrollbar
            .el-scrollbar__view
                height 100%
                display flex
                flex-wrap wrap
                justify-content space-between
                .channelCard
                    width calc(25% - 10px)
                    margin-bottom 10px
                    height 210px
                .empty-div
                    width calc(25% - 10px)
    .page-wrap
        display flex
        align-items center
        justify-content center
        position relative
        .refresh
            position absolute
            left 0 
            cursor default
            user-select none
            transition all .2s
            &:hover
                transform rotate(180deg)
        .add-room
            position absolute
            left 20px
            cursor default
            user-select none
        .el-pagination
            .btn-prev, background transparent, .btn-next, background transparent, .el-pager, .number
                background transparent
                color #fff
            .btn-quicknext, .btn-quickprev
                background transparent
                color #fff
            .active
                color #409EFF
        .nextPage, .prevPage
            background-size 100% 100%
            background-position center center
            width 35px
            height 20px
            display inline-block
        .prevPage
            transform rotateY(180deg)
</style>
