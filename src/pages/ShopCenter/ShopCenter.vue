<template>
  <div class="container">

    <router-link class='user' :to="{name:'UserInfo'}">
      <div class="info">
        <a class="tx"><img :src="uerInfo.avatar" alt=""></a>
        <a class="come"><span class="tit3">{{uerInfo.nickName}}</span></a>
      </div>
    </router-link>

    <nav class="nav" v-if="vipData">
      <router-link :to="{name:'CouponList',params:{shopid:shopid}}" class="item">
        <p>{{vipData.coupons_number }}</p>
        <h3>优惠券</h3>
      </router-link>
      <router-link :to="{name:'MyWallet',params:{storeid:shopid}}" class="item">
        <p><span>￥</span>{{vipData.money}}</p>
        <h3>我的钱包</h3>
      </router-link>
      <router-link :to="{name:'MyEvaluate',params:{storeid:shopid}}" class="item">
        <p>{{vipData.evaluation_number}}</p>
        <h3>我的评价</h3>
      </router-link>
    </nav>

    <div class='comelist'>
      <router-link v-for='item in nav' :key='item.name' class='link' :to='item.url'>
        <img class='limg' :src='item.src' />
        <div class='all'>
          <span>{{item.name}}</span>
          <img src='../../assets/return.png' class='rimg' />
        </div>
      </router-link>
    </div>

    <div class='support'>易倍增科技提供技术支持</div>
  </div>
</template>
<script>
  import { getShopCenterData } from '@/api/index.js';
  export default {
    name: 'ShopCenter',
    props:{
      shopid:{
        require:true
      }
    },
    data() {
      return {
        nav: [
          { name: '领取优惠券', url: `/Coupon/Buy/${this.shopid}/0`, words: '', src: require('../../assets/icon01.png') },
          { name: '会员卡', url: '/Collection', words: '', src: require('../../assets/icon02.png') },
        ],
        vipData:null,
        uerInfo: this.$store.state.user,
      };
    },
    mounted(){
      getShopCenterData({
        user_id: this.$store.state.user.userid,
        shop_id: this.shopid
      }).then(res=>{
        if(res.data.code == 1){
          this.vipData = res.data.data;
        }else{
          this.feedback.Toast({
            msg: res.data.info,
            timeout: 1200
          })
        }
      })
    }
  };

</script>
<style lang="less" scoped>
  @import './ShopCenter.less';
</style>
