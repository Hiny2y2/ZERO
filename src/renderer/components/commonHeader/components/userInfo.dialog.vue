<template>
    <el-dialog title="" :visible.sync="showDialog"
        top="10vh"
        custom-class="user-info-dialog"
        append-to-body
    >
        <div class="dialog-content">
            <div class="user-info-item user-headimg"
                @click="openHeadimgDialog"
            >
                <el-avatar :size="60" :src="circleUrl"></el-avatar>
                <!-- <img :src="require('@/assets/img/timg.jpeg')" alt=""> -->
            </div>
            <div class="user-info-item user-name">
                <el-input
                    v-model="form.user_name"
                    v-show="editName"
                ></el-input>
                <span
                    v-show="!editName"
                >{{form.user_name}}</span>
                <i class="el-icon-edit" style="font-size: 25px"
                    @click="editNameHandle()"
                ></i>
            </div>
            <div class="user-info-item">
                <el-input
                    type="textarea"
                    v-model="form.signature"
                    @blur="signatureHandle"
                    :resize="'none'"
                >

                </el-input>
            </div>
            <div class="user-basic-info">
                <div class="basic-title">
                    个人资料
                </div>
                <div class="basic-item">
                    <label>地区</label>
                    <div class="basic-set">
                        <el-select v-model="form.area" placeholder="请选择地区">
                            <el-option
                                v-for="item in AreaOptions"
                                :key="item.code"
                                :label="item.name"
                                :value="item.code">
                            </el-option>
                        </el-select>

                    </div>
                </div>
                <div class="basic-item">
                    <label>性别</label>
                    <div class="basic-set">
                        <el-select v-model="form.sex" placeholder="请选择地区">
                            <el-option
                                v-for="item in SexOptions"
                                :key="item.code"
                                :label="item.name"
                                :value="item.code">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="basic-item">
                    <label>生日</label>
                    <div class="basic-set">
                        <el-date-picker
                            v-model="form.birthday"
                            type="date"
                            placeholder="选择出生日期"
                            
                        >
                        </el-date-picker>
                    </div>
                </div>
                <div class="basic-item" style="justify-content: center">
                    <el-button
                        @click="updateBasicInfo"
                    >保存</el-button>
                </div>
            </div>
        </div>
        <head-img
            ref="headimg"
            @change="changeImg"
        ></head-img>
    </el-dialog>
</template>
<script>
    import publicText from '@/assets/js/publicText.service'
    import headImg from './headImg.dialog'

    export default{
        components: {
            headImg
        },
        data (){
            return {
                editName: false,
                SexOptions: [
                    {
                        code: 3,
                        name: '保密'
                    },
                    {
                        code: 0,
                        name: '男'
                    },
                    {
                        code: 1,
                        name: '女'
                    }
                ],
                AreaOptions: [
                    {
                        code: 'cn',
                        name: '中国'
                    },
                    {
                        code: 'nf',
                        name: '南非'
                    },

                ],
                form: {
                    birthday: '',
                    sex: '01',
                    area: '南非',
                    signature: '你比五环多一环',
                    user_name: 'xzy'
                },
                circleUrl: require('@/assets/img/timg.jpeg'),
                showDialog: false,
            }
        },
        methods: {
            changeImg(e){ //改变头像
                this.$set(this.form, 'figure', e)
                this.circleUrl= 
                require(`@/assets/img/headimg/${this.form.figure}.jpg`)//头像

            },
            openHeadimgDialog(){
                this.$refs.headimg.dialogVisible= true
            },
            updateBasicInfo(){ //更新用户个人信息
                let msg= 
                `{type:"updateUserBasicInfo",
                    area:"${this.form.area}",
                    sex:"${this.form.sex}",
                    birthday:"${this.form.birthday}",
                    figure: "${this.form.figure}"
                
                }`
                this.$ws.sendMsg(msg)
                this.showDialog= false
            },
            signatureHandle(){
                let msg= `{type:"updateUserSignature",signature:"${this.form.signature}"}`
                this.$ws.sendMsg(msg)
            },
            editNameHandle(){
                this.editName= !this.editName
                if(!this.editName){
                    let msg= `{type:"updateUserNickName",nickname:"${this.form.user_name}"}`
                    this.$ws.sendMsg(msg)
                }
            }
        },
        created(){
            this.$bus.$on('getUserBasicInfo', res=>{
                let BasicInfoData= _.clone(res)
                this.form.birthday= BasicInfoData.birthday;
                this.form.birthday= BasicInfoData.create;
                this.form.sex= BasicInfoData.sex;
                this.form.area= BasicInfoData.area;
                this.form.signature= BasicInfoData.signature;
                this.form.user_name= BasicInfoData.user_name;
                this.form.figure= '1'
                if(BasicInfoData.figure && BasicInfoData.figure !== 'null'){
                    //原来后台会传来字符串的null 😭 😭 😭
                    this.form.figure= BasicInfoData.figure; //头像
                }
                this.circleUrl= 
                require(`@/assets/img/headimg/${this.form.figure}.jpg`)//头像
            })
        }
    }
</script>
<style lang="stylus">
    .user-info-dialog
        width 360px!important
        height 480px!important
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
                        margin-right 10px
</style>