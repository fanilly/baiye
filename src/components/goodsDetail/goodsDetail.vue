<template>
  <section class="container">
    <section class="mask" @click="maskHandle"></section>
    <section class="content">
      <section class="content-wapper">
        <img :src="closeIcon" alt="" class="close" @click="maskHandle">
        <img class="goods-poster" v-lazy="goodsData.attachment_path" alt="">
        <h1>{{goodsData.title}}</h1>
        <div class="title-box">
          <h2><span>￥</span>{{goodsData.shop_price}}</h2>
          <template v-if="goodsData.attr.length == 0 && goodsData.is_storage != 1">
            <div class="control-box">
              <template v-if="goodsData.num>=1">
                <span class="icon-box reduce" @click.stop="reduce"><i class="iconfont icon-iconjian"></i></span>
                <span class="count-box">{{goodsData.num}}</span>
              </template>
              <span class="icon-box plus" @click.stop="plus"><i class="iconfont icon-iconjia"></i></span>
            </div>
          </template>
          <span class="choose" @click.stop="choose" v-if="goodsData.attr.length == 0 && goodsData.is_storage == 1">立即购买</span>
          <span class="choose" @click.stop="choose" v-if="goodsData.attr.length > 0 && goodsData.is_storage != 1">选规格</span>
          <span class="choose" @click.stop="choose" v-if="goodsData.attr.length > 0 && goodsData.is_storage == 1">立即购买</span>
        </div>
        <div class="content-box" v-html="goodsData.body"></div>
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
    return {
      closeIcon: require('../../assets/baiye/close.png')
    };
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
    choose(e){
      this.$emit('choose',{
        parentIndex:this.detailParentIndex,
        currentIndex:this.detailCurrentIndex,
        goodsId:this.goodsData.id
      })
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
<style scoped>
.content-box>>>img{
  display: block;
}
</style>
<style lang="less" scoped>

@import './goodsDetail.less';

</style>
