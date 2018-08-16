<template>
<div class="container">

    <div class='nav'>
        <div :class='{"on": typekind==0}' @click='changeType(0)'><span>全部</span></div>
        <div :class='{"on": typekind==1}' @click='changeType(1)'><span>收入</span></div>
        <div :class='{"on": typekind==2}' @click='changeType(2)'><span>支出</span></div>
    </div>

    <div :class='{"scrollBox":true,"ptnav":true}'>
        <scroller @getData="getUserWalletDetail">
            <div class='qlist'>
                <div class='item  scroll-item' v-for='item in moneyinfo'>
                    <div class='fleft'>
                        <div class='tit1'>{{item.remark}}</div>
                        <div class='tit2'>{{item.create_time}}</div>
                    </div>
                    <div class='fright green' v-if='item.type != 2'>+{{item.change_money}}</div>
                    <div class='fright red' v-if='item.type == 2'>-{{item.change_money}}</div>
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
import { getMoneyStraeam,getUserWalletDetail } from '@/api/index.js';
const wx = require('weixin-js-sdk');

export default {
    name: 'MyWalletStream',
    data() {
        return {
            typekind:0,
            page:1,
            moneyinfo:[],
            commentLoadedAll:false,
            noCommentLists:false,
            allowLoadMore: true,
            isnav:0,
            storeid:''
        };
    },
    beforeCreate() {

    },
    created(){
        console.log(this.$route.params)
        this.storeid = this.$route.params.storeid
    },
    mounted() {
        this.getUserWalletDetail()

    },
    methods:{
        changeType(num){
            this.typekind = num
            this.page = 1
            this.moneyinfo = []
            this.commentLoadedAll = false
            this.noCommentLists = false
            this.allowLoadMore = true
            this.getUserWalletDetail();
        },

        //普通用户明细
        getUserWalletDetail(){
            //console.log(this.allowLoadMore,this.commentLoadedAll,this.noCommentLists);
            if(!this.allowLoadMore || this.commentLoadedAll || this.noCommentLists) return;
            this.allowLoadMore = false;
            getUserWalletDetail({
                uid: this.$store.state.user.userid,
                page: this.page,
                status:this.typekind,
                shop_id: this.storeid
            }).then(res=>{
                console.log('普通用户交易明细', res);
                if (res.data.data.length < 20) this.commentLoadedAll = true;
                if (res.data.data.length == 0 && this.moneyinfo.length == 0) this.noCommentLists = true;
                this.moneyinfo.push(...res.data.data);
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
  @import './MyWalletStream.less';
</style>
