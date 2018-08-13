<template>
<div class="container">
    
    <div class="header">
        <div class="item">
            <div><span>￥</span>{{moneyInfo.money}}</div>
            <div>总收入</div>
        </div>
        <div class="item">
            <div><span>￥</span>{{moneyInfo.cash}}</div>
            <div>已提现</div>
        </div>
    </div>

    <!-- 导航 -->
    <div class="nav-bar">
        <!--  wx:for="{{navsData.lists}}" wx:key="{{index}}" data-index="{{index}}" bindtap="handleToggleNavs" -->
        <div class="nav-bar-item" v-for='(item,index) in navsData.lists' @click='changeType(index)'>
            <span>{{item}}</span>
            <div class="nav-line" :style="{opacity: navsData.index == index ? '1' : '0'}"></div>
        </div>
    </div>

    <div class="list-header">
        <div>时间</div>
        <div>金额</div>
        <div>状态</div>
    </div>


    <!-- 状态 1申请中 2成功 3已驳回 -->    
    <div class='scrollBox'>
        <scroller @getData="getWealthStream">
            <div class="list">
                <div class="list-item  scroll-item" v-for="(item,index) in wealthData">
                    <div class="lside">
                        <div>{{item.create_date}}</div>
                        <div>{{item.create_time}}</div>
                    </div>
                    <div class="lside">
                        <div><span>+</span>{{item.change_money}}</div>
                        <div>{{item.remark}}</div>
                    </div>
                    <div class="rside">{{item.status == 1 ? '申请中' : item.status == 2 ? '成功' : '已驳回'}}</div>
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

import { getWealthStream } from '@/api/index.js';
const wx = require('weixin-js-sdk');

export default {
    name: 'WealthStream',
    data() {
        return {
           wealthData:[],
           navsData: {
                index: 0,
                lists: ['累计收入', '提现记录']
            },
            moneyInfo:{},

            typekind:0,
            page:1,
            commentLoadedAll:false,
            noCommentLists:false,
            allowLoadMore: true,
        };
    },
    beforeCreate() {
    },
    created(){
        this.moneyInfo = this.$route.params
        console.log(this.moneyInfo)
    },
    mounted() {
        this.feedback.Loading.open('请求中');
        this.getWealthStream()
    },
    methods:{
        changeType(num){
            this.navsData.index = num
            this.page = 1
            this.wealthData = []
            this.commentLoadedAll = false
            this.noCommentLists = false
            this.allowLoadMore = true
            this.getWealthStream();
        },
        getWealthStream(){
            //console.log(this.allowLoadMore,this.commentLoadedAll,this.noCommentLists);
            if(!this.allowLoadMore || this.commentLoadedAll || this.noCommentLists) return;
            this.allowLoadMore = false;
            getWealthStream({
                shop_id: this.moneyInfo.shopid,
                page: this.page,
                status: this.navsData.index * 1 + 1
            }).then(res=>{
                this.feedback.Loading.close()
                console.log('我的财富明细', res);
                if (res.data.data.length < 20) this.commentLoadedAll = true;
                if (res.data.data.length == 0 && this.wealthData.length == 0) this.noCommentLists = true;
                this.wealthData.push(...res.data.data);
                this.allowLoadMore = true;
                this.page++;
            });
        }
    },
    components: {
        scroller,
        LoadMore
    }
};

</script>

<style lang="less" scoped>
  @import './WealthStream.less';
</style>
