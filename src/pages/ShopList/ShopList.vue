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


    <!-- near -->
    <div class="nearshop">
      <scroller @getData="getIndexNearShop">
        <div class="list">
          <router-link class="item  scroll-item" v-for="(item,index) in nearshop" :key='index' :to="{name:'Shop',params:{shopid:item.id}}">
            <div class="pic"><img :src="item.shop_avatar" alt=""></div>
            <div class="info">
              <h4>{{item.name}}</h4>
              <div class='one'>
                <div class="star">
                  <i :class="{'on':item.grade>0}"></i>
                  <i :class="{'on':item.grade>1}"></i>
                  <i :class="{'on':item.grade>2}"></i>
                  <i :class="{'on':item.grade>3}"></i>
                  <i :class="{'on':item.grade>4}"></i>
                </div>
                <div class="sales">月销{{item.month_sell}}</div>
              </div>
              <div class="two">
                <i>{{item.is_dada?"达达专送":"商家自配"}}</i>
                <span>{{item.minimum}}元起送</span>
                <b></b>
                <span>{{item.distance}}</span>
              </div>
              <!-- <div class="tips">
                <p><i class='color1'>满赠</i>进入指定专区，购买满赠产品就可以获得赠品</p>
                <p><i class='color2'>折扣</i>活动商品0.3折起</p>
              </div> -->
            </div>
          </router-link>
        </div>
        <load-more :show-loading="!commentLoadedAll && !noCommentLists" :tip="!commentLoadedAll && !noCommentLists ? '加载中' : '已加载全部数据'" background-color="#fbf9fe"></load-more>
      </scroller>
    </div>
    <!-- near -->



  </div>
</template>
<script>
  import { LoadMore } from 'vux';
  import scroller from '@/components/scroller/scroller.vue';

  import footerNav from '@/components/footerNav/footerNav.vue';
  import { Swiper } from 'vux';
  import { mapActions } from 'vuex';
  import { getIndexBanner, getWxSettings, getNearStore, getMyShop, getCoorDinateName, getIndexMenu,getIndexHot, getIndexCommand, getIndexNearShop } from '@/api/index.js';

  export default {
    name: 'ShopList',
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
        indexMenu:[],
        smallBanner:[],
        hotList:[],
        nearshop:[],
        cateId:'',
        page:1,
        commentLoadedAll:false,
        noCommentLists:false,
        allowLoadMore: true,
      };
    },
    created(){
      this.cateId = this.$route.params.cateid
    },
    async mounted() {

      if(!this.$store.state.coordinate.latitude) await this.getCoordinate();
      //this.getNearStore();
      this.getIndexNearShop()
      
      getCoorDinateName({
        lat: this.$store.state.coordinate.latitude,
        lng: this.$store.state.coordinate.longitude,
      }).then(res=>{
        if(res.data.code == 1){
          this.coordinateName = res.data.data.address;
        }
      })

    },
    methods: {
      ...mapActions(['getCoordinate']),
      jumpSearch(){
        this.$router.push({
          name:'Search'
        });
      },
      //获取附近的店
      getNearStore() {
        getNearStore({
          latitude: this.$store.state.coordinate.latitude,
          longitude: this.$store.state.coordinate.longitude
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
          lat: this.$store.state.coordinate.latitude,
          lng: this.$store.state.coordinate.longitude,
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
      },
      getIndexNearShop() {
        if(!this.allowLoadMore || this.commentLoadedAll || this.noCommentLists) return;
        this.allowLoadMore = false;
        getIndexNearShop({
          latitude: this.$store.state.coordinate.latitude,
          longitude: this.$store.state.coordinate.longitude,
          page: this.page,
          cate_id:this.cateId
        }).then(res => {
          //console.log('首页店铺',res)
          if (res.data.code == 1) {
            //this.nearshop = res.data.data
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
      scroller,
      LoadMore
    }
  };

</script>
<style lang="less"
  scoped>
  @import './ShopList.less';

</style>
