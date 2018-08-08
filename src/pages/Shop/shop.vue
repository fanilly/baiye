<template>
  <section class="container">
    <header class="header" v-if="shopDetail">
      <!-- 店铺信息 -->
      <img class="header-bg" :src="shopDetail.banner" alt="">
      <section class="header-wapper">
        <section class="mall-info">
          <section class="mall-info-header">
            <section class="mall-info-header-lside">
              <img v-lazy="shopDetail.avatar" class="logo" alt="店铺头像">
            </section>
            <section class="mall-info-header-rside" @click="showShopDetailPop = true">
              <h2 class="mall-name">{{shopDetail.name}}</h2>
              <h3 class="mall-flags">{{shopDetail.is_dada ? '达达配送' : '商家自配'}} 月销{{shopDetail.sales_num}}</h3>
              <p class="mall-desc">{{shopDetail.description}}</p>
            </section>
            <section class="mall-info-header-star" @click="handleToggleCollectionStatus">
              <img :src="shopDetail.is_fav ? starIcons.stared : starIcons.nostar">
              <p>{{shopDetail.is_fav ? '已关注' : '关注'}}</p>
            </section>
          </section>
        </section>
      </section>
    </header>

    <!-- 搜索 -->
    <section class="search-box">
      <input class="search-box-content" ref="searchBox" @blur="handleSearch" @keyup.enter="handleSearch" type="search" placeholder="请输入关键词搜索商品" name="">
      <img class="search-box-coupon" :src="couponIcons" alt="">
    </section>

    <!-- 商品详情 -->
    <section class="goods-detail">
      <transition name="fade">
        <goods-detail
          v-if="showDetail"
          :goodsData="goodsDetailData"
          :detailParentIndex="detailParentIndex"
          :detailCurrentIndex="detailCurrentIndex"
          @plus="plus"
          @reduce="reduce"
          @maskHandle="maskHandle"
        ></goods-detail>
      </transition>
    </section>

    <!-- 商品列表 -->
    <main class="main">
      <scrolltab ref="scrollTabBox" v-if="goodsLists && goodsCate">
        <scrolltab-panel :label="item.name" :icon="item.icon || ''" v-for="item,index in goodsCate" :key="index">
          <section class="class-container">
            <section
              v-for="(sub, key) in goodsLists[index]"
              :key="key"
              @click="handleShowGoodsDetail(index,key)">
                <goods-item
                  :item="sub"
                  :parentIndex="index"
                  :currentIndex="key"
                  @plus="plus"
                  @reduce="reduce"
                ></goods-item>
              </section>
          </section>
        </scrolltab-panel>
      </scrolltab>
    </main>

    <!-- 店铺详情弹出层 -->
    <transition name="fade">
      <section class="shop-pop" v-if="showShopDetailPop">
        <section class="shop-pop-placeholder-box" @click="showShopDetailPop = false"></section>
        <section class="shop-pop-main">
          <tab :callback="handleToggleTab" class="pop-tab-wapper">
            <!-- 店铺信息 -->
            <tab-panel label="店铺信息" tabkey="goods" class="detial-list-wapper">
              <main class="detial-main">
                <section class="mall-info">
                  <section class="mall-info-header">
                    <section class="mall-info-header-lside">
                      <img v-lazy="shopDetail.avatar" class="logo" alt="店铺头像">
                    </section>
                    <section class="mall-info-header-rside" @click="showShopDetailPop = true">
                      <h2 class="mall-name">{{shopDetail.name}}</h2>
                      <h3 class="mall-flags">{{shopDetail.is_dada ? '达达配送' : '商家自配'}} 月销{{shopDetail.sales_num}}</h3>
                      <p class="mall-desc">{{shopDetail.description}}</p>
                    </section>
                    <section class="mall-info-header-star" @click="handleToggleCollectionStatus">
                      <img :src="shopDetail.is_fav ? starIcons.stared : starIcons.nostar">
                      <p>{{shopDetail.is_fav ? '已关注' : '关注'}}</p>
                    </section>
                  </section>
                </section>
                <section class="shop-info-wapper">
                  <div class="detail-title">商家信息</div>
                  <div class="info-list" @click="handleCallPhone(shopDetail.mobile)">门店电话：
                      <span class="info-list-content">{{shopDetail.mobile}}</span>
                      <span class="info-list-btn">联系TA</span>
                  </div>
                  <div class="info-list">商品数量：
                      <span class="info-list-content">{{shopDetail.goods_count}}</span>
                  </div>
                  <div class="info-list">月销单量：
                      <span class="info-list-content">{{shopDetail.sales_num}}</span>
                  </div>
                  <div class="info-list">营业时间：
                      <span class="info-list-content">{{shopDetail.business_hours}}</span>
                  </div>
                  <div class="info-list" @click="handleGoMapCoordinate(shopDetail.coordinate)">门店地址：
                      <span class="info-list-content">{{shopDetail.coordinate_address}}</span>
                  </div>
                  <div class="info-list">商家环境照片</div>
                  <section class="previewer-box">
                    <div class="previewer-img-wapper">
                      <div class="previewer-img-content">
                        <img class="previewer-img-item" v-for="(item, index) in surroundings" :src="item.src" width="100" @click="$refs.previewer.show(index)">
                        <div v-transfer-dom>
                          <previewer :list="surroundings" ref="previewer" :options="options"></previewer>
                        </div>
                      </div>
                    </div>
                  </section>
                </section>
              </main>
            </tab-panel>
            <!-- 评价信息 -->
            <tab-panel label="评价信息" tabkey="evaluate" class="evaluate-list-wapper">
              <scroller @getData="getCommentsListsData">
                <div>
                  <section class="evaluate-header">
                    <section class="evaluate-header-item">
                      <h3><span>{{shopDetail.grade}}</span>综合评分</h3>
                    </section>
                    <section class="evaluate-header-item">
                      <h3><span>{{shopDetail.grade_num}}</span>评论数</h3>
                    </section>
                  </section>
                  <main class="evaluate-content">
                    <div class="comment-list">
                      <div class="list-item scroll-item" v-for="(item,index) in commentLists" :key="index">
                        <div class="item-header">
                          <div class="photo">
                              <img :src="item.headimgurl" />
                          </div>
                          <div class="nickname">{{item.nickname}}</div>
                        </div>
                        <div class="comment-body">
                          <div class="item-title">{{item.eval}}</div>
                          <div class="item-info">{{item.add_time}}</div>
                        </div>
                      </div>
                    </div>
                  </main>
                  <load-more :show-loading="!commentLoadedAll && !noCommentLists" :tip="!commentLoadedAll && !noCommentLists ? '加载中' : '已加载全部数据'" background-color="#fbf9fe"></load-more>
                </div>
              </scroller>
            </tab-panel>
          </tab>
        </section>
      </section>
    </transition>

    <!-- 抛物线使用的圆点 -->
    <section class="parabola-point" ref="parabolaPoint"></section>

    <!-- 底部 -->
    <footer-trolley
      :totalMoney="totalMoney"
      :total="trolleysTotal"
      @initTrolleyPos="initTrolleyPos"
      @handleClickBtn="handleGoSettlement"
      @handleClickTrolley="handleClickTrolley"
    ></footer-trolley>
  </section>
