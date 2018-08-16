<template>
<div class="container">

    <div class="wapper">
        <!-- 导航 -->
        <div class="nav-bar">
            <div class="nav-bar-item" v-for="(item,index) in navsData.lists" :data-origin="item.origin" bindtap="handleToggleNavs">
                <span>{{item.name}}</span>
                <div class="nav-line" :style="{opacity: navsData.index == index ? 1 : 0}"></div>
            </div>
        </div>
        <!-- 海报 -->
        <!-- <div class="carousel-wapper" id="goods">
            <swiper class="carousel" bindchange="handleRecordFocusIndex">
                <swiper-item wx:for="{{detail.atlas}}" wx:key="{{index}}" >
                    <img src="{{item}}" bindtap="handlePreviewPosters" data-index="{{index}}" mode="aspectFill" class="carousel-item" style="width: 100%;height:750rpx" />
                </swiper-item>
            </swiper>
        </div> -->
        <!-- banner -->
        <swiper dots-position="center"
          dots-class="dots"
          :aspect-ratio="1"
          :show-desc-mask="false"
          :list="banners"
          class="swiper"></swiper>


        <!-- 基础信息 -->
        <div class="base-info">

            <div class="base-info-body">
                <div class="lside">
                    <div class="price">
                        <span>￥</span>{{detail.shop_price}}
                    </div>
                    {{detail.title || '--'}}
                </div>
            </div>
        </div>
        <!-- 详情 -->
        <div class="detail" id="detail">
            <div class="detail-title">商品详情
                <img src="../../assets/shopicon14.png" />
            </div>
            <div class="detial-content" v-html='detail.body'>
                详细信息<!-- <template is="wxParse" data="{{wxParseData:article.nodes}}" /> -->
            </div>
        </div>
        <div style="height: 1.2rem;" v-if="isVirtual"></div>
        <div class="footer" v-if="isVirtual">
            <div class="add-car"></div>
            <div class="buy-now">
                <div class="btn" @click="handleBuyOrCar" data-type="buy">立即购买</div>
            </div>
        </div>
        <!-- 弹窗 -->
        <div class="pop-mask" v-if="showPop">
            <div class="pop">
                <div class="pop-header">
                    <div class="lside">
                        <img :src="curSkuImg ? curSkuImg : detail.attachment_path" mode="aspectFill" data-src="curSkuImg ? curSkuImg : detail.posters[0]" bindtap="handlePreviewChoosedImg" />
                    </div>
                    <div class="rside">
                        <div class="price"><span>￥</span>{{curPrice}}</div>
                        <div class="choosed">已选择：
                            <i v-for="(attr,i) in detail.attr" :key='i'>
                                <span v-for="(item,index) in attr.specs" v-if="index == curIndexs[i]">{{item.name}}</span>
                            </i>
                            <div>
                                <span>数量：{{choosedNum}}</span>
                                <span>库存：{{curSkuStock}}</span>
                            </div>
                        </div>
                        <div class="close" @click="showPop=false">
                            <img src="../../assets/shopicon17.png" />
                        </div>
                    </div>
                </div>
                <div class="pop-content">
                    <div class="block" v-for="(attr,i) in detail.attr" :key='i'>
                        <div class="b-title">{{attr.name}}</div>
                        <div class="b-body">
                            <span v-for="(item,index) in attr.specs" :class="{active: index == curIndexs[i]}" @click="handleChooseAttr(index,i)">{{item.name}}</span>
                        </div>
                    </div>

                    <div class="num">
                        <div class="num-title">数量</div>
                        <div class="controls">
                            <div class="reduce" @click="handlePlusOrReduce(-1)">-</div>
                            <div class="num-box">{{choosedNum}}</div>
                            <div class="plus" @click="handlePlusOrReduce(1)">+</div>
                        </div>
                    </div>
                </div>
                <div class="pop-footer">
                    <div class="btn" @click="handleGoBuyOrCar">立即购买</div>
                </div>
            </div>
        </div>
    </div>



</div>
</template>

<script>
import { Swiper } from 'vux';

import { getShopItemDetail, getWxSettings } from '@/api/index.js';
const wx = require('weixin-js-sdk');

