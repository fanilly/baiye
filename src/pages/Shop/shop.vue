<template>
  <section class="container">
    <header class="header">
      <!-- 店铺信息 -->
      <section class="header-wapper">
        <section class="search-box">
          <input class="search-box-content" ref="searchBox" @blur="handleSearch" @keyup.enter="handleSearch" type="search" placeholder="请输入关键词搜索商品" name="">
        </section>
        <section class="mall-info">
          <section class="mall-info-header">
            <section class="mall-info-header-lside">
              <img v-lazy="BASE_URL+configs.goodsImg" class="logo" alt="店铺头像">
            </section>
            <section class="mall-info-header-rside">
              <h2 class="mall-name">{{configs.mallName}}</h2>
              <p class="mall-desc">{{configs.mallDesc}}</p>
            </section>
          </section>
          <section class="mall-info-notice-wapper" @click="toggleCouponsShow">
            <span class="notice-icon"><i class="iconfont icon-laba"></i></span>
            <h3>{{configs.couponsDesc}}</h3>
            <span :class="showCoupons ? 'more-icon opened' : 'more-icon'"><i class="iconfont icon-jiantouyou"></i></span>
          </section>
        </section>
      </section>
      <!-- 优惠信息 -->
      <transition name="benefit">
        <section v-if="showCoupons">
          <section class="benefit">
            <coupon
              v-for="(item,index) of coupons"
              :key="index"
              class="coupon"
              :settings="item"
              @handleReceiveCoupon="handleReceiveCoupon"
            ></coupon>
          </section>
          <section class="benefit-info">
            <div v-for="(item,index) in benefits" :key="index">
              <span :style="'color:'+item.color"><i :class="'iconfont '+item.icon"></i></span>
              <p>{{item.content}}</p>
            </div>
          </section>
        </section>
      </transition>
    </header>

    <!-- 商品详情 -->
    <section class="goods-detail">
      <transition name="fade">
        <goods-detail
          v-if="showDetail"
          :goodsData="goodsDetailData"
          :baseurl="BASE_URL"
          :detailParentIndex="detailParentIndex"
          :detailCurrentIndex="detailCurrentIndex"
          @plus="plus"
          @reduce="reduce"
          @maskHandle="maskHandle"
        ></goods-detail>
      </transition>
    </section>


    <section class="page-main">
      <tab :callback="handleToggleTab">
        <!-- 商品 -->
        <tab-panel label="商品" tabkey="goods">
          <main class="main">
            <scrolltab ref="scrollTabBox">
              <scrolltab-panel :label="item.catname" :icon="item.icon || ''" v-for="item,index in classList" :key="index">
                <section class="class-container">
                  <section
                    v-for="(sub, key) in item.goodsList"
                    :key="key"
                    @click="handleShowGoodsDetail(index,key)">
                      <goods-item
                        :item="sub"
                        :baseurl="BASE_URL"
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
        </tab-panel>
        <!-- 评价 -->
        <tab-panel label="评价" tabkey="evaluate">
          <section class="evaluate">
            <section class="evaluate-header">
              <section class="evaluate-header-lside">
                <h3><span>4.3</span>综合评分</h3>
              </section>
              <section class="evaluate-header-rside">
                <div class="item">
                  <span class="lable">口味:</span>
                  <rate slot="left" v-model="rateVal" :readonly="true"></rate>
                  <span class="score">{{rateVal}}分</span>
                </div>
                <div class="item">
                  <span class="lable">商家:</span>
                  <rate slot="left" v-model="rateVal" :readonly="true"></rate>
                  <span class="score">{{rateVal}}分</span>
                </div>
              </section>
            </section>
            <main class="evaluate-content">
              <h1>评论列表</h1>
            </main>
          </section>
        </tab-panel>
      </tab>
    </section>

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
import { scrolltabPanel, scrolltab } from '@/components/scrolltab/scrolltab.js';
import { tab, tabPanel } from '@/components/tab/tab.js';
import goodsDetail from '@/components/goodsDetail/goodsDetail.vue';
import rate from '@/components/rate/rate.vue';

import goodsItem from '@/components/goodsItem/goodsItem.vue';
import coupon from '@/components/coupon/coupon.vue';
import footerTrolley from '@/components/footerTrolley/footerTrolley.vue';

import storageUtils from '@/utils/Storage.js';
import parabola from '@/utils/parabola.js';
import ScrollTo from '@/utils/scrollTo.js';
const BASE_URL = 'xx';
const getGoosList = ()=>{};
const getCoupons = ()=>{};
const receiveCoupon = ()=>{};
// import {
//   getGoosList,
//   getCoupons,
//   receiveCoupon
// } from '@/api/index.js';

let pageHeight = document.body.offsetHeight, //页面实际高度
  trolleysIconHeight = 0; //购物车图片实际高度

export default {
  name: 'Shop',
  data() {
    return {
      BASE_URL: BASE_URL, //图片根路径
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
      benefits: [{
        icon: 'icon-man',
        color: '#fb574e',
        content: '满25减12；满49减25；满99减50'
      }, {
        icon: 'icon-zhe1',
        color: '#bf82e1',
        content: '折扣商品五折起'
      }, {
        icon: 'icon-zeng',
        color: '#118eea',
        content: '购买指定商品有赠品'
      }, {
        icon: 'icon-ling',
        color: '#f08118',
        content: '有机会领取商家代金券'
      }],
      showCoupons: false, //是否显示优惠模块
      coupons: [] //优惠券
    };
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

    //显示与隐藏优惠券模块
    toggleCouponsShow() { this.showCoupons = !this.showCoupons; },

    //领取优惠券
    handleReceiveCoupon(){
      console.log(1);
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
    }
  },
  mounted() {
    this.initTrolley();
    getGoosList().then(res => {
      console.log(res);
      //记录商品数据
      this.classList = res.data.goods.map(item => {
        let tempItem = item;
        tempItem.goodsList.map(goods => {
          let tempGoods = goods,
            index = this.trolleys.findIndex(sub => sub.goodsid == tempGoods.goodsid);
          tempGoods.count = index != -1 ? this.trolleys[index].count : 0;
          return tempGoods;
        });
        return tempItem;
      });

      // 如果购入车中的商品与本次获取的商品信息不符
      // 更新存储的购物车数据
      this.trolleys = this.trolleys.map(item => {
        for (let i = 0; i < this.classList.length; i++) {
          let currentGoods = this.classList[i].goodsList,
            tempIndex = currentGoods.findIndex(sub => sub.goodsid == item.goodsid);
          if (tempIndex != -1) {
            if (JSON.stringify(currentGoods[tempIndex]) != JSON.stringify(item)) item = currentGoods[tempIndex];
            break;
          }
        }
        return item;
      });
      storageUtils.setStorage('trolleys', this.trolleys);

      //记录配置数据
      this.configs = res.data.configs;
    }).catch(err => {
      console.log(err);
    });

    // 获取优惠券信息
    getCoupons({ userId: 1 }).then(res => {
      console.log(res);
      this.coupons = res.data;
    });
  },
  components: {
    scrolltabPanel,
    scrolltab,
    tab,
    tabPanel,
    rate,
    goodsItem,
    goodsDetail,
    coupon,
    footerTrolley
  }
};

</script>
<style lang="less" scoped>
@import './Shop.less';

</style>