</template>

<script>
import { Previewer, TransferDom, LoadMore } from 'vux';
import { scrolltabPanel, scrolltab } from '@/components/scrolltab/scrolltab.js';
import { tab, tabPanel } from '@/components/tab/tab.js';
import scroller from '@/components/scroller/scroller.vue';
import goodsDetail from '@/components/goodsDetail/goodsDetail.vue';
import rate from '@/components/rate/rate.vue';

import goodsItem from '@/components/goodsItem/goodsItem.vue';
import footerTrolley from '@/components/footerTrolley/footerTrolley.vue';

import storageUtils from '@/utils/Storage.js';
import parabola from '@/utils/parabola.js';
import ScrollTo from '@/utils/scrollTo.js';
const getGoosList = ()=>{};
const getCoupons = ()=>{};
const receiveCoupon = ()=>{};
import {
  getGoodsCate,
  getGoodsLists,
  getPhysicalShopDetail,
  getCommentsListsData,
  toggleCollectionStatus,
} from '@/api/index.js';

let pageHeight = document.body.offsetHeight, //页面实际高度
  trolleysIconHeight = 0; //购物车图片实际高度

export default {
  name: 'Shop',
  props: {
    shopid: {
      require: true
    }
  },
  data() {
    return {
      starIcons:{
        stared:require('../../assets/baiye/icon07@2x.png'),
        nostar:require('../../assets/baiye/icon06@2x.png'),
      },
      couponIcons: require('../../assets/coupon.png'),
      showShopDetailPop:false, //显示弹出层
      shopDetail:null, //店铺详情
      goodsLists:null, //商品列表
      goodsCate:null, //商品分类
      surroundings: [], //商家环境图片
      options: { //商家环境图片预览
        getThumbBoundsFn (index) {
          let thumbnail = document.querySelectorAll('.previewer-img-item')[index]
          let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
          let rect = thumbnail.getBoundingClientRect()
          return {x: rect.left, y: rect.top + pageYScroll, w: rect.width }
        }
      },

      commentPage:1,
      commentLoadedAll:false,
      noCommentLists:false,
      commentLists:[],
      allowLoadMore: true,

      classList: [], //商品列表
      configs: {}, //商城配置
      trolleys: [], //购物车数据
      trolleysTotal: 0, //购物车总数
      showDetail: false, //显示商品详情
      detailParentIndex: 0, //展示详情的商品分类索引
      detailCurrentIndex: 0, //展示详情的商品自身索引
      goodsDetailData: null,
      totalMoney: 0,
      rateVal: 3.7,
      showCoupons: false, //是否显示优惠模块
      coupons: [] //优惠券
    };
  },

  watch:{
    showShopDetailPop(val){
      this.hanldeControlScroll(val ? 'stop' : '')
    }
  },
  methods: {

    //触发搜索
    handleSearch(){
      let searchKeyWord = this.$refs.searchBox.value;
      if(searchKeyWord == '' || searchKeyWord.trim() == '') return;
      //开始搜索
      const searchStart = function(searchKeyWord){
        let items = []; //保存所有包含商品及分类名的DOM对象
        this.$children.forEach(item => {
          for (let i = 0,tempChildren = item.$el.children; i < tempChildren.length; i++) {
            if (tempChildren[i].nodeName == 'STRONG') {
              items.push(tempChildren[i]);
            } else {
              if (tempChildren[i].children && tempChildren[i].children[0])
                items.push(...tempChildren[i].children);
            }
          }
        });

        //过滤所有内容包含搜索关键词的DOM对象
        let searchLists = items.filter(item => item.innerText.indexOf(searchKeyWord) != -1);

        if (searchLists.length >= 1){ //搜索到内容
          ScrollTo(this.scrollView,this.scrollView.scrollTop,searchLists[0].offsetTop);
          ScrollTo(window,0,500);
        }else{  //未搜索的内容
          this.feedback.Toast({
            msg:'未搜索的内容',
            timeout:1500
          });
        }
      };
      this.$refs.searchBox.blur();
      searchStart.call(this.$refs.scrollTabBox,searchKeyWord);
    },

    //点击底部购物车图标
    handleClickTrolley(){
      if(this.trolleysTotal<=0) {
        this.feedback.Toast({
          msg:'您的购物车中还没有添加商品'
        });
        return;
      }
      this.$router.push({
        name:'Trolley'
      });
    },

    //展示商品详情
    handleShowGoodsDetail(parentIndex, index) {
      document.body.style.overflow = 'hidden';
      this.goodsDetailData = this.classList[parentIndex].goodsList[index];
      this.detailParentIndex = parentIndex;
      this.detailCurrentIndex = index;
      this.showDetail = true;
    },

    //点击商品详情遮罩 隐藏商品详情
    maskHandle() {
      document.body.style.overflow = 'auto';
      this.showDetail = false;
      this.goodsDetailData = null;
      this.detailParentIndex = 0;
      this.detailCurrentIndex = 0;
    },

    //选项卡切换
    handleToggleTab(lable, tabkey) {
      if (tabkey !== 'evaluate') return;
      console.log(this.commentLists.length,this.allowLoadMore);
      if(this.commentLists.length == 0 && this.allowLoadMore){
        this.getCommentsListsData();
      }
    },

    //初始化购物车
    initTrolley() {
      let trolleys = storageUtils.getStorage('trolleys');
      this.trolleys = trolleys ? JSON.parse(trolleys) : [];
      if (this.trolleys.length >= 1) {
        this.trolleysTotal = this.trolleys.map(item => item.count).reduce((total, num) => total + num);
        this.totalMoney = this.trolleys.map(item => item.shopprice * item.count).reduce((total, num) => total + num);
      } else {
        this.trolleysTotal = 0;
        this.totalMoney = 0;
      }
    },

    //初始化购物车图标位置
    initTrolleyPos(val) { trolleysIconHeight = val; },

    //购物车添加
    plus(options, e) {
      let currentGoods = this.classList[options.parentIndex].goodsList[options.currentIndex];
      this.trolleysTotal++;
      currentGoods.count++;
      //如果购物车中已经存在当前商品 count +1
      //否则把当前商品存入购物车
      let index = this.trolleys.findIndex(item => currentGoods.goodsid == item.goodsid);
      (index != -1 ? this.trolleys[index].count++ : this.trolleys.push(currentGoods));
      storageUtils.setStorage('trolleys', this.trolleys);
      this.totalMoney = this.trolleys.length >= 1 ? this.trolleys.map(item => item.shopprice * item.count).reduce((total, num) => total + num) : 0;

      //抛物线动画
      let circleRadius = this.$refs.parabolaPoint.offsetWidth / 2,
        x = e.clientX,
        y = e.clientY;
      this.$refs.parabolaPoint.style.opacity = 1;
      this.$refs.parabolaPoint.style.left = `${x-circleRadius}px`;
      this.$refs.parabolaPoint.style.top = `${y-circleRadius}px`;
      parabola({
        startPos: { x, y },
        endPos: { x: trolleysIconHeight - 10, y: pageHeight - trolleysIconHeight + 10 },
        frame: (x, y) => {
          this.$refs.parabolaPoint.style.left = `${x-circleRadius}px`;
          this.$refs.parabolaPoint.style.top = `${y-circleRadius}px`;
        },
        callback: () => {
          this.$refs.parabolaPoint.style.opacity = 0;
        }
      });
    },

    //购物车减少
    reduce(options) {
      let currentGoods = this.classList[options.parentIndex].goodsList[options.currentIndex];
      currentGoods.count--;
      this.trolleysTotal--;
      //如果购物车中当前商品数量大于1 count-1
      //否则把当前商品从购物车中移除
      let index = this.trolleys.findIndex(item => currentGoods.goodsid == item.goodsid);
      (this.trolleys[index].count > 1 ? this.trolleys[index].count-- : this.trolleys.splice(index, 1));
      storageUtils.setStorage('trolleys', this.trolleys);
      this.totalMoney = this.trolleys.length >= 1 ? this.trolleys.map(item => item.shopprice * item.count).reduce((total, num) => total + num) : 0;
    },

    //点击选好了
    handleGoSettlement() {
      if (this.trolleysTotal >= 1) {
        this.$router.push({
          name: 'Settlement'
        });
      } else {
        this.feedback.Toast({
          msg:'请至少选择一件商品'
        });
      }
    },

    hanldeControlScroll(flag){
      const mo = function(e){ e.preventDefault() };
      if(flag == 'stop'){
        document.body.style.overflow='hidden';
        document.addEventListener("touchmove",mo,false);
      }else{
        document.body.style.overflow='';
        document.removeEventListener("touchmove",mo,false);
      }
    },

    //获取分类列表
    getGoodsCate(){
      getGoodsCate({
      is_waimai:1,
        shop_id:this.shopid,
        user_id:this.$store.state.user.userid
      }).then(res=>{
        if(res.data.code == 1){
          this.goodsCate = res.data.data;
          console.log(this.goodsCate);
        }
      });
    },

    //获取商品列表
    getGoodsLists(){
      getGoodsLists({
        is_waimai:1,
        shop_id:this.shopid,
        user_id:this.$store.state.user.userid
      }).then(res=>{
        if(res.data.code == 1){
          this.goodsLists = res.data.data;
          console.log(this.goodsLists)
        }
      });
    },

    //获取店铺详情
    getPhysicalShopDetail(){
      getPhysicalShopDetail({
        user_id: this.$store.state.user.userid,
        id:this.shopid
      }).then(res=>{
        if(res.data.code == 1){
          this.shopDetail = res.data.data;
          this.surroundings = res.data.data.surroundings.map(item=>({
            msrc:item,
            src:item
          }))
          console.log(this.shopDetail);
        }
      });
    },

    //获取评价列表
    getCommentsListsData() {
      console.log(this.allowLoadMore,this.commentLoadedAll,this.noCommentLists);
      if(!this.allowLoadMore || this.commentLoadedAll || this.noCommentLists) return;
      this.allowLoadMore = false;
      getCommentsListsData({
        shop_id:this.shopid,
        page:this.commentPage
      }).then(res=>{
        console.log(res);
        if (res.data.data.length < 20) this.commentLoadedAll = true;
        if (res.data.data.length == 0 && this.commentLists.length == 0) this.noCommentLists = true;
        this.commentLists.push(...res.data.data);
        console.log(this.commentLists);
        this.allowLoadMore = true;
        this.commentPage++;
      });
    },

    //切换收藏状态
    handleToggleCollectionStatus() {
      this.feedback.Loading.open('操作中');
      toggleCollectionStatus({
        shop_id:this.shopid,
        user_id:this.$store.state.user.userid
      }).then(res=>{
        this.feedback.Loading.close();
        this.feedback.Toast({
          msg:res.data.info,
          timeout:1500
        });
        if(res.data.code == 1){
          this.shopDetail.is_fav = !this.shopDetail.is_fav;
        }
      });
    },
  },
  mounted() {

    setTimeout(() => {
      ScrollTo(window,0,1);
    }, 300);

    this.getGoodsCate();
    this.getGoodsLists();
    this.getPhysicalShopDetail();


    // this.initTrolley();
    // getGoosList().then(res => {
    //   console.log(res);
    //   //记录商品数据
    //   this.classList = res.data.goods.map(item => {
    //     let tempItem = item;
    //     tempItem.goodsList.map(goods => {
    //       let tempGoods = goods,
    //         index = this.trolleys.findIndex(sub => sub.goodsid == tempGoods.goodsid);
    //       tempGoods.count = index != -1 ? this.trolleys[index].count : 0;
    //       return tempGoods;
    //     });
    //     return tempItem;
    //   });

    //   // 如果购入车中的商品与本次获取的商品信息不符
    //   // 更新存储的购物车数据
    //   this.trolleys = this.trolleys.map(item => {
    //     for (let i = 0; i < this.classList.length; i++) {
    //       let currentGoods = this.classList[i].goodsList,
    //         tempIndex = currentGoods.findIndex(sub => sub.goodsid == item.goodsid);
    //       if (tempIndex != -1) {
    //         if (JSON.stringify(currentGoods[tempIndex]) != JSON.stringify(item)) item = currentGoods[tempIndex];
    //         break;
    //       }
    //     }
    //     return item;
    //   });
    //   storageUtils.setStorage('trolleys', this.trolleys);

    //   //记录配置数据
    //   this.configs = res.data.configs;
    // }).catch(err => {
    //   console.log(err);
    // });
  },
  components: {
    scrolltabPanel,
    scrolltab,
    tab,
    tabPanel,
    rate,
    goodsItem,
    goodsDetail,
    footerTrolley,
    Previewer,
    scroller,
    LoadMore,
  },
  directives: {
    TransferDom
  }
};

</script>
<style lang="less" scoped>
@import './Shop.less';
</style>
