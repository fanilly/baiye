<template>
  <div class="container">

    <scroller @getData="getLists">
      <div class="list">
        <div class="item scroll-item" v-for="item,index in lists" :key="index" @click.stop="goIssueDetail(item.id)">
          <img :src="item.shop_avatar" class="avatar" alt="">
          <div class="content">
            <header class="header">
              <h2>{{item.shop_name}}</h2>
              <rate slot="left" v-model="item.score" size="14px" :readonly="true"></rate>
            </header>
            <main class="main">
              <p class="comment">{{item.eval}}</p>
              <p class="time">{{item.add_time}}</p>
            </main>
          </div>
        </div>
        <load-more v-if="!noLists" :show-loading="!listLoadedAll && !noLists" :tip="!listLoadedAll ? '加载中' : '已加载全部数据'" background-color="#fbf9fe"></load-more>
      </div>
    </scroller>

    <!-- empty page -->
    <div class="empty-status" v-if="noLists">
      <img :src="emptyIcon" />
      <div class="desc">暂无评价信息</div>
    </div>
  </div>
</template>
<script>
  import scroller from '@/components/scroller/scroller.vue';
  import rate from '@/components/rate/rate.vue';
  import { LoadMore } from 'vux';
  import { getMyEvaluateLists } from '@/api/index.js';

  export default {
    name: 'MyEvaluate',
    props:{
      shopid:{
        require:true
      }
    },
    data() {
      return {
        lists:[],
        page: 1,
        allowLoadMore: true,
        listLoadedAll: false,
        noLists: false,
        emptyIcon:require('../../assets/baiye/empty003.png'),
      };
    },
    methods: {
      getLists() {
        if (!this.allowLoadMore || this.listLoadedAll || this.noLists) return;
        this.allowLoadMore = false;
        getMyEvaluateLists({
          user_id: this.$store.state.user.userid,
          shop_id:this.shopid,
          page:this.page,
          type: 2
        }).then(res => {
          if (res.data.data.length < 20) this.listLoadedAll = true;
          if (res.data.data.length == 0 && this.lists.length == 0) this.noLists = true;
          this.lists.push(...res.data.data);
          this.allowLoadMore = true;
          this.page++;
        })
      },
    },
    mounted() {
      this.getLists();
    },
    components: {
      LoadMore,
      scroller,
      rate
    }
  };

</script>
<style lang="less" scoped>
  @import './MyEvaluate.less';

</style>
