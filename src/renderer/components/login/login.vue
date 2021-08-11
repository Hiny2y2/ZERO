<template>
  <div class="login">
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
      <canvas class="login-bg" id="login_bg">

      </canvas>
      <div class="login-pos">
          <div class="login-title">{{brandName}}</div>
            <el-form>
                <el-form-item label="">
                    <el-input 
                    placeholder="请输入账号"
                     v-model="form.name"
                     clearable
                     ></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-input 
                    show-password 
                    placeholder="请输入密码" 
                    v-model="form.pw"
                    clearable
                    ></el-input>
                </el-form-item>
                <el-form-item 
                    label="" 
                    v-show="switchVal == 'reg' || switchVal == 'forgetPW'"
                    
                >
                    <el-input v-model="form.phone"
                        placeholder="请输入手机号"
                        style="width: 70%;float:left;"
                    ></el-input>
                    <el-button
                        style="width: 30%;float:left; padding: 13px 0"
                        @click="sendAuthCode"
                        :disabled="number>0"
                    >
                        <span>
                            发送验证码  
                            <span v-show="number>0">
                                ({{number}}秒)
                            </span>
                        </span>
                    </el-button>
                </el-form-item>
                <el-form-item 
                    label="" 
                    v-show="switchVal == 'reg' || switchVal == 'forgetPW'"
                    
                >
                    <el-input v-model="form.code"
                        placeholder="请输入验证码"
                        
                    ></el-input>
                </el-form-item>
            </el-form>
            <el-button 
                @click="login"
                v-show="switchVal == 'login'"
            >登录</el-button>
            <el-button 
                @click="reg"
                v-show="switchVal == 'reg'"
            >注册</el-button>
            <el-button 
                @click="resetPW"
                v-show="switchVal == 'forgetPW'"
            >重置密码</el-button>
            <div class="bottom-button">
                <span v-show="switchVal != 'login'" @click="switchVal= 'login'">返回</span>
                <span v-show="switchVal == 'login'" @click="switchVal= 'forgetPW'">忘记密码</span>
                <span 
                    v-show="switchVal == 'login'" 
                    @click="switchVal= 'reg'"
                >注册</span>
            </div>

      </div>
  </div>
</template>

