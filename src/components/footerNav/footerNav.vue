<template>
  <section class="footer-wapper">
    <section class="placeholder-box"></section>
    <footer class="footer">
      <router-link class="item" v-for="(item, index) of navs" :key="index" :to="item.pagePath">
        <img :src="index == activeIndex ? item.selectedIconPath : item.iconPath" alt="">
        <h4 :class="index == activeIndex ? 'active' : ''">{{item.text}}</h4>
      </router-link>
    </footer>
  </section>
</template>

<script>
  export default {
    props: {
      activeIndex: {
        require: true
      }
    },
    data() {
      return {
        navs: [
          {
            "pagePath": "/",
            "text": "首页",
            "iconPath": require('../../assets/baiye/title0-2@3x.png'),
            "selectedIconPath": require('../../assets/baiye/title0-1@3x.png')
          },
          {
            "pagePath": "/order",
            "text": "订单",
            "iconPath": require('../../assets/baiye/title0-3@3x.png'),
            "selectedIconPath": require('../../assets/baiye/title0-4@3x.png')
          },
          {
            "pagePath": "/center",
            "text": "我的",
            "iconPath": require('../../assets/baiye/title0-5@3x.png'),
            "selectedIconPath": require('../../assets/baiye/title0-6@3x.png')
          }
        ]
      }
    },
    mounted(){
      console.log(this.$store)
    }
  }

</script>

<style scoped lang="less">
  @import './footerNav.less';
</style>
