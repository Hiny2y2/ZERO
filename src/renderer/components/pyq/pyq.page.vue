<template>
  <div class="pyq-wrap"
    
  >
    <el-scrollbar
      v-infinite-scroll="load"
      class="pyq-scroll"
    >
      <articleItem
        v-for="(item, index) in list"
        :articleItem="item"
        :key="index"
        @sendMsg="reloadArticle"
      ></articleItem>
      <articleItem></articleItem>

    </el-scrollbar>
    <!-- <div class="pyq-scroll"
      v-infinite-scroll="load"
    >
      <articleItem
        v-for="(item, index) in list"
        :articleItem="item"
        :key="index"
        @sendMsg="reloadArticle"
      ></articleItem>
      <articleItem></articleItem>

    </div> -->
  </div>
</template>

<script>
import articleItem from './components/article.component'
export default {
    components: {
        articleItem
    },
    data (){
      return{
        count: 0,
        page: {
          pageNum: 1,
          pageSize: 20
        },
        list: []
      }
    },
    methods: {
      reloadArticle(){ //发送了消息，重新加载朋友圈
        this.page.pageNum= 1
        this.list= []
        this.load()
      },
      load(){
        let params= `{type:"getTalkList", page:"${this.page.pageNum}",pageSize:"${this.page.pageSize}"}`
        this.$ws.sendMsg(params)
        this.page.pageNum++
      }
    },
    created(){
      this.list= []
      this.$bus.$on('getTalkList', res=>{
        //this.list= res.message
        res.message.forEach(item=>{
          this.list.push({
            id: item.id,
            content: item.message,
            createTime: item.createTime,
            replies: item.replies,
            picList: [],
            name: item.publisher,
            circleUrl: "@/assets/img/um0.jpg",
            agreeList: item.agreeList
          })
        })
        console.log(this.list, 'this.list2')
      })
    }
  
};
</script>

<style lang="stylus">
/* CSS */
  @import '~@/assets/css/common.styl'
  .pyq-wrap
    height 100%
    position relative
    padding 10px
    overflow-y auto
    .pyq-scroll
      height 100%
      .el-scrollbar__wrap
        .el-scrollbar__view
          column-count 2
          column-gap 10px

</style>
