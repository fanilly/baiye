<template>
  <footer class="trolley" ref="footer">
    <section :class="{'trolley-icon':true, gray:!allowSellement}" @click="handleClickTrolley">
      <span><i class="iconfont icon-iconfontgouwuche"></i></span>
      <div v-if="total>=1" class="corner">{{total}}</div>
    </section>
    <div class="count">总计 <span><i>￥</i>{{totalPrice}}</span> 元 <em>{{minimumtxt}}</em></div>
    <div :class="{btn:true, gray:!allowSellement}" @click="handleClickBtn">{{lable}}</div>
  </footer>
</template>
<script>
export default {
  props: {
    lable: {
      type: String,
      default: '选好了'
    },
    total: {
      type: Number
    },
    totalMoney: {
      type: Number
    },
    minimum: {
      type: Number
    }
  },
  data() {
    return {};
  },
  computed:{
    totalPrice(){
      return Math.abs(this.totalMoney).toFixed(2);
    },
    minimumtxt(){
      let diff = (this.minimum - this.totalMoney).toFixed(2);
      if(this.minimum == 0){
        return '(0元起送)'
      }else if((this.minimum - this.totalMoney)*1 > 0){
        return `(还差${diff}元起送)`
      }else{
        return '';
      }
    },
    allowSellement(){
      if(this.minimum == 0 && this.total >= 1){
        if(this.total >= 1)
          return true;
        else
          return false;
      }
      return (this.minimum - this.totalMoney) * 1 <= 0
    }
  },
  methods: {
    handleClickBtn() {
      this.$emit('handleClickBtn',this.allowSellement);
    },
    initTrolleyPos() {
      this.$emit('initTrolleyPos', this.$refs.footer.offsetHeight);
    },
    handleClickTrolley() {
      this.$emit('handleClickTrolley');
    }
  },
  mounted() {
    this.initTrolleyPos();
  }
};

</script>
<style lang="less" scoped>
@import './footerTrolley.less';

</style>
