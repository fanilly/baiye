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
  import { balancePayment, wechatPayment, getWxSettings } from '@/api/index.js';
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
      //确认支付
      handleSubmit() {
        if (this.currentChoosedIndex == 1) {
          this.balancePayment();
        }else{
          this.wechatPayment();
        }
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
      //微信支付
      wechatPayment() {
        wechatPayment({
          order_no: this.$store.state.payment.orderNo,
          user_id: this.$store.state.user.userid,
          order_type: this.$store.state.payment.orderType,
          type: 2
        }).then(res=>{
          this.wx.chooseWXPay({
            timestamp: res.data.data.timestamp.toString(),
            nonceStr: res.data.data.nonceStr,
            package: res.data.data.package,
            signType: res.data.data.signType,
            paySign: res.data.data.paySign,
            success: res=> {
              let msg = this.$store.state.payment.kind == 1
                ? '付款成功，现在为你跳转会员卡页面'
                : this.$store.state.payment.kind == 3
                ? '付款成功，现在为你跳转虚拟店页面'
                : '付款成功，现在为你跳转订单页面';
              this.feedback.Alert({
                msg:'付款成功，现在为你跳转订单页面',
                callback:()=>{
                  if (this.$store.state.payment.kind == 1) {
                    this.$router.replace({
                      name:'buyVipCard',
                      params: {
                        storeid: this.$store.state.payment.shopid
                      }
                    });
                  } else if (this.$store.state.payment.kind == 3) {
                    this.$router.replace({
                      name:'FictitiousOrder'
                    });
                  } else {
                    this.$router.replace({
                      name:'Order'
                    });
                  }
                }
              })
            },
            fail:err=>{
              this.feedback.Toast({
                msg:JSON.stringify(err),
                timeout:1500
              })
            }
          });
        })
      }
    },
    mounted() {
      if(!this.$store.state.payment.orderNo){
        this.feedback.Notify({
          msg:'订单信息有误,请重新选择支付',
          timeout:1800,
          callback:()=>{
            this.$router.go(-1)
          }
        })
        return;
      }
      if (this.$store.state.payment.canUse) {
        this.paymentMethods.push({
          name: '余额支付',
          icon: require('../../assets/ye.png'),
        })
      }
      getWxSettings().then(res => {
        let data = res.data.data;
        this.wx.config({
          debug: global.isDev,
          appId: data.appid,
          timestamp: data.timestamp,
          nonceStr: data.nonceStr,
          signature: data.signature,
          jsApiList: ['chooseWXPay']
        });
      });
    },
    components: {
      footerSubmit
    }
  };

</script>

<style lang="less"
  scoped>
  @import './Payment.less';

</style>
