<template>
    <div class="edit-div"
         v-html="innerText"
         :placeholder="placeholder"
         :contenteditable="canEdit"
         @keydown.enter="keyDown($event)"
         @focus="isLocked = true"
         @blur="isLocked = false"
         @input="changeText">
    </div>
</template>
<script>
    export default{
        name: 'v-edit-div',
        props: {
            value: {
                type: String,
                default: ''
            },
            placeholder: {
                type: String,
                default: ''
            },
            canEdit: {
                type: Boolean,
                default: true
            },
            //禁止换行
            nowrap: {
                type: Boolean,
                default: false
            }
        },
        data(){
            return {
                innerText: this.value,
                isLocked: false
            }
        },
        watch: {
            'value'(){
                if (!this.isLocked && !this.innerText) {
                    this.innerText = this.value;
                }
            }
        },
        methods: {
            changeText(){
                // 解决：末尾换行，看不见的<br>，删不掉，造成清空无法出现placeholder文字
                if(this.$el.innerHTML=="<br>"){
                    this.$el.innerHTML="";
                }
                this.$emit('input', this.$el.innerHTML);
            },
            keyDown(e){
                this.innerText= ''
                this.$el.innerHTML= ''
                this.$emit('enter')
                //if(this.nowrap){
                    e.preventDefault();
                //}
                
            }
        },
        mounted() {
        }
    }
</script>
<style>
    .edit-div {
        width: 100%;
        height: 100%;
        overflow: auto;
        word-break: break-all;
        outline: none;
        user-select: text;
        white-space: pre-wrap;
        text-align: left;
    }
    .edit-div[contenteditable=true]{
        -webkit-user-modify: read-write-plaintext-only;  
    }
    .edit-div[contenteditable=true]:empty:before {
        content: attr(placeholder);
        display: block;
        color: #ccc;
    }
</style>