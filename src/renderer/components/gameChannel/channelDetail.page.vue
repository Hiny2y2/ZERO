<template>
    <div class="channel-detail">
        <div class="detail-head">
            <span @click="back2channel"
                title="返回"
            >
                <i class="el-icon-back"></i>
            </span>
            <div class="detail-name">
                {{detail.name}}
                <i class="el-icon-lock"
                    v-show="detail.isEncrp"
                ></i>
            </div>
        </div>
        <div class="detail-main"
            :style="{backgroundImage: `url(${imgSrc})`}"
        >
            <div class="play-game" @click="checkGame"
                title="启动游戏"
            >
                <i class="el-icon-video-play"
                    v-show="!entering"
                >
                </i>
                <i class="el-icon-loading"
                    v-show="entering"
                ></i>
            </div>
            <div class="detail-handle">
                <span>{{detail.current}}/{{detail.total}}</span>
                <!-- <span><i class="el-icon-right"></i></span> -->
            </div>
        </div>
        <div class="detail-footer">
            {{detail.desc}}
        </div>
        <el-dialog
            title="密码验证"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
            <span>
                <el-input v-model="pwd" placeholder="请输入密码"></el-input>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="enterJump">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import publicText from '@/assets/js/publicText.service'
const {ipcRenderer} = require('electron');

export default {
    components: { 

    },
    data(){
        return {
            serverToken: {

            },
            dddddd: '',
            entering: false, //正在进入游戏
            pwd: '', //房间密码
            dialogVisible: false,
            detail: {},
            imgSrc: require('@/assets/img/SAO.jpeg')
        }
    },
    methods: {
        handleClose(){
            this.pwd= ''
        },
        enterJump(){
            let pwMSG= 
            `{type:"${publicText.CHECK_IN_ROOM}",roomId:"${this.detail.id}",pwd:"${this.pwd}"}`
            this.$ws.sendMsg(pwMSG)
            var promise = new Promise((resolve, reject)=>{
                this.$bus.$on(publicText.CHECK_IN_ROOM, res=>{
                    this.serverToken= res
                    resolve(res);
                })
            })
            promise.then(res=>{
                this.dialogVisible= false
                this.$message({
                    message: '验证成功，即将进入游戏',
                    type: 'success'
                });
                this.entering= true
                this.start()
            })
        },
        start(){//启动游戏 
            //先向服务器发送进入游戏房间请求，拿到token，存起来，然后启动游戏
            ipcRenderer.on('asynchronous-reply', (event, arg) => {
                //this.dddddd= '路径： '+arg
                console.log(arg,'从主进程传来的回应') // prints "pong"
            })
            let params= `-roomid {${this.detail.id}} -roomname {${this.detail.name}} -userid {${this.$store.state.user.userInfo.userName}} -token {${this.serverToken.roomKey}}`
            
// `{"action": "roomInfo","roomId": "${this.detail.id}","token": "${this.serverToken.roomKey}","key": "","userId": "${this.$store.state.user.userInfo.userName}","roomName": "${this.detail.name}"}`

            ipcRenderer.send('asynchronous-message', params)

            var promise = new Promise((resolve, reject)=>{
                //ipcRenderer.on('action-game', (event, arg)=>{
                //每十秒发送一次token，持续60秒
                setInterval(()=>{
                    //this.dddddd= this.dddddd+ arg
                    // let msg= `{"action": "roomInfo", "roomId": "${this.detail.id}", "token": "${this.serverToken.roomKey}", "key": ""}`
                    let msg= `{"action": "roomInfo","roomId": "${this.detail.id}","token": "${this.serverToken.roomKey}","key": "","userId": "${this.$store.state.user.userInfo.userName}","roomName": "${this.detail.name}"}`
                    ipcRenderer.send('start-success', msg)
                    console.log(msg, 'msggggg')
                }, 10000)
                //})
                setTimeout(()=>{
                    resolve(true);
                    //reject(false)
                }, 60000)
            })
            promise.then(res=>{
                console.log(res, '成了')
                this.entering= false
            }).catch(err=>{
                console.log(err, '凉了')
                this.$message({
                    message: '游戏启动失败，请稍后重试！',
                    type: 'warning'
                });
                this.entering= false
            })
        },
        checkGame(){            
            if(this.entering){ //正在进入游戏中
                return
            }
            if(this.detail.isEncrp){ //需要密码验证
                this.dialogVisible= true
            }else{ //不需要密码验证，直接进入游戏
                this.entering= true
                this.enterJump()
            }
        },
        back2channel(){
            this.$router.push({path: '/gameChannel'})
        }
    },
    created(){
        this.detail= this.$route.params

    }
  
};
</script>

<style lang="stylus">
/* CSS */
  @import '~@/assets/css/common.styl'
    .channel-detail
        height 100%
        .detail-head
            height 10%
            display flex
            align-items center
            position relative
            .detail-name
                positionCenter()
        .detail-main
            height 60%
            border-top 1px solid #ccc
            border-bottom 1px solid #ccc
            position relative
            background-size 100% 100%
            .play-game
                position absolute 
                right 5px
                bottom 0
                font-size 150px
            .detail-handle
                width 100%
                position absolute
                bottom 0
                display flex
                justify-content space-between
                padding 0 5px
                background #00000078
        .detail-footer
            height 30%
            font-size fontBig
</style>
