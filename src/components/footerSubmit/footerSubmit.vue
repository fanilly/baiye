<template>
  <section class="footer-wapper">
    <section class="placeholder-box"></section>
    <footer class="footer">
      <div @click.stop="handleSubmit">{{btnTxt}}</div>
    </footer>
  </section>
</template>

<script>
  export default {
    name:'footer-submit',
    props: {
      btnTxt: {
        default: '确认'
      }
    },
    data() {
      return {

      }
    },
    methods:{
      handleSubmit(){
        this.$emit('handleSubmit')
      }
    },
    mounted(){
      console.log(this.$store)
    }
  }

</script>

<style scoped lang="less">
  @import './footerSubmit.less';
</style>
