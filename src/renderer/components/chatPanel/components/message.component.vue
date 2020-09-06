<template>
    <p>
        {{msg}}
        <img v-if="isImg" :src="imgSrc" alt="">

    </p>
</template>
<script>
    export default{
        props: {
            message: {
                type: String,
                default: ''
            }
        },
        data(){
            return {
                msg: '',
                imgSrc: '',
                isImg: false,
            }
        },
        watch:{
            message: {
                handler(val){
                    if(val.substring(0, 2) == '$/'){ //如果是图片
                        this.isImg= true
                        let src= val.replace(/[^0-9]/ig, '');
                        this.imgSrc= require(`@/assets/img/emoji/${src}.png`)
                    }else{
                        this.msg= val
                    }
                },
                immediate: true
            }
                
        }
    }
</script>