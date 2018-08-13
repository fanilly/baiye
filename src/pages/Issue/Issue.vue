<template>
  <div class="container">

    <div class="list">
      <div class="item scroll-item" v-for="item,index in lists" :key="index" @click.stop="goIssueDetail(item.id)">
        <img class="q-icon" :src="qIcon" alt="">
        <h4 class="name">{{item.title}}</h4>
        <img class="arrow" :src="arrowIcon" alt="">
      </div>
      <load-more v-if="!loaded" :show-loading="true" tip="加载中" background-color="#fbf9fe"></load-more>
    </div>

    <!-- empty page -->
    <div class="empty-status" v-if="loaded && lists.length == 0">
      <img :src="emptyIcon" />
      <div class="desc">暂无帮助信息</div>
    </div>
  </div>
</template>
<script>
  import { LoadMore } from 'vux';
  import { getIssueLists } from '@/api/index.js';

  export default {
    name: 'IssueList',
    data() {
      return {
        lists:[],
        loaded:false,
        emptyIcon:require('../../assets/k2.png'),
        arrowIcon:require('../../assets/return.png'),
        qIcon:require('../../assets/q.png'),
      };
    },
    methods: {
      goIssueDetail(id){
        this.$router.push({
          name:'IssueDetail',
          params:{
            id:id
          }
        })
      }
    },
    mounted() {
      getIssueLists().then(res => {
        this.lists.push(...res.data.data);
        this.loaded = true;
      });
    },
    components: {
      LoadMore
    }
  };

</script>
<style lang="less" scoped>
  @import './Issue.less';

</style>
