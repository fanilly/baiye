<template>
  <div class="container">
    <header class="header">
      <img :src="headIcon"
        alt="">
    </header>

    <main class="main"
      v-if="lists.length!=0">
      <header class="main-header">
        <div class="lside">
          <img :src="lists[0].shop_avatar">
        </div>
        <div class="rside">
          <h2>{{lists[currentIndex].title}}<i>x</i><span>{{lists[currentIndex].number}}</span></h2>
          <h4>{{lists[currentIndex].type}}</h4>
          <p>{{lists[currentIndex].short_title}}</p>
        </div>
      </header>

      <section class="main-tip">
        <div class="main-tip-line"></div>
      </section>

      <section class="main-btngroups">
        <span :class="{btn:true,active:index == currentIndex}"
          v-for="item,index in lists"
          @click="currentIndex = index"><i>￥</i>{{item.price}}</span>
      </section>

      <section class="main-body">
        <div class="main-body-ruls">
          <div class="main-body-ruls-lside">
            有效期:
          </div>
          <div class="main-body-ruls-rside">
            {{lists[currentIndex].indate}}
          </div>
        </div>
        <div class="main-body-ruls">
          <div class="main-body-ruls-lside">
            使用须知:
          </div>
          <div :class="{'main-body-ruls-rside':true,'show-all':showDetail}"
            @click="showDetail = !showDetail">
            {{lists[currentIndex].content}}
          </div>
        </div>
      </section>

      <section class="main-btn">
        <section class="main-btn-content"
          @click="buyCoupon">
          立即购买
        </section>
      </section>

      <footer class="main-footer">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </footer>
    </main>

    <!-- empty page -->
    <div class="empty-status" v-if="loaded && lists.length == 0">
      <img :src="emptyIcon" />
      <div class="desc">该店铺暂未发布优惠券</div>
    </div>
  </div>
</template>
<script>
  import { LoadMore } from 'vux';
  import { getAllowBuyCouponList, buyCoupon } from '@/api/index.js';
  import { SET_PAYMENT_OPTIONS } from '@/store/mutation-type.js';
  import { mapActions } from 'vuex';

  export default {
    name: 'CouponBuy',
    props: {
      shopid: {
        require: true
      },
      waitid: {
        default: 0
      }
    },
    data() {
      return {
        currentIndex: 0,
        showDetail: false,
        lists: [],
        loaded: false,
        emptyIcon: require('../../assets/baiye/empty005.png'),
        headIcon: require('../../assets/package.png'),
      };
    },
    methods: {
      ...mapActions(['startPayment', 'testingOrder']),
      buyCoupon() {
        this.feedback.Loading.open('提交中');
          buyCoupon({
            id: this.lists[this.currentIndex].id,
            user_id: this.$store.state.user.userid,
            shop_id: this.shopid,
            waiter_id: this.waitid,
            table_id: 0
          }).then(res => {
            this.feedback.Loading.close();
            if (res.data.code == 1) {
              this.$store.commit(SET_PAYMENT_OPTIONS, {
                canUse: false,
                orderNo: res.data.data.order_no,
                orderType: 'CO',
                kind: 4,
                shopid: this.shopid
              });
              this.startPayment({router: this.$router, userid: this.$store.state.user.userid});
            } else {
              this.feedback.Toast({
                msg: res.data.info,
                timeout: 1200
              })
            }
          })

      }
    },
    mounted() {
      this.feedback.Loading.open('加载中');
      this.testingOrder({router: this.$router, userid: this.$store.state.user.userid});
      getAllowBuyCouponList({
        user_id: this.$store.state.user.userid,
        store_id: this.shopid
      }).then(res => {
        this.feedback.Loading.close();
        if (res.data.code == 1) {
          this.lists = res.data.data;
          this.loaded = true;
          console.log();
        } else {
          this.feedback.Toast({
            msg: res.data.info,
            timeout: 1200
          })
        }
      });
    },
    components: {
      LoadMore
    }
  };

</script>
<style lang="less"
  scoped>
  @import './Coupon.less';

</style>
