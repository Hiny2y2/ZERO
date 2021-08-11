<template>
    <el-dialog 
        class="addGroup-dialog"
        :visible.sync="dialogVisible"
        title="添加群组"
        top="20vh"
        @closed="reset"
    >
        <div class="search-row">
            <el-input
                placeholder="请输入群组名称"
                v-model="input"
                @keyup.enter.native="AddGroup"
                clearable>
            </el-input>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="AddGroup">确 定</el-button>
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
                input: '',
                dialogVisible: false,
            }
        },
        methods: {
            reset(){
                this.input= '';
            },
            AddGroup(){
                if(this.input != ''){ //不能搜索空字符
                    let msg= `{type:"addFriendGroup",friendGroupName:"${this.input}"}`
                    this.$ws.sendMsg(msg)
                    this.$emit('change')
                    this.dialogVisible= false
                }
            }
        },
        created(){

        },
        beforedestroy(){
            
        }
    }
</script>
<style lang="stylus">
  @import '~@/assets/css/common.styl'
    .addGroup-dialog
        .search-row
            padding 10px 20px
            .el-input__suffix
                line-height 45px
</style>