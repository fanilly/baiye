<template>
  <div class="container">
    <footer-nav active-index="1"></footer-nav>
  </div>
</template>
<script>
  import footerNav from '@/components/footerNav/footerNav.vue';

  export default {
    name: 'Order',
    data() {
      return {

      };
    },
    beforeCreate(){
      document.title = '订单';
    },
    mounted() {

    },
    components: {
      footerNav,
    }
  };

</script>
<style lang="less" scoped>
  @import './Order.less';
</style>
