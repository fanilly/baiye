<template>
  <div class="container mj-vux-box">

    <header class="header-search">
      <section class="header-search-lside">
        <img :src="icon">
      </section>
      <section class="header-search-center">{{coordinateName}}</section>
      <section class="header-search-rside" @click="jumpSearch">请输入商品名称</section>
    </header>
    <section class="header-palceholder"></section>

    <div class='scrollBox'>
      <scroller class='' @getData="getIndexNearShop">

      <div class='swiperbox'>
      <swiper dots-position="center"
        dots-class="dots"
        :aspect-ratio="0.394"
        :show-desc-mask="false"
        :list="banners"
        class="swiper"></swiper>
      </div>

      <h1 class="title">附近的店</h1>
      <section class="shop-list">
        <router-link class="list-item"
          :to="{name:'Shop',params:{shopid:item.id}}"
          v-for="(item,index) in nearshop"
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

      <load-more :show-loading="!commentLoadedAll && !noCommentLists" :tip="!commentLoadedAll && !noCommentLists ? '加载中' : '已加载全部数据'" background-color="#fbf9fe"></load-more>
      </scroller>
    </div>

    <footer-nav active-index="0"></footer-nav>

  </div>
</template>
<script>
  import { LoadMore } from 'vux';
  import scroller from '@/components/scroller/scroller.vue';
  import { SET_SEARCH_RESULT } from '@/store/mutation-type.js';

  import footerNav from '@/components/footerNav/footerNav.vue';
  import { Swiper } from 'vux';
  import { mapActions } from 'vuex';
  import { getIndexBanner, getWxSettings, getCoorDinateName, getIndexNearShop } from '@/api/index.js';

  export default {
    name: 'Index',
    data() {
      return {
        userType: this.$store.state.user.userType,
        myShop: null,
        coordinateName:'获取中...',
        myShopIcon01: require('../../assets/baiye/myshop1.png'),
        myShopIcon02: require('../../assets/baiye/myshop2.png'),
        icon: require('../../assets/baiye/icon01@2x.png'),
        lists: [],
        banners: [],

        nearshop:[],

        page:1,
        commentLoadedAll:false,
        noCommentLists:false,
        allowLoadMore: true,
      };
    },
    async mounted() {
      getIndexBanner().then(res => {
        if (res.data.code == 1) {
          let resData = res.data.data;
          this.banners = resData.map(item => ({
            img: item.img_url,
            url: item.url
          }));
        }
      });


      getWxSettings().then(res => {
        let data = res.data.data;
        this.wx.config({
          debug: global.isDev,
          appId: data.appid,
          timestamp: data.timestamp,
          nonceStr: data.nonceStr,
          signature: data.signature,
          jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage']
        });
      });

      let self = this;
      this.wx.ready(function() {
        self.wx.onMenuShareTimeline({
          title: global.websiteName,
          link: location.href,
          imgUrl: global.logoUrl,
          success: () => {}
        });
        self.wx.onMenuShareAppMessage({
          title: global.websiteName,
          desc: global.websiteDesc,
          link: location.href,
          imgUrl: global.logoUrl,
          success: () => {}
        });
      });

      if(!this.$store.state.coordinate.latitude) await this.getCoordinate();
      this.getIndexNearShop()
      getCoorDinateName({
        lat: this.$store.state.coordinate.latitude,
        lng: this.$store.state.coordinate.longitude,
      }).then(res=>{
        if(res.data.code == 1) this.coordinateName = res.data.data.address;
      })

    },
    methods: {
      ...mapActions(['getCoordinate']),
      jumpSearch(){
        this.$router.push({
          name:'Search'
        });
      },
      getIndexNearShop() {
        if(!this.allowLoadMore || this.commentLoadedAll || this.noCommentLists) return;
        this.allowLoadMore = false;
        getIndexNearShop({
          latitude: this.$store.state.coordinate.latitude,
          longitude: this.$store.state.coordinate.longitude,
          page: this.page
        }).then(res => {
          //console.log('首页店铺',res)
          if (res.data.code == 1) {
            if (res.data.data.length < 20) this.commentLoadedAll = true;
            if (res.data.data.length == 0 && this.nearshop.length == 0) this.noCommentLists = true;
            this.nearshop.push(...res.data.data);
            this.allowLoadMore = true;
            this.page++;
          }

        });
      },
    },
    components: {
      footerNav,
      Swiper,
      scroller,
      LoadMore
    }
  };

</script>
<style lang="less" scoped>
  @import './Index.less';

</style>
