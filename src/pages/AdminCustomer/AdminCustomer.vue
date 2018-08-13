<template>
<div class="container">
    
    
    <div class="wapper">
        <div class='scrollBox'>
            <scroller @getData="getShopCustomer">
                <div class="list" v-if='lists.length>0'>
                    <div class="list-item scroll-item" v-for="item in lists" >
                        <div class="lside">
                            <img :src="item.headimgurl" />
                        </div>
                        <div class="rside">
                            <div class="header">
                                <div>{{item.nickname}}</div>
                                <div v-if='item.mobile'>{{item.mobile}}</div>
                                <a class="tel"  @click='makePhoneCall(123125465)'>拨打</a>
                            </div>
                            <div class="count">消费次数： {{item.buy_size}}</div>
                            <div class="money">消费总额：
                                <span class="unit">￥</span>
                                <span>{{item.consumption}}</span>
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

import { getShopCustomer } from '@/api/index.js';
const wx = require('weixin-js-sdk');

export default {
    name: 'AdminCustomer',
    data() {
        return {
            lists:[],
            page:1,
            moneyinfo:[],
            commentLoadedAll:false,
            noCommentLists:false,
            allowLoadMore: true,
            shopid:''
        };
    },
    beforeCreate() {
    },
    created(){
        this.shopid = this.$route.params.shopid
    },
    mounted() {
        this.getShopCustomer()
    },
    methods:{
        //获取客户列表
        getShopCustomer(){
            console.log(this.allowLoadMore,this.commentLoadedAll,this.noCommentLists);
            if(!this.allowLoadMore || this.commentLoadedAll || this.noCommentLists) return;
            this.allowLoadMore = false;
            getShopCustomer({
                shop_id: this.shopid,
                page: this.page
            }).then(res=>{
                console.log('我的客户', res);
                if (res.data.data.length < 20) this.commentLoadedAll = true;
                if (res.data.data.length == 0 && this.lists.length == 0) this.noCommentLists = true;
                this.lists.push(...res.data.data);
                this.allowLoadMore = true;
                this.page++;
            });
        },
        //拨打电话
        makePhoneCall(phone){
            console.log('拨打电话')
            window.location.href = 'tel://'+phone
        } 
    },
    components: {
        scroller,
        LoadMore
    }
};

</script>

<style lang="less" scoped>
  @import './AdminCustomer.less';
</style>
