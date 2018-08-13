<template>
  <div class="container">
    <!-- 收藏列表 -->
    <div class="scroller-container">
      <scroller @getData="getLists">
        <div class="list">
          <div class="item scroll-item" v-for="item,index in lists" :key="index">
            <img class="avatar" @click.stop="goShopIndex(item.id)" :src="item.avatar" alt="">
            <h4 class="name" @click.stop="goShopIndex(item.id)">{{item.name}}取消关注取消关注取消关注</h4>
            <span class="btn" @click.stop="cancelCollection(item.id)">取消关注</span>
          </div>
          <load-more v-if="!noLists" :show-loading="!listLoadedAll && !noLists" :tip="!listLoadedAll ? '加载中' : '已加载全部数据'" background-color="#fbf9fe"></load-more>
        </div>
      </scroller>
    </div>

    <!-- empty page -->
    <div class="empty-status" v-if="noLists">
      <img :src="emptyIcon" />
      <div class="desc">暂无收藏店铺</div>
    </div>
  </div>
</template>
<script>
  import scroller from '@/components/scroller/scroller.vue';
  import { LoadMore } from 'vux';
  import { getCollectionLists, toggleCollectionStatus } from '@/api/index.js';

  export default {
    name: 'Collection',
    data() {
      return {
        lists:[],
        page: 1,
        allowLoadMore: true,
        listLoadedAll: false,
        noLists: false,
        emptyIcon:require('../../assets/k2.png'),
      };
    },
    methods: {
      // 获取订单列表
      getLists() {
        if (!this.allowLoadMore || this.listLoadedAll || this.noLists) return;
        this.allowLoadMore = false;
        getCollectionLists({
          user_id: this.$store.state.user.userid,
          page:this.page
        }).then(res => {
          console.log(res);
          if (res.data.data.length < 20) this.listLoadedAll = true;
          if (res.data.data.length == 0 && this.lists.length == 0) this.noLists = true;
          this.lists.push(...res.data.data);
          this.allowLoadMore = true;
          this.page++;
        })
      },

      goShopIndex(shopId){
        this.$router.push({
          name:'Shop',
          params:{
            shopid:shopId
          }
        })
      },

      //取消关注
      cancelCollection(shopId){
        this.feedback.Loading.open('操作中');
        toggleCollectionStatus({
          shop_id:shopId,
          user_id:this.$store.state.user.userid
        }).then(res=>{
          this.feedback.Loading.close();
          this.feedback.Toast({
            msg:res.data.info,
            timeout:1200
          });
          if(res.data.code == 1){
            this.lists = [];
            this.page= 1;
            this.allowLoadMore= true;
            this.listLoadedAll= false;
            this.noLists= false;
            this.getLists();
          }
        });
      }
    },
    mounted() {
      this.getLists();
    },
    components: {
      scroller,
      LoadMore
    }
  };

</script>
<style lang="less" scoped>
  @import './Collection.less';

</style>
