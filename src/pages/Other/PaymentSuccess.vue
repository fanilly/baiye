<template>
  <div class="container" v-cloak v-if="pageData">
    <div class="header">
      <img src="../../assets/success.png" class="icon">
      <h1>实付金额{{pageData.money}}元</h1>
    </div>
    <div class="nav">
      <router-link class="item" :to="{name:'Index'}">
        返回首页
      </router-link>
      <span class="line"></span>
      <span class="item" @click="handleGoDetail">
        {{kind == 1 ? '我的会员卡' : '订单详情'}}
      </span>
    </div>
    <div v-if="pageData && pageData.coupons && pageData.coupons.length >= 1">
      <div class="content">
        <img src="../../assets/a01.png" class="icon">
        <h2>恭喜您获得<span>{{pageData.amount}}元</span>优惠券</h2>
        <p>消费已满{{pageData.money}}元，赶快领取吧！</p>
        <div class="coupon-item" v-for="item,index in pageData.coupons" @click="handleChooseCoupon(item,index)">
          <div class="lside">
            <img src="../../assets/a02.png" v-if="!item.choosed">
            <img src="../../assets/a03.png" v-if="item.choosed">
          </div>
          <div class="center">
            <h3>{{item.shop_name}}</h3>
            <h4>{{item.title}}</h4>
            <p>有效期至{{item.end_time}}</p>
          </div>
          <div class="rside">
            <h3>{{item.money}}元</h3>
            <p>{{item.type == 'default' ? '优惠券' : item.type == 'back' ? '折扣券' : item.type == 'gift' ? '赠品券' : '满减券'}}</p>
          </div>
        </div>
      </div>
      <div class="placeholder-box100"></div>
      <div class="footer">
        <div>已选择{{totalMoney}}元优惠券</div>
        <div class="btn" @click="handleSubmit">立即领取</div>
      </div>
    </div>
  </div>
</template>
<script>
  import { paymentAfter, getUnionCoupons } from '@/api/index.js';

  export default {
    name: 'PaymentSuccess',
    props: {
      orderno: {
        require: true
      },
      type: {
        require: true
      },
      kind: {
        require: true
      },
      shopid: {
        require: true
      }
    },
    computed:{
      totalMoney(){
        var choosed = this.pageData.coupons.filter(item=>item.choosed);
        return choosed.length == 0 ? 0 : choosed.map(item=>item.money).reduce((total,num)=>(total+num));
      }
    },
    data() {
      return {
        pageData:null,
        allowGetUnionCoupons: true
      };
    },
    methods: {
      if(this.pageData.coupons[index].choosed){
        this.pageData.coupons[index].choosed = !this.pageData.coupons[index].choosed;
        return false;
      }
      handleChooseCoupon(item,index){
        if(this.totalMoney + item.money * 1 > this.pageData.amount * 1){
          this.feedback.Toast({
            msg: '选择金额不可超出最大限制',
            timeout: 1000
          })
        }else{
          this.pageData.coupons[index].choosed = !this.pageData.coupons[index].choosed;
        }
      },

      handleSubmit(){
        if(!this.allowGetUnionCoupons){
          this.feedback.Toast({
            msg: '不可重复领取'
          });
          return;
        }
        var choosed = this.pageData.coupons.filter(item=>item.choosed);
        if(choosed.length < 1){
          this.feedback.Toast({
            msg: '请选择要领取的券'
          });
        }else{
          this.feedback.Loading.open('领取中');
          getUnionCoupons({
            order_no: this.orderno,
            order_type: this.type,
            ids: choosed.map(item=>item.id).join(',')
          }).then(res=>{
            this.feedback.Loading.close();
            this.feedback.Toast({
              msg: res.data.info
            });
            if(res.data.code == 1){
              this.allowGetUnionCoupons = false;
            }
          })
        }
      },

      handleGoDetail(){
        if(this.kind == 1){
          this.$router.replace({
            name:'BuyVipCard',
            params: {
              storeid: this.shopid
            }
          });
        }else{
          this.$router.push({
            name:'OrderDetail',
            params:{
              orderNo:this.orderno
            }
          });
        }
      }
    },
    mounted() {
      //获取异业联盟优惠券列表
      paymentAfter({
        order_no: this.orderno,
        order_type: this.type,
        user_id: this.$store.state.user.userid
      }).then(res=>{
        if(res.data.code == 1){
          var data = res.data.data;
          data.coupons = data.coupons.map(item=>{
            item.choosed = false;
            return item;
          })
          this.pageData = data;
          for(let i=0; i<this.pageData.coupons.length; i++){
            if(this.pageData.coupons[i].money * 1 < this.pageData.amount * 1){
              this.pageData.coupons[i].choosed = true;
              break;
            }
          }
        }
      })
    }
  };

