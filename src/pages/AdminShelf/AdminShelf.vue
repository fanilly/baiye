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
        <scroller @getData="getAllShopList">
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
                        <div class="btn line" @click='addFromShop(item.id,index)'>上架</div>
                    </div>
                </div>
            </div>
            <load-more :show-loading="!commentLoadedAll && !noCommentLists" :tip="!commentLoadedAll && !noCommentLists ? '加载中' : '已加载全部数据'" background-color="#fbf9fe"></load-more>
        </scroller>

    </div>


   
</div>
</template>

<script>
import { LoadMore } from 'vux';
import scroller from '@/components/scroller/scroller.vue';

import { getAllShopList,addFromShop } from '@/api/index.js';
const wx = require('weixin-js-sdk');

export default {
    name: 'AdminShelf',
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
            shopid:''
        };
    },
    beforeCreate() {
    },
    created(){
        this.shopid = this.$route.params.shopid
    },
    mounted() {
        this.getAllShopList();
    },
    methods:{
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
            this.getAllShopList()
        },

        //获取商品列表
        getAllShopList() {
            //console.log(this.allowLoadMore,this.commentLoadedAll,this.noCommentLists);
            if(!this.allowLoadMore || this.commentLoadedAll || this.noCommentLists) return;
            this.allowLoadMore = false;
            getAllShopList({
                page: this.page,
                sort: this.navsType == 0 ? 'asc' : 'desc',
                shop_id:this.shopid,
                order:this.navsIndex+1,
            }).then(res=>{
                console.log('选品上架', res);
                if (res.data.data.length < 20) this.commentLoadedAll = true;
                if (res.data.data.length == 0 && this.listData.length == 0) this.noCommentLists = true;
                this.listData.push(...res.data.data);
                this.allowLoadMore = true;
                this.page++;
          });
        },

        //商品上架
        addFromShop(id,index){
            this.feedback.Loading.open('操作中');
            addFromShop({
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
        }

    },
    components: {
        scroller,
        LoadMore
    }
};

</script>

<style lang="less" scoped>
  @import './AdminShelf.less';
</style>
