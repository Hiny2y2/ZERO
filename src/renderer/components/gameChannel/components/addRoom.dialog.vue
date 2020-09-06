<template>
    <el-dialog 
        class="add-room-dialog"
        :visible.sync="dialogVisible"
        title="新建房间"
        top="20vh"
        width="70%"
        @closed="reset"
    >
        <div class="content">
            <div class="one-row">
                <div class="title">房间名称：</div>
                <div class="input-box">
                    <el-input v-model="formData.roomName" placeholder="房间名称"></el-input>
                </div>
            </div>
            <div class="two-row">
                <div class="row-item">
                    <div class="title">是否加密：</div>
                    <div class="input-box">
                        <el-checkbox v-model="formData.isEncryption"></el-checkbox>
                        <el-input 
                            style="width: auto"
                            v-show="formData.isEncryption" 
                            v-model="formData.pwd"
                            placeholder="请输入房间密码"
                        ></el-input>
                    </div>
                </div>
                <div class="row-item">
                    <div class="title">人数上限：</div>
                    <div class="input-box">
                        <el-select v-model="formData.maxNumber" placeholder="请选择">
                            <el-option
                            v-for="item in numbers"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </div>
            <div class="one-row">
                <div class="title">选择地图：</div>
                <div class="input-box">

                </div>

            </div>
            <div class="one-row">
                <div class="title">房间简介：</div>
                <div class="input-box">
                    <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="请输入房间简介"
                        :resize="'none'"
                        v-model="formData.roomDesc">
                    </el-input>
                </div>

            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="creatRoom">确 定</el-button>
        </span>

    </el-dialog>
</template>
<script>
    import publicText from '@/assets/js/publicText.service'
    export default{
        components: {
            
        },
        data (){
            return {
                numbers: [
                    {
                        label: '6人',
                        value: 6
                    },
                    {
                        label: '12人',
                        value: 12
                    },
                    {
                        label: '24人',
                        value: 24
                    },
                ],
                formData: {
                    pwd: '',
                    isEncryption: false,
                    maxNumber: '',
                    roomDesc: '',
                    roomName: '',
                },
                dialogVisible: false,
            }
        },
        methods: {
            creatRoom(){
                let msg= 
                    `{type:"createRoom",
                    mapId:"1",
                    name:"${this.formData.roomName}",
                    total:"${this.formData.maxNumber}",
                    isEncrp:"${this.formData.isEncryption}",
                    pwd:"${this.formData.pwd}",
                    isOpen:"true",
                    desc:"${this.formData.roomDesc}"}`
                this.$ws.sendMsg(msg)

            },
            reset(){

            }
        },
        mounted(){

            
        },
        created(){
            
        },
        beforedestroy(){

        }
    }
</script>
<style lang="stylus">
    @import '~@/assets/css/common.styl'
    .add-room-dialog
        .content
            .one-row
                display flex
                align-items center
                margin-bottom 10px
            .two-row
                display flex
                margin-bottom 10px
                .row-item
                    width 50%
                    display flex
                    align-items center

</style>