<template>
<div class="container">
    
    <div class='page-wapper'>
        <!-- shopInfo -->
        <div class="shop-header">
            <img class="bg" :src="shopInfo.banner" />
            <img class="bg1" src="../../assets/baiye/imgmask.png" />
            <div class="show-header-content">
                <img class="head-img" :src="shopInfo.avatar" />
                <div class="nickname">{{shopInfo.shop_name}}</div>
            </div>
        </div>

        <!-- 内容 -->
        <div class='scrollBox'>
            <scroller @getData="getShopList">
                <div class="goods-list-wapper">
                    <div class="goods-list-item-wapper scroll-item" v-for='(item,index) in listData' @click='goItemDetail(item.id)'>
                        <div class="goods-list-item">
                            <div class="lside">
                                <img :src="item.img_url" mode="aspectFill" />
                            </div>
                            <div class="rside">
                                <div class="title">{{item.title}}</div>
                                <div class="remark">
                                    <div>￥<span>{{item.share_price}}</span></div>
                                    <div class="btn">马上抢</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <load-more :show-loading="!commentLoadedAll && !noCommentLists" :tip="!commentLoadedAll && !noCommentLists ? '加载中' : '已加载全部数据'" background-color="#fbf9fe"></load-more>
            </scroller>
        </div>
    </div>

   
</div>
</template>

<script>
import { LoadMore } from 'vux';
import scroller from '@/components/scroller/scroller.vue';

import { getShopList,getAdminIndexInfo } from '@/api/index.js';
const wx = require('weixin-js-sdk');

export default {
    name: 'AdminShopPreview',
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
            userid:'',
        };
    },
    beforeCreate() {
    },
    created(){
        console.log(this.$route.params.shopid,this.$route.params.userid)
        this.shopid = this.$route.params.shopid
        this.userid = this.$route.params.userid
    },
    mounted() {
        this.feedback.Loading.open('加载中');
        this.getAdminIndexInfo();
        this.getShopList();
    },
    methods:{
        getAdminIndexInfo() {
            getAdminIndexInfo({
                user_id: this.userid,
            }).then(res => {
                this.feedback.Loading.close()
                //console.log('虚拟店信息',res)
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
                //console.log('下架商品',res)
                this.feedback.Loading.close();
                if(res.data.code==1){
                    let lists = this.listData;
                    lists.splice(index, 1);
                    this.listData = lists;
                }
                this.feedback.Toast({  msg:res.data.info, timeout:1500 });
            })
        },


        //去详情页
        goItemDetail(id){
            this.$router.push({name:'AdminShopDetail',params:{shopid:this.shopid,goodid:id}})
        }

    },
    components: {
        scroller,
        LoadMore
    }
};

</script>

<style lang="less" scoped>
  @import './AdminShopPreview.less';
</style>
