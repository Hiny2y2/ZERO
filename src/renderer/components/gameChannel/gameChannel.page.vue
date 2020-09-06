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
            <div class="add-room" @click="openAddRoomDialog">新建房间</div>
            <div
                cdivlass="prevPage"
                :style="{'background-image': `url(${require('@/assets/img/page/arrow.png')})`}"
            ></div>

            <el-pagination layout=" pager" :total="1000"></el-pagination>
            <div
                class="nextPage"
                :style="{'background-image': `url(${require('@/assets/img/page/arrow.png')})`}"
            ></div>
        </div>
        <add-room-dialog ref="addRoomDialog"></add-room-dialog>
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
            emptyDiv: 0,
            roomList: [],
        };
    },
    methods: {
        openAddRoomDialog() {
            //打开新建房间弹框
            this.$refs.addRoomDialog.dialogVisible = true;
        },
        getRoomList() {
            let msg = `{type:"getRoomList"}`;
            this.$ws.sendMsg(msg);
            this.$bus.$on(publicText.GET_ROOM_LIST, (res) => {
                this.roomList = res.roomList;
                console.log(this.roomList, "list");
            });
        },
        getServerList() {
            let msg = `{type:"searchRoom",keyword:""}`;
            this.$ws.sendMsg(msg);
        },
    },
    created() {
        this.getRoomList();
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
                    height 250px
                .empty-div
                    width calc(25% - 10px)
    .page-wrap
        display flex
        align-items center
        justify-content center
        position relative
        .add-room
            position absolute
            left 0
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
