<template>
  <section class="qlist">
    <div :class="{item:true,out:item.status!=0}">
      <div class="fone">
        <div class="fleft">
          <img :src="icon01" style="width: 1.04rem;" />
          <div class="tit2" v-if="item.type == 0">折扣券</div>
          <div class="tit2" v-if="item.type == 1">满减券</div>
          <div class="tit2" v-if="item.type == 2">转赠券</div>
          <div class="tit2" v-if="item.type == 3">分享券</div>
        </div>
        <div class="fright">
          <div class="tit1">{{item.name}} {{item.coupon_count ? '（' + item.coupon_count + '张）' : ''}}</div>
          <div class="tit2" v-if="item.shop_name">仅{{item.shop_name}}可用</div>
          <div class="tit2" v-if="item.end_time==''">永久有效 <span @click="handleGoUse(item.shop_id)" v-if="item.status == 0 && item.shop_id">去使用</span></div>
          <div class="tit2" v-if="item.end_time !=''">有效期至：{{item.end_time}} <span @click="handleGoUse(item.shop_id)" v-if="item.status == 0 && item.shop_id">去使用</span></div>
        </div>
        <img v-if="item.status ==2" class="dimg" :src="icon02" />
        <img v-if="item.status ==1" class="dimg" :src="icon03" />
      </div>
      <div class="dw">
        <div class="dl"></div>
        <div class="dr"></div>
      </div>
      <div class="rules" v-if="item.type !='4'">订单满{{item.min_money}}元可以使用</div>
    </div>
  </section>
</template>
<script>
  export default {
    name:'couponItem',
    props: {
      item: {
        type: Object,
        default: {},
        required: true
      }
    },
    data() {
      return {
        icon01: require('../../assets/coupon_2.png'),
        icon02: require('../../assets/quan_03.png'),
        icon03: require('../../assets/quan_06.png'),
      };
    },
    methods: {
      handleReceiveCoupon() {
        this.$emit('handleReceiveCoupon');
      },
      handleGoUse(shopId){
        this.$router.push({
          name:'Shop',
          params:{
            shopid:shopId
          }
        })
      }
    }
  };

</script>
<style lang="less" scoped>
  @import './coupon.less';
</style>
