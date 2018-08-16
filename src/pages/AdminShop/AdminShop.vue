<template>
<div class="container">

    <!-- header -->
    <div class="header">
        <div v-for='(item,index) in navs' >
            <span :class="{'active' : index == navsIndex}" @click='changeTypeNow(index)'>{{item.name}}</span>
            <!--  class="{{index == navsIndex ? 'active' : ''}}"  :click="say(index)" -->
            <!-- <img src="../images/baiye/c{{navsIndex == index && navsType == 0 ? '10' : navsIndex == index && navsType == 1 ? '12' : '11'}}@2x.png" /> -->
            <img src="../../assets/baiye/c10@2x.png" v-if='navsIndex == index && navsType == 0' />
            <img src="../../assets/baiye/c12@2x.png" v-if='navsIndex == index && navsType == 1' />
            <img src="../../assets/baiye/c11@2x.png" v-if='navsIndex != index' />
        </div>
    </div>

    <!-- 内容 -->
    <div class='scrollBox'>
        <scroller @getData="getShopList">
            <div class="goods-list-wapper">
                <div class="goods-list-item-wapper scroll-item" v-for='(item,index) in listData'>
                    <div class="goods-list-item">
                        <div class="lside">
                            <img :src="item.img_url" />
                        </div>
                        <div class="rside">
                            <div class="title">{{item.title}}</div>
                            <div class="price"><span>￥</span>{{item.share_price}}</div>
                            <div class="bonus">奖金总额：<span>￥{{item.push_money}}</span></div>
                            <div class="remark">有<span>{{item.sale_count}}</span>人在卖<div>剩余{{item.stock}}件</div></div>
                        </div>
                    </div>
                    <div class="goods-item-controls">
                        <div class="btn line" @click='delFromShop(item.id,index)'>下架</div>
                        <!-- <div class="btn fill">分享<button open-type="share" ></button></div> -->
                    </div>
                </div>
            </div>
            <load-more :show-loading="!commentLoadedAll && !noCommentLists" :tip="!commentLoadedAll && !noCommentLists ? '加载中' : '已加载全部数据'" background-color="#fbf9fe"></load-more>
        </scroller>

    </div>


    <!-- statistics -->
    <div class="footer" v-if='isOff'>
        <div class="sin" @click='showCode = true'>
            <img src="../../assets/baiye/c24@2x.png" />
            <span>店铺二维码</span>
        </div>
        <!-- bindtap="handleJump" data-url="../adminShopPreview/adminShopPreview?shopid={{fictitiousShopId}}&userid={{userid}}"  @click='goPreview' -->
        <router-link class="sin"  :to='{name:"AdminShopPreview",params:{shopid:shopid,userid:userid}}'>
            <img src="../../assets/baiye/c25@2x.png" />
            <span>店铺预览</span>
        </router-link>
        <router-link  class="sin" :to='{name:"AdminShelf",params:{shopid:shopid}}'>
            <img src="../../assets/baiye/c26@2x.png" />
            <span>添加商品</span>
        </router-link>
    </div>


    <!-- wx:if="{{showQRCode}}" bindtap="handleToggleShowQRCode" data-flag="0" -->
    <transition name="fade">
      <div class="pop-qrcode" v-if='showCode' @click='showCode = false' >
          <div class="qrcode-content">
              <div class="title">{{shopInfo.shop_name}}</div>
              <img :src="shopInfo.qrcode_public" />
          </div>
      </div>
    </transition>


</div>
</template>

<script>
import { LoadMore } from 'vux';
import scroller from '@/components/scroller/scroller.vue';

import { getShopList,delFromShop,getAdminIndexInfo } from '@/api/index.js';
const wx = require('weixin-js-sdk');

export default {
    name: 'AdminShop',
    data() {
        return {
            navs:[
                { name: '新品上架' },
                { name: '价格排序' },
                { name: '奖金排序' },
            ],
            commentLoadedAll:false,
            noCommentLists:false,
            allowLoadMore: true,
            page:1,
            navsIndex: 0,
            navsType: 0,
            listData:[],
            shopid:'',
            showCode:false,
            shopInfo:{},
            userid:0,
            isOff:false
        };
    },
    beforeCreate() {
    },
    created(){
        this.shopid = this.$route.params.shopid
        this.userid = this.$store.state.user.userid
    },
    mounted() {
        this.isOff = true
        this.getShopList();
        this.getAdminIndexInfo();
    },
    methods:{
        getAdminIndexInfo() {
            getAdminIndexInfo({
                user_id: this.userid,
            }).then(res => {
                if (res.data.code == 1) {
                    this.shopInfo = res.data.data;
                }
            });
        },

        changeTypeNow(index){
            var oldindex = this.navsIndex
            var navtype = this.navsType
            if(oldindex == index){
                navtype = navtype == 0 ? 1 : 0
            }
            this.page = 1
            this.listData = []
            this.commentLoadedAll = false,
            this.noCommentLists = false,
            this.allowLoadMore = true,
            this.navsType = navtype
            this.navsIndex = index
            //重新请求
            this.getShopList()
        },

        //获取商品列表
        getShopList() {
            //console.log(this.allowLoadMore,this.commentLoadedAll,this.noCommentLists);
            if(!this.allowLoadMore || this.commentLoadedAll || this.noCommentLists) return;
            this.allowLoadMore = false;
            getShopList({
                page: this.page,
                sort: this.navsType == 0 ? 'asc' : 'desc',
                shop_id:this.shopid,
                order:this.navsIndex+1,
            }).then(res=>{
                //console.log('我的店铺', res);
                if (res.data.data.length < 20) this.commentLoadedAll = true;
                if (res.data.data.length == 0 && this.listData.length == 0) this.noCommentLists = true;
                this.listData.push(...res.data.data);
                this.allowLoadMore = true;
                this.page++;
          });
        },

        //商品下架
        delFromShop(id,index){
            this.feedback.Loading.open('操作中');
            delFromShop({
                goods_id:id,
                shop_id: this.shopid,
            }).then(res=>{
                console.log('下架商品',res)
                this.feedback.Loading.close();
                if(res.data.code==1){
                    let lists = this.listData;
                    lists.splice(index, 1);
                    this.listData = lists;
                }
                this.feedback.Toast({  msg:res.data.info, timeout:1500 });
            })
        },

        //店铺二维码
        goPreview(){
             this.$router.push({name:'AdminShopPreview',params:{shopid:this.shopid,userid:this.userid}});
        }

    },
    components: {
        scroller,
        LoadMore
    }
};

</script>

<style lang="less" scoped>
  @import './AdminShop.less';
</style>
