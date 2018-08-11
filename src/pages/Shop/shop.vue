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
              @click="handleShowGoodsDetail(index,key,sub.id)">
                <goods-item
                  :item="sub"
                  :parentIndex="index"
                  :currentIndex="key"
                  @plus="plus"
                  @reduce="reduce"
                  @choose="choose"
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
                          <div class="rate">
                            <rate slot="left" v-model="item.score" size="14px" :readonly="true"></rate>
                          </div>
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

    <transition name="fade">
      <div class="popbox-wapper" v-if="showChooseAttrPop">
        <div class="popboxmask"></div>
        <div class="popbox">
          <div class="box">
            <div class="tit1">{{chooseAttrPopData.title}}</div>
            <div class="turns">
              <div class="chose" v-for="(item,index) in chooseAttrPopData.attr" :key="index">
                <div class="tit2">{{item.name}}</div>
                <div class="lie">
                  <span v-for="(sub,subkey) in item.specs" :key="subkey" :class="chooseAttrPopData.choosedAttr[index] == subkey ? 'on' : ''" @click="handleChooseAttr(index,subkey)">{{sub.name}}</span>
                </div>
              </div>
            </div>
            <div class="btnbox">
              <div class="bleft">
                <span class="small">¥</span>{{chooseAttrPopData.showPrice}}</div>
              <div class="btna JB" @click.stop="handleAddCart">加入购物车</div>
            </div>
          </div>
          <img class="close" :src="closeIcon" @click="handleCloseChooseAttrPop" />
        </div>
      </div>
    </transition>

    <!-- 抛物线使用的圆点 -->
    <section class="parabola-point" ref="parabolaPoint"></section>

    <!-- 底部 -->
    <footer-trolley
      :totalMoney="choosedTotalPrice"
      :total="choosedTotalNum"
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
  changeCartGoodsNum,
  addCart,
  getCartLists,
  getPhysicalGoodsDetail,
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
      closeIcon: require('../../assets/xxx.png'),
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
      showChooseAttrPop:false, //显示选择属性弹窗
      chooseAttrPopData: null, //将要选择属性的商品数据
      choosedTotalPrice:0,
      choosedTotalNum:0,
      timer:null,
      reduceTimer:null,

      showDetail: false, //显示商品详情
      detailParentIndex: 0, //展示详情的商品分类索引
      detailCurrentIndex: 0, //展示详情的商品自身索引
      goodsDetailData: null,
    };
  },

  computed: {

  },

  watch:{
    showShopDetailPop(val){
      this.hanldeControlScroll(val ? 'stop' : '')
    },

    showDetail(val){
      this.hanldeControlScroll(val ? 'stop' : '')
    },

    showChooseAttrPop(val){
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
      if(this.choosedTotalNum<=0) {
        this.feedback.Toast({
          msg:'您的购物车中还没有添加商品'
        });
        return;
      }
      this.$router.push({
        name:'Trolley',
        params: {
          shopid:this.shopid
        }
      });
    },

    //点击选好了
    handleGoSettlement() {
      if (this.choosedTotalNum >= 1) {
        this.$router.push({
          name: 'Settlement',
          params: {
            shopid: this.shopid
          }
        });
      } else {
        this.feedback.Toast({
          msg:'请至少选择一件商品'
        });
      }
    },

    //展示商品详情
    handleShowGoodsDetail(parentIndex, index, goodsId) {
      this.feedback.Loading.open('加载中');
      getPhysicalGoodsDetail({
        shop_id:this.shopid,
        goods_id: goodsId,
        type:1
      }).then(res=>{
        console.log(res);
        this.feedback.Loading.close();
        if(res.data.code == 1){
          let goodsDetailData = res.data.data;
          goodsDetailData.num = this.goodsLists[parentIndex][index].num;
          goodsDetailData.id = goodsId;
          this.goodsDetailData = res.data.data;
          this.detailCurrentIndex = index;
          this.detailParentIndex = parentIndex;
          this.showDetail = true;
        }else{
          this.feedback.Toast({
            msg:res.data.info,
            timeout: 1200
          })
        }
      });
    },

    //点击商品详情遮罩 隐藏商品详情
    maskHandle() {
      this.showDetail = false;
      this.goodsDetailData = null;
      this.detailParentIndex = 0;
      this.detailCurrentIndex = 0;
    },

    //选项卡切换
    handleToggleTab(lable, tabkey) {
      if (tabkey !== 'evaluate') return;
      if(this.commentLists.length == 0 && this.allowLoadMore){
        this.getCommentsListsData();
      }
    },

    //初始化购物车图标位置
    initTrolleyPos(val) { trolleysIconHeight = val; },

    //购物车添加
    plus(options, e) {
      this.goodsLists[options.parentIndex][options.currentIndex].num ++;
      this.choosedTotalNum ++;
      if(this.goodsDetailData) this.goodsDetailData.num ++;
      let attr = '';
      if(options.isNoAttr){
        this.choosedTotalPrice = this.choosedTotalPrice*1 + this.goodsLists[options.parentIndex][options.currentIndex].shop_price*1;
      }else{
        this.choosedTotalPrice = this.choosedTotalPrice*1 + this.chooseAttrPopData.showPrice *1;
        let choosedAttr = this.chooseAttrPopData.choosedAttr;
        attr = this.chooseAttrPopData.attr.map((item,index)=>item.specs[choosedAttr[index]]['id']).join(',');
      }
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

      clearTimeout(this.timer);
      this.timer = setTimeout(()=>{
        addCart({
          attr,
          shop_id:this.shopid,
          id:options.goodsId,
          num:this.goodsLists[options.parentIndex][options.currentIndex].num,
          user_id:this.$store.state.user.userid,
          is_waimai:1
        }).then(res=>{
          this.feedback.Toast({
            msg: res.data.info,
            timeout: 800
          });
          if(res.data.code == 1){
            if(!options.isNoAttr){
              this.handleCloseChooseAttrPop();
            }
          }else {
            this.getGoodsLists();
            this.getCartLists();
          }
          console.log(res);
        });
      },300);
    },

    //购物车减少
    reduce(options) {
      if(this.goodsDetailData) this.goodsDetailData.num --;
      this.goodsLists[options.parentIndex][options.currentIndex].num --;
      this.choosedTotalNum --;
      this.choosedTotalPrice = this.choosedTotalPrice*1 - this.goodsLists[options.parentIndex][options.currentIndex].shop_price*1;
      clearTimeout(this.reduceTimer);
      this.reduceTimer = setTimeout(()=>{
        addCart({
          attr:'',
          shop_id:this.shopid,
          id:options.goodsId,
          num:this.goodsLists[options.parentIndex][options.currentIndex].num,
          user_id:this.$store.state.user.userid,
          is_waimai:1
        }).then(res=>{
          this.feedback.Toast({
            msg: res.data.info,
            timeout: 1500
          });
          if(res.data.code != 1){
            this.getGoodsLists();
            this.getCartLists();
          }
          console.log(res);
        });
      },300);
    },

    //有属性商品添加购物车
    handleAddCart(e){
      this.plus({
        parentIndex:this.chooseAttrPopData.parentIndex,
        currentIndex:this.chooseAttrPopData.currentIndex,
        goodsId:this.chooseAttrPopData.goodsId,
        isNoAttr: false
      },e);
    },

    //弹出选择属性窗口
    choose(options){
      let currentGoods = this.goodsLists[options.parentIndex][options.currentIndex];
      this.chooseAttrPopData = {
        title: currentGoods.title,
        attr: currentGoods.attr,
        choosedAttr: currentGoods.choosedAttr,
        sku: currentGoods.sku,
        parentIndex: options.parentIndex,
        currentIndex: options.currentIndex,
        goodsId: currentGoods.id,
        showPrice: currentGoods.check_price
      };
      this.showChooseAttrPop = true;
    },

    //点击属性 修改价格及焦点
    handleChooseAttr(index,val){
      this.chooseAttrPopData.choosedAttr.splice(index, 1, val);
      let choosedAttr = this.chooseAttrPopData.choosedAttr,
       currentSkuId = this.chooseAttrPopData.attr.map((item,index)=>item.specs[choosedAttr[index]]['id']).join(',');
      this.chooseAttrPopData.showPrice = this.chooseAttrPopData.sku.filter(item=>item.sku_id == currentSkuId)[0]['price'];
    },

    //关闭属性选择弹窗
    handleCloseChooseAttrPop(){
      this.showChooseAttrPop = false;
      this.chooseAttrPopData = null;
    },

    //控制body是否允许滚动
    hanldeControlScroll(flag){
      const mo = function(e){ e.preventDefault() };
      if(flag == 'stop'){
        document.body.style.overflow = 'hidden';
        // document.body.style.overflow='hidden';
        // document.addEventListener("touchmove",mo,false);
      }else{
        document.body.style.overflow = 'auto';
        // document.body.style.overflow='';
        // document.removeEventListener("touchmove",mo,false);
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
          this.goodsLists = res.data.data.map((item,index)=>{
            return item.map((sub,subkey)=>{
              if(sub.attr.length > 0){
                let checkSku = sub.check_sku.split(',');
                console.log(sub)
                sub.choosedAttr = checkSku.map((i,iindex) => sub.attr[iindex].specs.findIndex(j=>j.id == i) );
              }
              return sub;
            })
          });
          console.log(this.goodsLists);
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
      if(!this.allowLoadMore || this.commentLoadedAll || this.noCommentLists) return;
      this.allowLoadMore = false;
      getCommentsListsData({
        shop_id:this.shopid,
        page:this.commentPage
      }).then(res=>{
        if (res.data.data.length < 20) this.commentLoadedAll = true;
        if (res.data.data.length == 0 && this.commentLists.length == 0) this.noCommentLists = true;
        this.commentLists.push(...res.data.data);
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

    //获取购物车数据
    getCartLists(){
      getCartLists({
        is_waimai: 1,
        shop_id: this.shopid,
        user_id: this.$store.state.user.userid
      }).then(res=>{
        console.log(res);
        if(res.data.code == 1){
          this.choosedTotalNum = res.data.data.total_num;
          this.choosedTotalPrice = res.data.data.total_price;
        }
      })
    },
  },
  mounted() {

    setTimeout(() => {
      ScrollTo(window,0,1);
    }, 300);

    this.getGoodsCate();
    this.getGoodsLists();
    this.getPhysicalShopDetail();
    this.getCartLists();

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
