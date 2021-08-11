<template>
    <el-dialog 
        class="headimg-dialog"
        :visible.sync="dialogVisible"
        title="请选择头像"
        top="20vh"
        @closed="reset"
        append-to-body
    >
        <div class="headimg-content">
            <el-scrollbar style="height: 100%">
                <div class="headimg-item"
                    v-for="item in imgList"
                    :key="item.url"
                    @click="clickImg(item)"
                >
                    <img :src="item.url" alt="">
                    <div class="img-checked"
                        v-show="checkedImg == item.type"
                    >
                        <i class="el-icon-success"></i>
                    </div>
                </div>
            </el-scrollbar>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary"
                @click="enterImg"
            >确 定</el-button>
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
                checkedImg: '',
                imgList: [],
                dialogVisible: false,
            }
        },
        methods: {
            enterImg(){
                this.$emit('change', this.checkedImg)
                this.dialogVisible= false
            },
            clickImg(e){
                this.checkedImg= e.type
            },
            reset(){
                
            },
        },
        created(){
            for( let i= 1; i<= 10; i++ ){
                this.imgList.push({
                    url: require(`@/assets/img/headimg/${i}.jpg`),
                    title: '',
                    type: i
                })
            }
        },
        beforedestroy(){
            
        }
    }
</script>
<style lang="stylus">
    @import '~@/assets/css/common.styl'
    .headimg-dialog
        .headimg-content
            height 200px
            .headimg-item
                width 115px
                height 115px
                float left    
                position relative
                img
                    width 100%
                    height 100%
                .img-checked
                    position absolute
                    left 5px
                    bottom 5px
                    color yellowgreen
                    font-size fontBig
</style>