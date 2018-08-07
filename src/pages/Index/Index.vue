<template>
  <div class="container">
    <footer-nav active-index="0"></footer-nav>
  </div>
</template>
<script>
  import footerNav from '@/components/footerNav/footerNav.vue';

  export default {
    name: 'Index',
    data() {
      return {

      };
    },
    beforeCreate(){
      document.title = '首页';
    },
    mounted() {

    },
    components: {
      footerNav,
    }
  };

</script>
<style lang="less" scoped>
  @import './Index.less';
</style>