<script>
    import publicText from '@/assets/js/publicText.service'
    const {ipcRenderer: ipc} = require('electron');

    export default {
        name: "login",
        data (){
            return {
                number: 0,
                btnTimer: null,
                brandName: publicText.BRAND_NAME,
                switchVal: 'login',
                form: {
                    name: '',
                    pw: '',
                    phone: '',
                    code: '', //手机验证码
                }
            }
        },
        computed: {
            isLogin(nVal){
                console.log(nVal, 'vuex')
                return this.$store.state.isLogin
            }
        },
        methods: {
            min(){
                console.log(ipc)
                ipc.send('min')

            },
            close(){
                console.log(ipc)
                ipc.send('close')
            },
            resetPW(){
                if(this.form.phone == ''){
                    this.$alert( '手机号不能为空', '提示', {
                        confirmButtonText: '确定',
                    });
                    return
                }
                let msg= 
                `{type:"resetPwd",mobile:"${this.form.phone}",newPassword:"${this.form.pw}",code:"${this.form.code}"}`
                this.$ws.sendMsg(msg)

            },
            restore(){ //重置状态
                this.form= {
                    name: '',
                    pw: '',
                    phone: '',
                    code: '', //手机验证码
                }
                this.switchVal= 'login'
            },
            boardCastHandle(){
                this.$bus.$on(publicText.REGISTER, (res)=>{
                    if(res.code =='SUCCESS'){
                        this.restore()
                    }
                })
                this.$bus.$on(publicText.RESETPWD, (res)=>{
                    if(res.code =='SUCCESS'){
                        this.restore()
                    }
                })
            },
            sendAuthCode(){
                if(this.form.phone == ''){
                    this.$message({
                        message: '请输入手机号',
                        type: 'warning'
                    });      
                    return
                }
                if(this.btnTimer && this.number > 0 ){
                    return
                }else if(this.btnTimer && this.number == 0){
                    clearInterval(this.btnTimer)
                    this.btnTimer= null
                    
                }
                let msg= ''
                if(this.switchVal == 'reg'){ //注册
                    msg= `{type:"getRegisterSMS",mobile:"${this.form.phone}"}`
                }else if(this.switchVal == 'forgetPW'){
                    msg= `{type:"getResetPWDSMS",mobile:"${this.form.phone}"}`
                }
                this.$ws.sendMsg(msg)
                this.number= 60
                this.btnTimer= setInterval(()=>{
                    this.number--
                }, 1000)
                
            },
            createBg(){
                var c = document.getElementById("login_bg");
                var ctx = c.getContext("2d");
                c.height = window.innerHeight;
                c.width = window.innerWidth;
                var chinese = "ZERO";
                chinese = chinese.split("");
                var font_size = 10;
                var columns = c.width/font_size;
                //an array of drops - one per column
                var drops = [];
                for(var x = 0; x < columns; x++)
                    drops[x] = 1; 
                //drawing the characters
                let draw= ()=>{
                    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
                    ctx.fillRect(0, 0, c.width, c.height);
                    
                    ctx.fillStyle = "#393d77"; //green text
                    ctx.font = font_size + "px arial";
                    //looping over drops
                    for(var i = 0; i < drops.length; i++){
                        var text = chinese[Math.floor(Math.random()*chinese.length)];
                        ctx.fillText(text, i*font_size, drops[i]*font_size);
                        
                        if(drops[i]*font_size > c.height && Math.random() > 0.975)
                            drops[i] = 0;
                            
                        drops[i]++;
                    }
                }
                setInterval(draw, 33);
            },
            reg(){
                if(this.form.phone == ''){
                    this.$alert( '手机号不能为空', '提示', {
                        confirmButtonText: '确定',
                    });
                    return
                }
                let msg= 
                `{type:"register",username:"${this.form.name}",password:"${this.form.pw}",mobile:"${this.form.phone}",code:"${this.form.code}"}`
                this.$ws.sendMsg(msg)
            },
            login(){
                let msg= `{type:"login",username: "${this.form.name}",password:"${this.form.pw}"}`
                this.$ws.sendMsg(msg)
            }
        },
        mounted(){
            this.createBg()
            this.boardCastHandle()
            this.$bus.$on(publicText.GET_USER_BASIC_INFO, res=>{
                res.userName= res.user_name
                this.$store.dispatch('setUserInfo', res)
            })
            this.$bus.$on(publicText.UPDATE_USER_BASIC_INFO, res=>{ //更新个人信息
                let msg= `{type:"${publicText.GET_USER_BASIC_INFO}"}`
                this.$ws.sendMsg(msg) //获取用户信息
            })
            this.$bus.$on('login', res=>{
                this.$store.dispatch('setUserInfo', {
                    userName: this.form.name,
                })
                let msg= `{type:"${publicText.GET_USER_BASIC_INFO}"}`
                this.$ws.sendMsg(msg) //获取用户信息
                this.$router.push({path: '/chatPanel'})
            })
        },
    };
</script>

<style lang="stylus">
/* CSS */
  @import '~@/assets/css/common.styl'
.login
  height 100%
  position relative
  -webkit-app-region drag
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
  .login-bg
    width 100%
    height 100%
    position absolute
  .login-pos
    position absolute 
    left 50%
    top 50%
    transform translate(-50%, -50%)
    text-align center
    width 250px
    -webkit-app-region none
    .login-title
        color #fff
        font-size 40px
        text-align center
        font-family serif
        user-select none
        animation shine 1.5s ease infinite alternate
        margin-bottom 20px
        
    .el-form-item
        .el-input__inner
            background transparent
            color #fff
    .bottom-button
        display flex
        justify-content space-between
  .el-button
    margin-left 0!important
    width 100%
@keyframes shine{
    from {
        text-shadow 0 0 20px #fff
    }
    to{
        text-shadow 0 0 50px #fff
    }
}
</style>
