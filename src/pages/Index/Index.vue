<template>
  <div class="container mj-vux-box">

    <!-- banner -->
    <swiper dots-position="center"
      dots-class="dots"
      :aspect-ratio="0.549"
      :show-desc-mask="false"
      :list="banners"
      class="swiper"></swiper>

    <!-- shop list -->
    <h1 class="title">附近的店</h1>
    <section class="shop-list">

      <router-link class="list-item"
        to="/" v-if="myShop">
        <div class="top"
          :style="'background-image:url('+myShop.shop_avatar+')'">
          <img v-if="userType == 1"
            :src="myShopIcon01" />
          <img v-if="userType != 1"
            :src="myShopIcon02" />
        </div>
        <div class="info">
          <div class="title">
            <div class="text-ellipsis">{{myShop.name}}</div>
            <div>月销 {{myShop.month_sell}} 笔</div>
          </div>
          <div class="address">
            <div>
              <img :src="icon" />
            </div>
            <div class="distance">{{myShop.distance}}</div>
            <div class="name text-ellipsis">{{myShop.coordinate_address}}</div>
          </div>
        </div>
      </router-link>


      <router-link class="list-item"
        to="/"
        v-for="(item,index) in lists"
        :key="index">
        <div class="top"
          :style="'background-image:url('+item.shop_avatar+')'"></div>
        <div class="info">
          <div class="title">
            <div class="text-ellipsis">{{item.name}}</div>
            <div>月销 {{item.month_sell}} 笔</div>
          </div>
          <div class="address">
            <div>
              <img :src="icon" />
            </div>
            <div class="distance">{{item.distance}}</div>
            <div class="name text-ellipsis">{{item.coordinate_address}}</div>
          </div>
        </div>
      </router-link>

    </section>

    <footer-nav active-index="0"></footer-nav>

  </div>
</template>
<script>
  import footerNav from '@/components/footerNav/footerNav.vue';
  import { Swiper } from 'vux';
  import { getIndexBanner, getWxSettings, getNearStore, getMyShop } from '@/api/index.js';
  const wx = require('weixin-js-sdk');

  export default {
    name: 'Index',
    data() {
      return {
        userType: this.$store.state.user.userType,
        myShop: null,
        myShopIcon01: require('../../assets/baiye/myshop1.png'),
        myShopIcon02: require('../../assets/baiye/myshop2.png'),
        icon: require('../../assets/baiye/icon01@2x.png'),
        lists: [],
        banners: []
      };
    },
    mounted() {
      console.log(this.userType)
      // getWxSettings().then(res => {
      //   let data = res.data.data;
      //   wx.config({
      //     debug: true,
      //     appId: data.appid,
      //     timestamp: data.timestamp,
      //     nonceStr: data.nonceStr,
      //     signature: data.signature,
      //     jsApiList: ['getLocation','openlocation']
      //   });
      // });
      this.getNearStore();
      this.getMyShop();
      getIndexBanner().then(res => {
        if (res.data.code == 1) {
          let resData = res.data.data;
          this.banners = resData.map(item => ({
            img: item.img_url,
            url: item.url
          }));
        }
      });
    },
    methods: {
      //获取附近的店
      getNearStore() {
        getNearStore({
          latitude: 34.79977,
          longitude: 113.66072
        }).then(res => {
          console.log(res)
          if (res.data.code == 1) {
            this.lists.push(...res.data.data);
          }
        })
      },
      //获取我的店
      getMyShop() {
        getMyShop({
          lat: 34.79977,
          lng: 113.66072,
          user_id: this.$store.state.user.userid,
          type: 2
        }).then(res => {
          if (res.data.code == 1) {
            let resData = res.data.data;
            let myShop = {
              shop_avatar: resData.shop_avatar,
              month_sell: resData.sell_num,
              distance: resData.distance,
              coordinate_address: resData.coordinate_address,
              name: resData.name,
              id: resData.id,
              distance: resData.juli
            };
            this.myShop = myShop;
          }
        });
      }
    },
    components: {
      footerNav,
      Swiper,
    }
  };

</script>
<style lang="less"
  scoped>
  @import './Index.less';

</style>
