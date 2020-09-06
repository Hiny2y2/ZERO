<template>
    <el-dialog 
        class="setting-dialog"
        :visible.sync="dialogVisible"
        title="设置"
        top="20vh"
        @closed="reset"
    >
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="系统设置" name="system">
                <systemOption @changeFont="changeFont"></systemOption>
            </el-tab-pane>
            <el-tab-pane label="关于" name="about">
                当老王说如果9月7号没做完，就不给我钱的时候，我就知道，我不能再打游戏了
            </el-tab-pane>
        </el-tabs>
    </el-dialog>
</template>
<script>
    import publicText from '@/assets/js/publicText.service'
    import systemOption from './components/system.component'
    export default{
        components: {
            systemOption
        },
        data (){
            return {
                activeName: 'system',
                dialogVisible: false
            }
        },
        methods: {
            changeFont(e){ //改变字体
                let style= document.querySelector('body')
                console.log(style.style.fontFamily= e, 'style1')

            },
            handleClick(e){

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
    .setting-dialog
        text-align left
</style>