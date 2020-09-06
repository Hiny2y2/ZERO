<template>
    <div class="system-setting">
        <div class="setting-item">
            <div class="item-name">字体:</div>
             <div class="item-content">
                <el-select 
                    v-model="SelectedFont" 
                    placeholder="请选择"
                    @change="changeFont"
                >
                    <el-option
                        v-for="item in FontList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>

             </div>
        </div>
    </div>
</template>
<script>
    import publicText from '@/assets/js/publicText.service'
    export default{
        components: {
            
        },
        data (){
            return {
                FontList: [
                    {
                        label: '黑体',
                        value: 'SimHei'
                    },
                    {
                        label: '宋体',
                        value: 'SimSun'
                    },
                    {
                        label: '幼圆',
                        value: 'YouYuan'
                    },
                    {
                        label: '苹方',
                        value: 'PingFangSC-Medium'
                    },
                ],
                SelectedFont: ''
            }
        },
        methods: {
            changeFont(e){
                this.$emit('changeFont', e)
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
    .system-setting
        .setting-item
            margin-bottom 10px
            display flex
            align-items center
            .item-name
                margin-right 10px
</style>