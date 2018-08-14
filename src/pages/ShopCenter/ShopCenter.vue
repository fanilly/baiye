<template>
  <div class="container">

    <router-link class='user' :to="{name:'UserInfo'}">
      <div class="info">
        <a class="tx"><img :src="uerInfo.avatar" alt=""></a>
        <a class="come"><span class="tit3">{{uerInfo.nickName}}</span></a>
      </div>
    </router-link>

    <nav class="nav">
      <router-link to="/" class="item">
        <p>10</p>
        <h3>优惠券</h3>
      </router-link>
      <router-link :to="{name:'MoneyRest',params:{waitid:shopid}}" class="item">
        <p><span>￥</span>100.00</p>
        <h3>我的钱包</h3>
      </router-link>
      <router-link to="/" class="item">
        <p>10</p>
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
          { name: '领取优惠券', url: '/Order', words: '', src: require('../../assets/icon01.png') },
          { name: '会员卡', url: '/Collection', words: '', src: require('../../assets/icon02.png') },
            ],
        uerInfo: this.$store.state.user,
      };
    },
    mounted() {

    },
    components: {

    }
  };

</script>
<style lang="less" scoped>
  @import './ShopCenter.less';
</style>