</script>
<style lang="less" scoped>
  @import '../../styles/variable.less';
  .container {
    width: 100%;
    min-height: 100vh;
    background-color: #f7f7f7;
  }
  .header {
    height: 2.8rem;
    background-color: #fff;
    padding: .45rem 0;
    .icon {
      width: 1.22rem;
      height: 1.22rem;
    }
    h1 {
      font-size: .36rem;
      color: #333;
      font-weight: normal;
      padding: .2rem 0;
    }
  }
  .nav {
    display: flex;
    align-items: center;
    position: relative;
    background-color: #fff;
    .item {
      flex: 1;
      line-height: .98rem;
      position: relative;
      font-size: .28rem;
    }
    .line {
      height: .26rem;
      border-left: 1px solid #f7f7f7;
      -webkit-transform: scaleX(.5);
      transform: scaleX(.5);
      -webkit-transform-origin: 0 0;
      transform-origin: 0 0;
    }
    &:after {
      .top-line(#f7f7f7);
    }
  }
  .content {
    margin-top: .2rem;
    text-align: center;
    padding: .5rem .4rem;
    background-color: #fff;
    .icon {
      width: 1.86rem;
      height: 1.86rem;
    }
    &>h2 {
      font-size: .34rem;
      font-weight: bold;
      color: #333;
      padding: .3rem 0 .1rem;
      span {
        color: #ff682c;
      }
    }
    &>p {
      font-size: .26rem;
      color: #666;
      margin-bottom: .6rem;
    }
    .coupon-item {
      display: flex;
      align-items: center;
      height: 1.88rem;
      box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.08);
      border-radius: .1rem;
      overflow: hidden;
      margin-bottom: .3rem;
      .lside {
        padding: 0 0 0 .3rem;
        img {
          width: .38rem;
          height: .38rem;
        }
      }
      .center{
        flex: 1;
        position: relative;
        height: 1.88rem;
        text-align: left;
        padding: .2rem .3rem;
        overflow: hidden;
        h3 {
          font-size: .3rem;
          font-weight: normal;
          line-height: .4rem;
          height: .8rem;
          overflow: hidden;
        }
        h4 {
          font-size: .26rem;
          color: #777;
          font-weight: normal;
          padding-bottom: .1rem;
         .text-overflow-ellipsis;
        }
        p {
          font-size: .22rem;
          .text-overflow-ellipsis
        }
      }
      .rside {
        width: 1.88rem;
        height: 1.88rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-image: linear-gradient(150deg, #ffa21d 0%, #ffaf3d 100%), linear-gradient( #ffbf64, #ffbf64);
        color: #fff;
        position: relative;
        h3 {
          font-size: .42rem;
        }
        p {
          font-size: .24rem;
        }
        &:before{
          content: '';
          display: block;
          width: .36rem;
          height: .36rem;
          border-radius: 50%;
          position: absolute;
          top: -.18rem;
          left: -.18rem;
          background-color: #fff;
          box-shadow: 0px -4px 25px 0px rgba(0, 0, 0, 0.06) inset;
        }
        &:after{
          content: '';
          display: block;
          width: .36rem;
          height: .36rem;
          border-radius: 50%;
          position: absolute;
          bottom: -.18rem;
          left: -.18rem;
          background-color: #fff;
          box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.06) inset;
        }
      }
    }
  }
  .placeholder-box100 {
    height: 1rem;
  }
  .footer {
    display: flex;
    position: fixed;
    bottom: 0;
    width: 100%;
    height: .98rem;
    left: 0;
    background-color: #fff;
    box-shadow: 0px -14px 28px 0px rgba(0, 0, 0, 0.06);
    align-items: center;
    div:first-child {
      flex: 1;
      font-size: .28rem;
      color: #333;
    }
    .btn {
      width: 3rem;
      line-height: .98rem;
      background-image: linear-gradient(150deg, #ffa21d 0%, #ffaf3d 100%), linear-gradient( #ffbf64, #ffbf64);
      color: #fff;
      font-size: .3rem;
    }
  }
</style>
