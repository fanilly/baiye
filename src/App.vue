<template>
  <div id="app">
    <transition name="fade">
      <keep-alive v-if="$route.meta.keepAlive">
        <router-view class="child-view" />
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive" class="child-view" />
    </transition>
  </div>
</template>
<script>
export default {
  name: 'App',
  data() {
    return {
      transitionName: ''
    };
  },
  watch: {
    // '$route' (to, from) {
    //   // this.transitionName = to.path.length == 1 ? 'slide-right' : 'slide-left';
    // }
  }
};

</script>
<style lang="less" scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: #fff;
}

</style>
