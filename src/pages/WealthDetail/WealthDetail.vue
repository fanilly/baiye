<template>
<div class="container">
    
    
    
    <!-- 导航 -->
    <div class="nav-bar">
        <div class="nav-bar-item" v-for="(item,index) in navsData.lists" @click='changeType(index)'>
            <span>{{item}}</span>
            <div class="nav-line" :style="{opacity: navsData.index == index ? 1 : 0}"></div>
        </div>
    </div>

    

    <!-- 状态 1申请中 2成功 3已驳回 -->    
    <div class='scrollBox'>
        <scroller @getData="getWealthDetail">
            <div class="list">
                <div class="list-item income scroll-item" v-for="item in wealthData">
                    <div class="lside">
                        <div>{{item.remark}}</div>
                        <div>{{item.create_time}}</div>
                    </div>
                    <div class="rside">-{{item.change_money}}</div>
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

import { getWealthDetail } from '@/api/index.js';
const wx = require('weixin-js-sdk');

export default {
    name: 'WealthDetail',
    data() {
        return {
            wealthData:[],
            navsData: {
                index: 0,
                lists: ['提现中', '已完成']
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
        this.navsData.index = this.$route.params.index
        console.log(this.moneyInfo)
    },
    mounted() {
        this.feedback.Loading.open('请求中');
        this.getWealthDetail()
    },
    methods:{
        changeType(num){
            this.navsData.index = num
            this.page = 1
            this.wealthData = []
            this.commentLoadedAll = false
            this.noCommentLists = false
            this.allowLoadMore = true
            this.getWealthDetail();
        },
        getWealthDetail(){
            //console.log(this.allowLoadMore,this.commentLoadedAll,this.noCommentLists);
            if(!this.allowLoadMore || this.commentLoadedAll || this.noCommentLists) return;
            this.allowLoadMore = false;
            getWealthDetail({
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
  @import './WealthDetail.less';
</style>