export default {
    name: 'AdminShopDetail',
    data() {
        return {
            goodid:'',
            shopid:'',
            userid:'',
            isVirtual:true,
            curIndexs:'',
            isBuy: true,
            showPop: false,
            navsData: {
                index: 0,
                lists: [{
                    name: '商品',
                    origin: '#goods'
                }, {
                    name: '详情',
                    origin: '#detail'
                }]
            },
            commentContent: null,
            curIndexs: [], //当前选中的商品属性
            curPrice: 0, //当前选中商品对应属性的价格
            curSkuId: 0, //当前选择中的skuID
            choosedNum: 1,
            carouselFoucsIndex: 1,
            detail: {},
            banners:[]
        };
    },
    beforeCreate() {
    },
    created(){
        this.shopid = this.$route.params.shopid
        this.goodid = this.$route.params.goodid
        this.userid = this.$route.params.userid
    },
    mounted() {
        this.getShopItemDetail();
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
    },
    methods:{
        getShopItemDetail(){
            getShopItemDetail({
                shop_id: this.shopid,
                goods_id: this.goodid,
                type:0
            }).then(res=>{
                let resData = res.data.data;

                this.detail = resData,
                this.curIndexs = resData.attr.length == 0 ? [0] : resData.attr.map(item => 0)

                this.banners = resData.atlas.map(item => ({
                    img: item,
                    url: item
                }));

                let self = this;
                this.wx.ready(function() {
                  self.wx.onMenuShareTimeline({
                      title: self.detail.title,
                      link: location.href,
                      imgUrl: self.detail.attachment_path,
                      success: () => {}
                  });
                  self.wx.onMenuShareAppMessage({
                    title: self.detail.title,
                    desc: `价格：${self.detail.price}`,
                    link: location.href,
                    imgUrl: self.detail.attachment_path,
                    success: () => {}
                  });
                });

                this.calculateCurPrice();
            })
        },

        //计算当前选择商品规格对应的价格
        calculateCurPrice(e) {

            let attr = this.detail.attr;

            let sku = this.detail.sku,
                curIndexs = this.curIndexs,
                num = this.choosedNum;

            let tempCurSkuId = attr.map((item, index) => item.specs[curIndexs[index]].id),
                skuId = tempCurSkuId.join(',');
            this.skuId = skuId;
            let choosedSku = attr.length == 0 ? sku[0] : sku.find(item => item.sku_id == skuId),
                curPrice = choosedSku.price * num,
                curSkuId = choosedSku.sku_id,
                curSkuStock = choosedSku.stock,
                curSkuImg = choosedSku.path || '';

            this.curOncePrice = choosedSku.price;
            curPrice = curPrice.toFixed(2);
            //this.setData({ curPrice, curSkuId, curSkuStock, curSkuImg });
            this.curPrice = curPrice
            this.curSkuId = curSkuId
            this.curSkuStock = curSkuStock
            this.curSkuImg = curSkuImg
        },

        //立即购买
        handleBuyOrCar(e) {
            this.isBuy = 1
            this.showPop = true
        },


        //数量加减
        handlePlusOrReduce(num) {
            let choosedNum = this.choosedNum;
            console.log('num',num)
            if (num==1){
                choosedNum = choosedNum + 1 <= this.curSkuStock * 1 ? choosedNum + 1 : this.curSkuStock * 1;
            }else{
                choosedNum = choosedNum - 1 > 0 ? choosedNum - 1 : choosedNum;
            }
            this.choosedNum = choosedNum
            //计算当前选择商品规格对应的价格
            this.calculateCurPrice();
        },

        //切换属性
        handleChooseAttr(mindex,pindex) {
            let index = mindex,
                parentIndex = pindex,
                curIndexs = this.curIndexs;
            curIndexs[parentIndex] = index;
            this.curIndexs = []
            this.curIndexs = curIndexs

            this.choosedNum = 1
            //计算当前选择商品规格对应的价格
            this.calculateCurPrice();
        },

        //立即购买
        handleGoBuyOrCar(e) {
            /*let detail = this.detail,
                curIndexs = this.curIndexs,
                choosedGoodsData = {
                    num: this.choosedNum,
                    skuId: this.curSkuId,
                    goodsId: detail.goodsId,
                    goods_shop_id: detail.goods_shop_id,
                    aid: detail.aid,
                    attachment_path: detail.attachment_path,
                    virtual_id: detail.virtual_id,
                    sku_id: this.skuId,
                    title: detail.title,
                    price: this.curOncePrice,
                    totalPrice: this.curPrice,
                    attr: detail.attr.length == 0 ? '' : detail.attr.map((item, index) => item.specs[curIndexs[index]].name).join(',')
                };
            if (this.isBuy) {

                //app.globalData.settlementGoods = choosedGoodsData;
                // wx.navigateTo({
                //     url: '../adminConfirm/adminConfirm'
                // });
                // /:name/:img/:num/:attr/:price/:goodid',


            }*/
            let curIndexs = this.curIndexs
            this.attr =  this.detail.attr.length == 0 ? '' : this.detail.attr.map((item, index) => item.specs[curIndexs[index]].name).join(',')
            var datas  = {}
            // /:name/:img/:num/:attr/:price/:goodid/:shopid/:virtualshopid/:attrid/:userid',
            datas.names = this.detail.title
            datas.img = this.detail.attachment_path
            datas.num = this.choosedNum
            datas.attr = this.attr ? this.attr : '暂无规格'
            datas.price = this.curPrice
            datas.goodid = this.detail.aid
            datas.shopid = this.detail.goods_shop_id
            datas.virtualshopid = this.detail.virtual_id
            datas.attrid = this.skuId ? this.skuId : 0
            datas.userid = this.userid
            console.log(datas)
            //跳转
            this.$router.push({name:'AdminShopSettlement',params:datas })
         },
    },
    components: {
        Swiper,
    }
};

</script>

<style lang="less" scoped>
  @import './AdminShopDetail.less';
</style>
