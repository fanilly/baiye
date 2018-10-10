<template>
  <div class="container">
    <class-nav :navs="navs"
      @toggleNavs="handleToggleNavs"></class-nav>

    <!-- 订单列表 -->
    <div class="scroller-container">
      <scroller @getData="getLists">
        <div class="list">
          <coupon-item class="scroll-item" v-for="item,index in lists"
            :key="index" :item="item"></coupon-item>
          <load-more v-if="!noLists"
            :show-loading="!listLoadedAll && !noLists"
            :tip="!listLoadedAll ? '加载中' : '已加载全部数据'"
            background-color="#fbf9fe"></load-more>
        </div>
      </scroller>
    </div>

    <!-- empty page -->
    <div class="empty-status"
      v-if="noLists">
      <img :src="emptyIcon" />
      <div class="desc">暂无{{currentName}}优惠券</div>
    </div>

  </div>
</template>
<script>
  import classNav from '@/components/classNav/classNav.vue';
  import scroller from '@/components/scroller/scroller.vue';
  import couponItem from '@/components/coupon/coupon.vue';
  import { LoadMore } from 'vux';
  import { getAllCouponList } from '@/api/index.js';

  export default {
    name: 'MyCoupon',
    props: {
      shopid: {
        require: true
      }
    },
    data() {
      return {
        lists: [],
        page: 1,
        allowLoadMore: true,
        listLoadedAll: false,
        noLists: false,

        emptyIcon: require('../../assets/baiye/empty005.png'),

        status: 0,
        currentName:'未使用',
        navs: [{
          name: '未使用',
          status: 0,
        }, {
          name: '已使用',
          status: 1,
        }, {
          name: '已过期',
          status: 2,
        }]
      };
    },
    methods: {
      // 切换显示订单分类
      handleToggleNavs(item) {
        this.status = item.status;
        this.currentName = item.name;
        this.lists = [];
        this.page = 1;
        this.allowLoadMore = true;
        this.listLoadedAll = false;
        this.noLists = false;
        this.getLists();
      },

      // 获取订单列表
      getLists() {
        if (!this.allowLoadMore || this.listLoadedAll || this.noLists) return;
        this.allowLoadMore = false;
        getAllCouponList({
          uid: this.$store.state.user.userid,
          page: this.page,
          status: this.status,
          store_id: this.shopid
        }).then(res => {
          console.log(res)
          if (res.data.data.length < 20) this.listLoadedAll = true;
          if (res.data.data.length == 0 && this.lists.length == 0) this.noLists = true;
          this.lists.push(...res.data.data);
          this.allowLoadMore = true;
          this.page++;
        })
      }

    },
    mounted() {
      this.getLists();
    },
    components: {
      classNav,
      scroller,
      couponItem,
      LoadMore
    }
  };

</script>
<style lang="less" scoped>

  .scroller-container {
    position: fixed;
    left: 0;
    top: 1rem;
    bottom: 0;
    right: 0;
    background-color: #f7f7f7;
  }

  .list {
    padding-top: .2rem;
  }

  .empty-status {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    text-align: center;
    background-color: #fff;
    padding: 2rem .5rem 0 .5rem;
    z-index: 10;
  }

  .empty-status>img {
    width: 2.4rem;
  }

  .empty-status .desc {
    color: #999;
    font-size: .28rem;
    padding: .5rem 0;
  }

</style>
