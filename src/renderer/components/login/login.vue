<template>
  <div class="login">
      <canvas class="login-bg" id="login_bg">

      </canvas>
      <div class="login-pos">
          <div class="login-title">{{brandName}}</div>
            <el-form>
                <el-form-item label="">
                    <el-input placeholder="请输入账号" v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-input show-password placeholder="请输入密码" v-model="form.pw"></el-input>
                </el-form-item>
                <el-form-item label="手机号" v-show="switchVal == 'reg' || switchVal == 'forgetPW'">
                    <el-input v-model="form.phone"></el-input>
                    <el-button>
                        <span>发送验证码</span>
                    </el-button>
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
            <div class="bottom-button">
                <span v-show="switchVal != 'login'" @click="switchVal= 'login'">返回</span>
                <span v-show="switchVal == 'login'" @click="switchVal= 'forgetPW'">忘记密码</span>
                <span v-show="switchVal == 'login'" @click="switchVal= 'reg'">注册</span>
                <!-- <el-switch
                    style="display: block"
                    v-model="switchVal"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    inactive-text="登录"
                    active-text="注册">
                </el-switch> -->
            </div>

      </div>
  </div>
</template>

<script>
    import publicText from '@/assets/js/publicText.service'
    export default {
        name: "login",
        data (){
            return {
                brandName: publicText.BRAND_NAME,
                switchVal: 'login',
                form: {
                    name: 'zyx',
                    pw: '123'
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
                let msg= `{type:"register", username: "${this.form.name}", password:"${this.form.pw}", mobile: "${this.form.phone}"}`
                this.$ws.sendMsg(msg)
            },
            login(){
                let msg= `{type:"login",username: "${this.form.name}",password:"${this.form.pw}"}`
                this.$ws.sendMsg(msg)
            }
        },
        mounted(){
            this.createBg()
            this.$bus.$on('login', res=>{

                this.$store.dispatch('setUserInfo', {
                    userName: this.form.name
                })
                console.log(this.$store.state.user.userInfo, 'setUserInfo')
                this.$router.push({path: '/gameChannel'})
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
    .login-title
        color #fff
        font-size 40px
        text-align center
        font-family serif
        user-select none
        animation shine 1.5s ease infinite alternate;
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
