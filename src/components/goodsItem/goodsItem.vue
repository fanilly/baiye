<template>
  <section class="goods-item">
    <section class="goods-item-lside">
      <img v-lazy="item.img_url">
    </section>
    <section class="goods-item-rside">
      <h3 class="goods-item-rside-title">{{ item.title }}</h3>
      <p class="goods-item-rside-info">月销：{{ item.sales }}份</p>
      <div class="goods-item-rside-control-box">
        <h4><span>￥</span>{{item.shop_price}}</h4>
        <template v-if="item.attr.length == 0 && item.is_storage != 1">
          <template v-if="item.num>=1">
            <span class="icon-box reduce" @click.stop="reduce"><i class="iconfont icon-iconjian"></i></span>
            <span class="count-box">{{item.num}}</span>
          </template>
          <span class="icon-box plus" @click.stop="plus"><i class="iconfont icon-iconjia"></i></span>
        </template>
        <span class="choose" @click.stop="choose" v-if="item.attr.length == 0 && item.is_storage == 1">立即购买</span>
        <span class="choose" @click.stop="choose" v-if="item.attr.length > 0 && item.is_storage != 1">选规格</span>
        <span class="choose" @click.stop="choose" v-if="item.attr.length > 0 && item.is_storage == 1">立即购买</span>
      </div>
    </section>
  </section>
</template>
<script>
export default {
  props: {
    parentIndex: {
      type: Number,
      require: true
    },
    currentIndex: {
      type: Number,
      require: true
    },
    baseurl: {
      type: String,
      default: ''
    },
    item: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {};
  },
  methods: {
    plus(e) {
      this.$emit('plus',{
        parentIndex:this.parentIndex,
        currentIndex:this.currentIndex,
        goodsId:this.item.id,
        isNoAttr: true,
      },e);
    },
    reduce(e) {
      this.$emit('reduce',{
        parentIndex:this.parentIndex,
        currentIndex:this.currentIndex,
        goodsId:this.item.id,
      },e);
    },
    choose(e){
      console.log('xxx');
      this.$emit('choose',{
        parentIndex:this.parentIndex,
        currentIndex:this.currentIndex,
        goodsId:this.item.id
      })
    }
  },
  mounted() {

  }
};

</script>
<style lang="less" scoped>
@import './goodsItem.less';

</style>
