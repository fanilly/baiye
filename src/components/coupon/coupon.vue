<template>
  <section class="qlist">
    <div :class="{item:true,out:item.status!=0}">
      <div class="fone">
        <div class="fleft">
          <img :src="icon01" style="width: 1.04rem;" />
          <div class="tit2" v-if="item.type != 4">优惠券</div>
          <div class="tit2" v-if="item.type == 4">赠品券</div>
        </div>
        <div class="fright">
          <div class="tit1">{{item.name}}</div>
          <div class="tit2" v-if="item.end_time==''">永久有效</div>
          <div class="tit2" v-if="item.end_time !=''">有限期至：{{item.end_time}}</div>
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
      }
    }
  };

</script>
<style lang="less" scoped>
  @import './coupon.less';
</style>
