<template>
  <div class="container">
    <class-nav :navs="navs"
      @toggleNavs="handleToggleNavs"></class-nav>

    <!-- 订单列表 -->
    <div class="scroller-container">
      <scroller @getData="getLists">
        <div class="list">
          <div class="item scroll-item" v-for="item,index in lists" :key="index">
            <div class="first" @click="goOrderDetail(item.order_no)">
              <img :src="item.shop_avatar" />
              <span>{{item.shop_name}}</span>
              <div class="now" v-if="item.status==0">待支付</div>
              <div class="now" v-if="item.status==1">待接单</div>
              <div class="now" v-if="item.status==2">已接单</div>
              <div class="now" v-if="item.status==3">配送中</div>
              <div class="now" v-if="item.status==4">待评价</div>
              <div class="now" v-if="item.status==5">已完成</div>
              <div class="now" v-if="item.status==6">已退款</div>
            </div>
            <div class="food zhuse" @click="goOrderDetail(item.order_no)">{{item.goods_detail}}</div>
            <div class="sum zhuse" @click="goOrderDetail(item.order_no)">
              <span class="small">共{{item.goods_count}}件，合计 ¥</span>{{item.total_money}}</div>
            <div class="btn" v-if="item.status == 0 || item.status == 3 || item.status == 4">
              <div class="zhuangtai" v-if="item.status==3">
                <span>{{item.shipping_type}}</span>
              </div>
              <div class="paya" v-if="item.status==0" @click.stop="goPayment(item.order_no, item.total_money, item.can_use)">立即支付</div>
              <div class="paya" v-if="item.status==4" @click.stop="goEvaluate(item.order_no)">去评价</div>
              <div class="xqa ml" v-if="item.status==0" @click.stop="cancelOrDelOrder(item.order_no,false)">取消订单</div>
              <div class="xqa ml" v-if="item.status>3" @click.stop="cancelOrDelOrder(item.order_no,true)">删除订单</div>
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


    <footer-nav active-index="1"></footer-nav>
  </div>
</template>
<script>
  import footerNav from '@/components/footerNav/footerNav.vue';
  import classNav from '@/components/classNav/classNav.vue';
  import scroller from '@/components/scroller/scroller.vue';
  import { LoadMore } from 'vux';
  import { SET_PAYMENT_OPTIONS } from '../../store/mutation-type.js';
  import { getPhysicalOrderLists, cancelOrDelOrder } from '@/api/index.js';

  export default {
    name: 'Order',
    data() {
      return {
        lists:[],
        page: 1,
        allowLoadMore: true,
        listLoadedAll: false,
        noLists: false,
        emptyIcon:require('../../assets/baiye/empty001.png'),

        status: -1,
        navs: [{
          name: '全部',
          status: -1,
        }, {
          name: '待支付',
          status: 1,
        }, {
          name: '交易中',
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
        getPhysicalOrderLists({
          user_id: this.$store.state.user.userid,
          page:this.page,
          status: this.status,
          type: 2
        }).then(res => {
          if (res.data.data.length < 20) this.listLoadedAll = true;
          if (res.data.data.length == 0 && this.lists.length == 0) this.noLists = true;
          this.lists.push(...res.data.data);
          this.allowLoadMore = true;
          this.page++;
        })
      },

      //查看详情
      goOrderDetail(orderNo){
        this.$router.push({
          name:'OrderDetail',
          params:{
            orderNo:orderNo
          }
        })
      },

      //去评价
      goEvaluate(orderNo){
        this.$router.push({
          name:'Evaluate',
          params:{
            orderNo:orderNo
          }
        })
      },

      //立即支付
      goPayment(orderNo, totalMoney, canUse){
        this.$store.commit(SET_PAYMENT_OPTIONS, {
          canUse: canUse,
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
  @import './Order.less';

</style>
