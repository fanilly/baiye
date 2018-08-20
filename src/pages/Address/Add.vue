<template>
  <div class="container">

  </div>
</template>
<script>
  import { getIssueLists } from '@/api/index.js';

  export default {
    name: 'AddressAdd',
    data() {
      return {
        lists:[],
        loaded:false,
        emptyIcon:require('../../assets/k2.png'),
      };
    },
    methods: {

    },
    mounted() {

    }
  };

</script>
<style lang="less" scoped>

</style>
