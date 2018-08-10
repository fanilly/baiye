<template>
  <footer class="trolley" ref="footer">
    <section class="trolley-icon" @click="handleClickTrolley">
      <span><i class="iconfont icon-iconfontgouwuche"></i></span>
      <div v-if="total>=1" class="corner">{{total}}</div>
    </section>
    <div class="count">总计 <span><i>￥</i>{{totalPrice}}</span> 元</div>
    <div class="btn" @click="handleClickBtn">{{lable}}</div>
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
    }
  },
  data() {
    return {};
  },
  computed:{
    totalPrice(){
      return this.totalMoney.toFixed(2);
    }
  },
  methods: {
    handleClickBtn() {
      this.$emit('handleClickBtn');
    },
    initTrolleyPos() {
      this.$emit('initTrolleyPos', this.$refs.footer.offsetHeight);
    },
    handleClickTrolley() {
      this.$emit('handleClickTrolley');
    }
  },
  mounted() {
    // console.log(this.$parent.);
    this.initTrolleyPos();
  }
};

</script>
<style lang="less" scoped>
@import './footerTrolley.less';

</style>
