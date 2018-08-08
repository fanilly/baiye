<template>
  <section class="scroller-wapper" ref="scrollerWapper">
    <slot></slot>
  </section>
</template>
<script>
export default {
  data() {
    return {
      timer:null,
      items: null
    };
  },
  mounted(){
    this.scrollView = this.$refs.scrollerWapper;
    this.scrollView.addEventListener('scroll',this.scrollHandler);
    this.viewportHeight = document.body.clientHeight || document.documentElement.clientHeight;
  },
  methods: {
    scrollHandler(){
      clearTimeout(this.timer);
      this.timer = setTimeout(()=>{
        this.items = this.scrollView.querySelectorAll('.scroll-item');
        this.lastItem = this.items[this.items.length-1];
        if(this.lastItem.getBoundingClientRect().top -500 < this.viewportHeight){
          this.$emit('getData');
        }
      },200);
    }
  }
};

</script>
<style lang="less" scoped>
@import './scroller.less';

</style>
