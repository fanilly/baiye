<template>
<div class="container">
    
    <!-- <div class='nav'>
        <div :class='{"on": typekind==0}' @click='changeType(0)'><span>全部</span></div> 
        <div :class='{"on": typekind==1}' @click='changeType(1)'><span>收入</span></div>
        <div :class='{"on": typekind==2}' @click='changeType(2)'><span>支出</span></div>
    </div> -->

    <div class='scrollBox'>
        <scroller @getData="getMoneyStraeam">
            <div class='qlist'>
                <div class='item  scroll-item' v-for='item in moneyinfo'>
                    <div class='fleft'>
                        <div class='tit1'>{{item.remark}}</div>
                        <div class='tit2'>{{item.create_time}}</div>
                    </div>
                    <div class='fright green' v-if='item.type != 3'>+{{item.change_money}}</div>
                    <div class='fright red' v-if='item.type == 3'>-{{item.change_money}}</div>
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
import { getMoneyStraeam } from '@/api/index.js';
const wx = require('weixin-js-sdk');

export default {
    name: 'MoneyStream',
    data() {
        return {
            typekind:0,
            page:1,
            moneyinfo:[],
            commentLoadedAll:false,
            noCommentLists:false,
            allowLoadMore: true,
        };
    },
    beforeCreate() {

    },
    created(){
        
    },
    mounted() {
        this.getMoneyStraeam()
        
    },
    methods:{
        changeType(num){
            this.typekind = num
            this.page = 1
            this.moneyinfo = []
            this.commentLoadedAll = false
            this.noCommentLists = false
            this.allowLoadMore = true
            this.getMoneyStraeam();
        },
        /*getMoneyStraeam(){
            getMoneyStraeam({
                user_id: this.$store.state.user.userid,
                page: this.page
            }).then(res => {
                console.log('收益明细',res)
                if (res.data.code == 1) {
                    this.moneyinfo = res.data.data;
                }
            });
        },*/
        getMoneyStraeam() {
            console.log(this.allowLoadMore,this.commentLoadedAll,this.noCommentLists);
            if(!this.allowLoadMore || this.commentLoadedAll || this.noCommentLists) return;
            this.allowLoadMore = false;
            getMoneyStraeam({
                user_id: this.$store.state.user.userid,
                page: this.page
            }).then(res=>{
                console.log('收益明细', res);
                if (res.data.data.length < 20) this.commentLoadedAll = true;
                if (res.data.data.length == 0 && this.moneyinfo.length == 0) this.noCommentLists = true;
                this.moneyinfo.push(...res.data.data);
                this.allowLoadMore = true;
                this.page++;
          });
    },

    },
    components: {
        scroller,
        LoadMore
    }
};

</script>

<style lang="less" scoped>
  @import './MoneyStream.less';
</style>
