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

    <scroller class='scrollBox' @getData="getIndexNearShop">
    <!-- banner -->
    <swiper dots-position="center"
      dots-class="dots"
      :aspect-ratio="0.394"
      :show-desc-mask="false"
      :list="banners"
      class="swiper"></swiper>

    <!-- shop list -->
    <!-- <h1 class="title">附近的店</h1>
    <section class="shop-list">

      <router-link class="list-item" :to="{name:'Shop',params:{shopid:myShop.id}}" v-if="myShop">
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
        :to="{name:'Shop',params:{shopid:item.id}}"
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

    </section> -->

    <!-- indexMenu -->
    <div class="indexMenu" v-if='smallBanner.length>0'>
      <router-link class="item" v-for="(item,index) in indexMenu" :key='index' :to="{name:'ShopList',params:{cateid:item.aid}}">
        <img :src="item.img_url" alt="">
        <!-- aid -->
        <span>{{item.group_name}}</span>
      </router-link>
    </div>
    <!-- indexMenu -->

    <!-- smallBanner -->
    <div class="smallBanner" v-if='smallBanner.length>0'>
      <a class="one" v-for='item in smallBanner' :href='item.link'>
        <div class="item"><img :src="item.img_url" alt=""></div>
      </a>
    </div>
    <!-- smallBanner -->

    <!-- hotcommend -->
    <div class="hotcommend" v-if='hotList.length>0'>
      <h3>人气推荐</h3>
      <div class="list">
        <div class="item" v-for="(item,index) in hotList" :key='index' @click='goShopIndex(item.shop_id,item.cate_id,item.goods_id,)'>
          <img :src="item.img_url" alt="" class="pic">
          <img src="../../assets/icon1.1.8@2x.png" alt="" v-if='index==0' class="icon">
          <img src="../../assets/icon1.1.9@2x.png" alt="" v-if='index==1' class="icon">
          <img src="../../assets/icon1.1.10@2x.png" alt="" v-if='index==2' class="icon">
          <span>{{item.title}}</span>
          <i>¥<b>{{item.waimai_fee}}</b></i>
        </div>
      </div>
    </div>
    <!-- hotcommend -->

    <!-- near -->
    <div class="nearshop">
        <h3>附近好店</h3>
        <div class="list">
          <router-link class="item" v-for="(item,index) in nearshop" :key='index' :to="{name:'Shop',params:{shopid:item.id}}">
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


    </div>
    <!-- near -->
    <load-more :show-loading="!commentLoadedAll && !noCommentLists" :tip="!commentLoadedAll && !noCommentLists ? '加载中' : '已加载全部数据'" background-color="#fbf9fe"></load-more>
    </scroller>

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
  import { getIndexBanner, getWxSettings, getNearStore, getMyShop, getCoorDinateName, getIndexMenu,getIndexHot, getIndexCommand, getIndexNearShop } from '@/api/index.js';

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

        indexMenu:[],
        smallBanner:[],
        hotList:[],
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

      this.getIndexMenu()
      this.getIndexHot()
      this.getIndexCommand()

      if(!this.$store.state.coordinate.latitude) await this.getCoordinate();
      //this.getNearStore();
      this.getIndexNearShop()
      //this.getMyShop();
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
      //获取首页菜单
      getIndexMenu(){
        getIndexMenu().then(res=>{
          //console.log('首页菜单数据',res)
          if(res.data.code==1){
            this.indexMenu = res.data.data
          }
        })
      },
      //活动banner smallBanner
      getIndexHot(){
        getIndexHot({
          type_id:1
        }).then(res=>{
          //console.log('首页hot',res)
          if(res.data.code==1){
            this.smallBanner = res.data.data
          }
        })
      },
      //人气推荐
      getIndexCommand(){
        getIndexCommand().then(res=>{
          //console.log('人气推荐',res)
          if(res.data.code==1){
            this.hotList = res.data.data
          }else{

          }
        })
      },
      goShopIndex(shopId,cateId,goodsId){
        if(cateId && goodsId){
          this.$store.commit(SET_SEARCH_RESULT, {
            cateId,
            goodsId
          });
        }
        this.$router.push({
          name:'Shop',
          params:{
            shopid:shopId
          }
        })
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
<style lang="less"
  scoped>
  @import './Index.less';

</style>
