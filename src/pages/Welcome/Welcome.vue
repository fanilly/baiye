<template>
  <div class="container">
    <img class="logo" :src="logo">
    <h1 class="mall-name">{{mallName}}</h1>
    <h2 class="table">桌号：{{table}}</h2>
    <h3 class="user-name">{{userInfo.nickName}}</h3>
    <p class="welcoming">您好，欢迎光临！</p>
    <router-link to="Shop" class="btn">开始点餐<i class="iconfont icon-jiantouyou"></i></router-link>
    <img :src="userInfo.avatarUrl" alt="" class="avatar">
    <p class="copyright">郑州xx科技信息有限公司版权所有</p>
  </div>
</template>
<script>
export default {
  name: 'Welcome',
  data() {
    return {
      logo: require('../../assets/logo.png'), //商城logo
      mallName: 'Mall 商城', //商城名称
      table: 'W31', //桌位
      userInfo: { //用户信息
        nickName: '卮言',
        avatarUrl: require('../../assets/photo.png')
      }
    };
  }
};

</script>
<style lang="less" scoped>
@import './Welcome.less';

</style>
