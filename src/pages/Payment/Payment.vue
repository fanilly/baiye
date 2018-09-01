<template>
  <section class="container">
    <header class="header">
      <h1>支付金额</h1>
      <h2><span>￥</span>{{$store.state.payment.totalMoney}}</h2>
    </header>
    <main class="main">
      <section class="payment-item" v-for="(item,index) of paymentMethods" :key="index" @click="currentChoosedIndex = index">
        <div class="payment-item-lside">
          <span><img :src="item.icon" alt=""></span>
        </div>
        <div class="payment-item-center">
          <h3>{{item.name}}</h3>
        </div>
        <div class="payment-item-rside">
          <div :class="'choose-btn '+(index == currentChoosedIndex ? 'choosed' : '')"><span><i class="iconfont icon-duigou"></i></span></div>
        </div>
      </section>
    </main>
    <footer-submit @handleSubmit="handleSubmit" btn-txt="确认支付"></footer-submit>
  </section>
</template>

<script>

  import footerSubmit from '@/components/footerSubmit/footerSubmit.vue';
  import { balancePayment } from '@/api/index.js';
  import { mapActions } from 'vuex';
  export default {
    name: 'Payment',
    data() {
      return {
        currentChoosedIndex: 0,
        paymentMethods: [{
          name: '微信支付',
          icon: require('../../assets/wx.png')
        }]
      };
    },
    methods: {
      ...mapActions(['startPayment', 'testingOrder']),
      //确认支付
      handleSubmit() {
        this.currentChoosedIndex == 1 &&  this.balancePayment();
        this.currentChoosedIndex != 1 && this.startPayment({router: this.$router, userid: this.$store.state.user.userid});
      },
      //余额支付
      balancePayment() {
        balancePayment({
          order_no: this.$store.state.payment.orderNo,
          user_id: this.$store.state.user.userid,
          order_type: this.$store.state.payment.orderType
        }).then(res => {
          if (res.data.code == 1) {
            this.feedback.Toast({
              msg: res.data.info,
              timeout: 1000
            });
            setTimeout(() => {
              var str = ''
              this.$router.replace({
                name:'Order'
              });
            }, 1000)
          } else {
            this.feedback.Toast({
              msg: res.data.info,
              timeout: 1000
            });
          }
        });
      },
    },
    mounted() {
      if(!this.$store.state.payment.orderNo){
        let paymentCallbackData = localStorage.getItem('PAYMENT_CALLBACK');
        if(paymentCallbackData){
          this.testingOrder({router: this.$router, userid: this.$store.state.user.userid});
        }else{
          // store
          this.feedback.Notify({
            msg:'订单信息有误,请重新选择支付',
            timeout:1800,
            callback:()=>{
              this.$router.go(-1)
            }
          });
          return;
        }
      }
      if (this.$store.state.payment.canUse) {
        this.paymentMethods.push({
          name: '余额支付',
          icon: require('../../assets/ye.png'),
        })
      }
    },
    components: {
      footerSubmit
    }
  };

</script>

<style lang="less" scoped>
  @import './Payment.less';

</style>
