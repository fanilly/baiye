<template>
  <div class="container">
    <footer-nav active-index="2"></footer-nav>
  </div>
</template>
<script>
  import footerNav from '@/components/footerNav/footerNav.vue';

  export default {
    name: 'Center',
    data() {
      return {

      };
    },
    mounted() {

    },
    components: {
      footerNav,
    }
  };

</script>
<style lang="less" scoped>
  @import './Center.less';
</style>
