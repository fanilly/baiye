<template>
  <div class="container">


    <div class='card'>
      <div class='tit3'>
        <img class='timg' src='../../assets/hyk_20.png' />
        <span>会员卡详情</span>
        <img class='bimg' src='../../assets/hhhh_09.png' />
      </div>
      <div class='list' bindtap='godetail'>
        <img class='card-bg' :src='cardinfo.surface' />
        <div class="card-surface">
          <div class="card-surface-title">
            <img class="tx-img" :src='shopinfo.avatar' />{{shopinfo.name}}
          </div>
          <div class="card-surface-content">
            <div class="title">{{cardinfo.name}}</div>
            <div class="date" v-if="cardinfo.effective">有效期:{{cardinfo.effective}}个月</div>
            <div class="date" v-if="!cardinfo.effective">有效期:永久有效</div>

          </div>
        </div>
        <div class="price">￥<span class="font60">{{cardinfo.price}}</span></div>
      </div>
    </div>
    <div class='quanyi'>
      <div class='tit3'>
        <img class='timg' src='../../assets/hyk_20.png' />
        <span>会员卡专享权益</span>
        <img class='bimg' src='../../assets/hhhh_09.png' />
      </div>
      <div>
        <span class="readme">{{cardinfo.readme}}</span>
      </div>
    </div>
    <div class='fbottom' v-if="status==0">
      <!--  bindtap='gopay' data-cardid="{{cardinfo.aid}}" -->
      <div class='submit JB' @click='goBuyVipCard'>立即购买</div>
    </div>
    <div class='fbottom' v-if="status==2">
      <div class='submit JC'>已充值</div>
    </div>


  </div>
</template>

<script>
  import { SET_PAYMENT_OPTIONS } from '../../store/mutation-type.js';
  import { getVipCardDetail, getPhysicalShopDetail, goBuyVipCard } from '@/api/index.js';
  import { mapActions } from 'vuex';

  export default {
    name: 'BuyVipDetail',
    data() {
      return {
        host: global.host,
        storeid: '',
        goodid: '',
        status: 0,
        waitid: '',
        cardinfo: {},
        shopinfo: {},
        orderNo: '',
        total_money: '',
      };
    },

    created() {
      this.storeid = this.$route.params.storeid
      this.goodid = this.$route.params.goodid
      this.status = this.$route.params.status
    },

    mounted() {
      this.testingOrder({router: this.$router, userid: this.$store.state.user.userid});
      this.getVipCardDetail()
      this.getPhysicalShopDetail()
    },

    methods: {
      ...mapActions(['startPayment', 'testingOrder']),
      //获取实体店店铺信息
      getPhysicalShopDetail() {
        getPhysicalShopDetail({
          user_id: this.$store.state.user.userid,
          id: this.storeid
        }).then(res => {
          console.log('获取店铺信息', res)
          if (res.data.code == 1) {
            this.shopinfo = res.data.data;
          } else {
            this.feedback.Toast({ msg: res.data.info, timeout: 1500 });
          }
        })
      },

      //获取会员卡详细信息
      getVipCardDetail() {
        this.feedback.Loading.open('加载中');
        getVipCardDetail({
          aid: this.goodid
        }).then(res => {
          console.log('获取会员卡详细信息', res)
          this.feedback.Loading.close()
          if (res.data.code == 1) {
            this.cardinfo = res.data.data;
          } else {
            this.feedback.Toast({ msg: res.data.info, timeout: 1500 });
          }
        })
      },

      //购买会员卡
      goBuyVipCard() {
        this.feedback.Loading.open('提交中');
        //生成购买会员卡订单
        goBuyVipCard({
          uid: this.$store.state.user.userid,
          aid: this.goodid,
          store_id: this.storeid,
          waiter_id: this.waitid,
        }).then(res => {
          this.feedback.Loading.close();
          if (res.data.code == 1) {
            this.$store.commit(SET_PAYMENT_OPTIONS, {
              canUse: false,
              orderNo: res.data.data.order_no,
              orderType: 'CD',
              kind: 1,
              shopid: this.storeid
            });
            this.startPayment({router: this.$router, userid: this.$store.state.user.userid});
          }else{
            this.feedback.Toast({msg:res.data.info});
          }
        })
      }
    }
  };

</script>

<style lang="less" scoped>
  @import './BuyVipDetail.less';
</style>
