<template>
<div class="container">

    <div class='rest'>
        <div class='tit1'>当前余额</div>
        <div class='tit2'>{{income.money}}</div>
        <!-- :to="{name:'Shop',params:{shopid:myShop.id}}" -->
        <!-- <router-link :to="{name:'MoneyWithdraw',params:{money:income.money}}"  class='gopay JB' v-if='isWaiter==0'>购卡充值</router-link> -->
        <router-link :to="{name:'MoneyWithdraw',params:{money:income.money}}" class='gopay JB' v-if='isWaiter==1'>提现</router-link>
    </div>


    <div class='come'>
         <!-- bindtap='golink' data-url='../moneystream/moneystream?waiter={{tixian}}&id={{moneyinfo.waiter_id}}' -->
        <router-link :to="{name:'MoneyStream'}" class='yellow'>交易明细</router-link>
        <span>|</span>
        <!--  bindtap='golink' data-url='../issue/issue' -->
        <router-link class='yellow' :to="{name:'IssueList'}">常见问题</router-link>
    </div>

    
   
</div>
</template>

<script>

import { getMoneyRest,getMoneyRestAll } from '@/api/index.js';
const wx = require('weixin-js-sdk');

export default {
    name: 'MoneyRest',
    data() {
        return {
            host:global.host,
            income:Object,
            isWaiter:-1,
        };
    },
    beforeCreate() {
    },
    created(){
        console.log('created',this.$route.params.waitid)
        if(this.$route.params.waitid>0){
            this.isWaiter = 1 //服务员
        }else{
            this.isWaiter = 0 //普通用户
        }
    },
    mounted() {
        console.log('mounted',this.host)
        if(this.isWaiter==1){
            this.getMoneyRest()
        }else if(this.isWaiter==0){
            //this.getMoneyRestAll()
        }
        
    },
    methods:{
        getMoneyRest(){
            getMoneyRest({
                user_id: this.$store.state.user.userid
            }).then(res => {
                console.log('服务员的收益',res)
                if (res.data.code == 1) {
                    this.income = res.data.data;
                }
            });
        },
        getMoneyRestAll(){
            getMoneyRestAll({
                user_id: this.$store.state.user.userid,
                shop_id: app.globalData.waiter_shop_id,
            }).then(res => {
                console.log('普通用户的收益',res)
                if (res.data.code == 1) {
                    this.income = res.data.data;
                }
            }); 
        } 
    },
    components: {
      
    }
};

</script>

<style lang="less" scoped>
  @import './MoneyRest.less';
</style>
