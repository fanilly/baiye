<template>
  <div class="container">
    <div class="wapper" v-if="followData">
      <img class="head-bg-arc" :src="followData.background">
      <div class="container">
        <section style="position: relative; width: 100%; height: 100%;">
          <div class="content">
            <img class="logo" :src="followData.logo" alt="">
            <h1>又来客了</h1>
            <h3>您还没关注公众号</h3>
            <div id="qrcode" align="center" style="display:none"></div>
            <div class="eqrimg">
              <img :src="'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket='+followData.ticket" style="width:200px"/>
            </div>
            <p>请长按二维码，关注公众号！</p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
<script>
  import { getFollowData } from '@/api/index.js';

  export default {
    name: 'Follow',
    data() {
      return {
        followData: null
      };
    },
    mounted() {
      getFollowData().then(res=>{
        console.log(res)
        if(res.data.code == 1){
          this.followData = res.data.data;
        }else{
          this.feedback.Toast({
            msg:res.data.info,
            timeout: 1200
          })
        }
      })
    }
  };

</script>
<style lang="less" scoped>
  .container {
    width: 100%;
  }

  .wapper {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background-color: #fff;
    .head-bg-arc {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
    }
    .container {
      position: fixed;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      box-sizing: border-box;
      padding: .3rem .3rem .5rem;
    }
    .content {
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: #fff;
      z-index: 999;
      box-shadow: 0 .15rem .3rem rgba(0, 24, 255, .11);
      display: flex;
      flex-direction: column;
      text-align: center;
      align-items: center;
      padding-top: .7rem;
      border-radius: .2rem;
      .logo {
        width: 2.04rem;
        height: 2.04rem;
      }
      h1 {
        font-size: .34rem;
        color: #333;
        padding: .2rem 0 1.6rem;
        font-weight: bold;
      }
      h3 {
        font-size: .34rem;
        color: #ff3d4b;
        padding: .2rem 0;
        font-weight: normal;
      }
      p {
        font-size: .3rem;
        color: #333;
        padding: 0 0 1rem;
      }
    }
  }
</style>
