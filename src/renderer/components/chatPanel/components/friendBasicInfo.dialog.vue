<template>
    <el-dialog title="" :visible.sync="showDialog"
        top="10vh"
        custom-class="friend-info-dialog"
        append-to-body
    >
        <div class="dialog-content">
            <div class="user-info-item user-headimg"
            >
                <el-avatar :size="60" :src="circleUrl"></el-avatar>
            </div>
            <div class="user-info-item user-name">
                <span>{{form.user_name}}</span>
            </div>
            <div class="user-info-item">
                <span>{{form.signature}}</span>
            </div>
            <div class="user-basic-info">
                <div class="basic-title">
                    个人资料
                </div>
                <div class="basic-item">
                    <label>地区</label>
                    <div class="basic-set">
                        <span>{{form.area}}</span>
                    </div>
                </div>
                <div class="basic-item">
                    <label>性别</label>
                    <div class="basic-set">
                        <span>{{form.sex | transGender}}</span>
                    </div>
                </div>
                <div class="basic-item">
                    <label>生日</label>
                    <div class="basic-set">
                        {{form.birthday | transDate}}
                    </div>
                </div>
                <div class="basic-item" style="justify-content: flex-end">
                    <el-button
                        @click="showDialog= false"
                    >关闭</el-button>
                    <el-button
                        v-if="model == 'add'"
                        @click="innerVisible= true"
                        type="primary"
                    >添加好友</el-button>
                </div>
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

    </el-dialog>
</template>
<script>
    import publicText from '@/assets/js/publicText.service'

    export default{
        data (){
            return {
                innerVisible: false, //添加好友弹窗
                subMessage: '', //添加好友附加信息
                model: 'default',
                friendId: '',
                friendInfo: {},
                form: {
                    birthday: '',
                    sex: '01',
                    area: '南非',
                    signature: '你比五环多一环',
                    user_name: 'xzy'
                },
                circleUrl: '',
                showDialog: false,
            }
        },
        methods: {
            sendAddMsg(){ //添加好友
                let msg= `{type:"addFriend",toUserId:"${this.friendId}",message:"${this.subMessage}"}`
                this.$ws.sendMsg(msg)
                this.innerVisible= false
            },
            addFriend(id){
                
                let msg= 
                    `{type:"${publicText.GET_FRIEND_BASIC_INFO}",friendId:"${id}"}`
                this.$ws.sendMsg(msg)
                this.showDialog= true
                this.friendId= id
                this.model= 'add' //添加好友模式
            },
            open (){
                let msg= 
                    `{type:"${publicText.GET_FRIEND_BASIC_INFO}",friendId:"${this.friendInfo.friendId}"}`
                this.$ws.sendMsg(msg)
                this.showDialog= true
                this.model= 'default' //普通查看好友信息
            },
            changeImg(e){ //改变头像
                this.$set(this.form, 'figure', e)
                this.circleUrl= 
                require(`@/assets/img/headimg/${this.form.figure}.jpg`)//头像

            },
        },
        created(){
            this.$bus.$on(publicText.GET_FRIEND_BASIC_INFO, res=>{
                console.log(res, 'xxxxxxxxxx')
                let BasicInfoData= _.clone(res)
                
                this.form.birthday= BasicInfoData.birthday;
                this.form.birthday= BasicInfoData.create;
                this.form.sex= BasicInfoData.sex;
                this.form.area= BasicInfoData.area;
                this.form.signature= BasicInfoData.signature;
                this.form.user_name= BasicInfoData.user_name;
                this.form.figure= '1'; //头像
                if(BasicInfoData.figure && BasicInfoData.figure !== 'null'){
                    this.form.figure= BasicInfoData.figure
                }
                
                this.circleUrl= 
                require(`@/assets/img/headimg/${this.form.figure}.jpg`)//头像
            })
        }
    }
</script>
<style lang="stylus">
    .friend-info-dialog
        width 360px!important
        height auto!important
        .dialog-content
            height 100%
            .user-headimg
                text-align center
            .user-name
                display flex
                justify-content center
                align-items center
                .el-input
                    width 100px
            .user-info-item
                margin-bottom 10px
                min-height 40px
                text-align center
            .user-basic-info
                .basic-title
                    font-size 16px
                    font-weight bold
                .basic-item
                    
                    padding-left 10px
                    display flex
                    align-items center
                    margin-bottom 10px
                    label
                        width 100px
                        margin-right 10px
                    .basic-set
                        width calc(100% - 100px)
</style>