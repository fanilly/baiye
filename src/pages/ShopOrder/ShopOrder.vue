<template>
  <div class="container">
    <class-nav :navs="navs"
      @toggleNavs="handleToggleNavs"></class-nav>

    <!-- 订单列表 -->
    <div class="scroller-container">
      <scroller @getData="getLists">
        <div class="list">
          <!-- <div class="item scroll-item" v-for="item,index in lists" :key="index">
            <div class="first">
                <img :src="item.goods_img" />
                <span>{{item.shop_name}}</span>
              <div class="now" v-if="item.status==0">待支付</div>
              <div class="now" v-if="item.status==1">待接单</div>
              <div class="now" v-if="item.status==2">已接单</div>
              <div class="now" v-if="item.status==3">配送中</div>
              <div class="now" v-if="item.status==4">待评价</div>
              <div class="now" v-if="item.status==5">已完成</div>
              <div class="now" v-if="item.status==6">已退款</div>
            </div>
            <div class="food zhuse">{{item.goods_detail}}</div>
            <div class="sum zhuse">
              <span class="small">共{{item.goods_count}}件，合计 ¥</span>{{item.total_money}}</div>
            <div class="btn">
              <div class="zhuangtai" v-if="item.status==3">
                <span>{{item.shipping_type}}</span>
              </div>
              <div class="paya" v-if="item.status==0" @click.stop="goPayment(item.order_no, item.total_money)">立即支付</div>
              <div class="paya" v-if="item.status==1">去评价</div>
              <div class="xqa ml" v-if="item.status==0" @click.stop="cancelOrDelOrder(item.order_no,false)">取消订单</div>
              <div class="xqa ml" v-if="item.status>3" @click.stop="cancelOrDelOrder(item.order_no,true)">删除订单</div>
            </div>
          </div> -->

          <div class="order-item scroll-item" v-for="item,index in lists">
            <div class="order-item-header">
                <div>下单时间:{{item.add_time}}</div>
                <div v-if="item.status==0">未付款</div>
                <div v-if="item.status==1">待接单</div>
                <div v-if="item.status==2">已接单</div>
                <div v-if="item.status==3">配送中</div>
                <div v-if="item.status==4">已送达</div>
                <div v-if="item.status==5">已完成</div>
                <div v-if="item.status==6">已退款</div>
            </div>

            <div class="order-item-main">
                <div class="lside">
                    <img :src="item.goods_img"  />
                </div>
                <div class="rside">
                    <div class="goods-title">{{item.title}}<span  v-if="item.attr != '' ">({{item.attr}})</span></div>
                    <div class="goods-spec">数量：<span>X</span>{{item.num}}</div>
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
                    <div class="btn btn-txt">收益<span class="unit">￥</span><span class="price">{{item.bonus_money}}</span></div>
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
      <div class="desc">暂无订单此类订单</div>
    </div>


    <!-- <footer-nav active-index="1"></footer-nav> -->
  </div>
</template>
<script>
  import footerNav from '@/components/footerNav/footerNav.vue';
  import classNav from '@/components/classNav/classNav.vue';
  import scroller from '@/components/scroller/scroller.vue';
  import { LoadMore } from 'vux';
  import { SET_PAYMENT_OPTIONS } from '../../store/mutation-type.js';
  import { getShopOrder, cancelOrDelOrder } from '@/api/index.js';

  export default {
    name: 'shopOrder',
    data() {
      return {
        lists:[],
        page: 1,
        allowLoadMore: true,
        listLoadedAll: false,
        noLists: false,
        emptyIcon:require('../../assets/k2.png'),
        shop_id:'',

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
    created(){
        this.shopid = this.$route.params.shopid
    },
    methods: {
      // 切换显示订单分类
      handleToggleNavs(item) {
        this.status = item.status;
        this.lists = [];
        this.page= 1;
        this.allowLoadMore= true;
        this.listLoadedAll= false;
        this.noLists= false;
        this.getLists();
      },

      // 获取订单列表
      getLists() {
        if (!this.allowLoadMore || this.listLoadedAll || this.noLists) return;
        this.allowLoadMore = false;
        getShopOrder({
          //user_id: this.$store.state.user.userid,
          shop_id:this.shopid,
          page:this.page,
          status: this.status,
          //type: 2
        }).then(res => {
          if (res.data.data.length < 10) this.listLoadedAll = true;
          if (res.data.data.length == 0 && this.lists.length == 0) this.noLists = true;
          this.lists.push(...res.data.data);
          this.allowLoadMore = true;
          this.page++;
        })
      },

      goPayment(orderNo, totalMoney){
        this.$store.commit(SET_PAYMENT_OPTIONS, {
          canUse: false,
          orderNo: orderNo,
          totalMoney: totalMoney,
          orderType: 'OD',
          kind: 2,
        });
        this.$router.push({
          name:'Payment'
        });
      },

      //取消或删除订单
      cancelOrDelOrder(orderNo,isDel){
        let txt = isDel ? '删除' : '取消';
        this.feedback.Confirm({
          title: '',
          msg: `确定要${txt}订单吗?`,
          options: [{
            txt: '取消',
            color: '#999'
          }, {
            txt: '确定',
            color: '#0bb20c',
            callback: () => {
              this.feedback.Loading.open(`${txt}中`);
              cancelOrDelOrder({
                user_id:this.$store.state.user.userid,
                order_no: orderNo
              }).then(res=>{
                this.feedback.Loading.close();
                this.feedback.Toast({
                  msg: res.data.info,
                  timeout: 1500
                });
                if(res.data.code == 1){
                  this.lists = [];
                  this.page= 1;
                  this.allowLoadMore= true;
                  this.listLoadedAll= false;
                  this.noLists= false;
                  this.getLists();
                }
              })
            }
          }]
        });
      }
    },
    mounted() {
      this.getLists();
    },
    components: {
      footerNav,
      classNav,
      scroller,
      LoadMore
    }
  };

</script>
<style lang="less"
  scoped>
  @import './shopOrder.less';
  @import './../Order/Order.less';

</style>
