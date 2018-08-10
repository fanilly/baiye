<template>
  <section class="container">
    <section class="mask" @click="maskHandle"></section>
    <section class="content">
      <section class="content-wapper">
        <img class="goods-poster" v-lazy="goodsData.attachment_path" alt="">
        <h1>{{goodsData.title}}</h1>
        <div class="title-box">
          <h2><span>￥</span>{{goodsData.shop_price}}</h2>
          <div class="control-box">
            <template v-if="goodsData.num>=1">
              <span class="icon-box reduce" @click.stop="reduce"><i class="iconfont icon-iconjian"></i></span>
              <span class="count-box">{{goodsData.num}}</span>
            </template>
            <span class="icon-box plus" @click.stop="plus"><i class="iconfont icon-iconjia"></i></span>
          </div>
        </div>
        <div class="content-box" v-html="goodsData.body">

        </div>
        <div class="desc"></div>
      </section>
    </section>
  </section>
</template>
<script>
export default {
  name: 'goodsDetail',
  props: {
    goodsData: {
      type: Object
    },
    detailCurrentIndex:{
      type:Number
    },
    detailParentIndex:{
      type:Number
    }
  },
  data() {
    return {};
  },
  methods: {
    plus(e) {
      this.$emit('plus',{
        parentIndex:this.detailParentIndex,
        currentIndex:this.detailCurrentIndex,
        goodsId:this.goodsData.id,
        isNoAttr:true
      },e);
    },
    reduce(e) {
      this.$emit('reduce',{
        parentIndex:this.detailParentIndex,
        currentIndex:this.detailCurrentIndex,
        goodsId:this.goodsData.id,
      },e);
    },
    maskHandle() {
      this.$emit('maskHandle');
    }
  },
  mounted() {
    console.log(this.goodsData);
  }
};

</script>
<style lang="less" scoped>
@import './goodsDetail.less';

</style>
