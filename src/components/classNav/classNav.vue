<template>
  <ul class="navs">
    <li v-for="item,index in navs" :class="{active:index == navsIndex}" @click="handleToggleNavs(index)">{{item.name}}</li>
  </ul>
</template>

<script>
  export default {
    props: {
      navs: {
        require: true,
        type: Array
      }
    },
    data() {
      return {
        navsIndex: 0,
      }
    },
    methods:{
      handleToggleNavs(index){
        this.navsIndex = index;
        this.$emit('toggleNavs',this.navs[this.navsIndex]);
      }
    },
    mounted(){

    }
  }

</script>

<style scoped lang="less">
  @import './classNav.less';
</style>
