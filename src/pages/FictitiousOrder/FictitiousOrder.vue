<template>
  <div class="container">
    <class-nav :navs="navs" @toggleNavs="handleToggleNavs"></class-nav>

    <!-- 订单列表 -->
    <div class="scroller-container">
      <scroller @getData="getLists">
        <div class="list">
          <div class="order">
            <div class="order-item" v-for="item,index in lists" :key="index">
              <div class="order-item-header">
                <div>下单时间:{{item.add_time}}
                  <div>下单店铺:{{item.shop_name}}</div>
                </div>
                <div v-if="item.status == 0">未付款</div>
                <div v-if="item.status == 1">待接单</div>
                <div v-if="item.status == 2">已接单</div>
                <div v-if="item.status == 3">配送中</div>
                <div v-if="item.status == 4">已送达</div>
                <div v-if="item.status == 5">已完成</div>
                <div v-if="item.status == 6">已退款</div>
              </div>

              <div class="order-item-main">
                <div class="lside">
                  <img :src="item.goods_img" />
                </div>
                <div class="rside">
                  <div class="goods-title">{{item.title}} <span v-if="item.attr">({{item.attr}})</span></div>
                  <div class="goods-spec">数量：
                    <span>X</span>{{item.num}}</div>
                  <div class="goods-price">
                    <span>￥</span>{{item.goods_price}}
                  </div>
                </div>
              </div>

              <div class="order-item-footer">
                <div class="lside">
                  <div>订单金额：￥
                    <span>{{item.total_money}}</span>
                  </div>
                  <div>含运费：{{item.shipping_money}}元</div>
                </div>
                <div class="rside">
                  <div class="btn btn-fill" v-if="item.status == 0" @click="goPayment">去付款</div>
                </div>
              </div>
            </div>
          </div>

          <load-more v-if="!noLists" :show-loading="!listLoadedAll && !noLists" :tip="!listLoadedAll ? '加载中' : '已加载全部数据'" background-color="#fbf9fe"></load-more>
        </div>
      </scroller>
    </div>

    <!-- empty page -->
    <div class="empty-status" v-if="noLists">
      <img :src="emptyIcon" />
      <div class="desc">暂无此类订单</div>
    </div>

  </div>
</template>
<script>
  import classNav from '@/components/classNav/classNav.vue';
  import scroller from '@/components/scroller/scroller.vue';
  import { LoadMore } from 'vux';
  import { SET_PAYMENT_OPTIONS } from '../../store/mutation-type.js';
  import { getFictitiousOrderLists } from '@/api/index.js';

  export default {
    name: 'FictitiousOrder',
    data() {
      return {
        lists: [],
        page: 1,
        allowLoadMore: true,
        listLoadedAll: false,
        noLists: false,
        emptyIcon: require('../../assets/baiye/empty001.png'),

        status: 0,
        navs: [{
          name: '待接单',
          status: 0,
        }, {
          name: '待配送',
          status: 1,
        }, {
          name: '配送中',
          status: 2,
        }, {
          name: '已完成',
          status: 3,
        }]
      };
    },
    methods: {
      // 切换显示订单分类
      handleToggleNavs(item) {
        this.status = item.status;
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
        getFictitiousOrderLists({
          user_id: this.$store.state.user.userid,
          page: this.page,
          status: this.status
        }).then(res => {
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
      LoadMore
    }
  };

</script>
<style lang="less" scoped>
  @import './FictitiousOrder.less';
</style>
