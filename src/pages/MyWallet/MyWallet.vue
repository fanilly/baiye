<template>
<div class="container">

    <div class='rest'>
        <div class='tit1'>当前余额</div>
        <div class='tit2'>{{income.money}}</div>
        <router-link :to="{name:'BuyVipCard',params:{storeid:storeid}}"  class='gopay JB'>购卡充值</router-link>
    </div>


    <div class='come'>
        <router-link :to="{name:'MyWalletStream',params:{storeid:storeid}}" class='yellow'>交易明细</router-link>
        <span>|</span>
        <router-link class='yellow' :to="{name:'IssueList'}">常见问题</router-link>
    </div>

    
   
</div>
</template>

<script>

import { getUserWallet } from '@/api/index.js';
const wx = require('weixin-js-sdk');

export default {
    name: 'MyWallet',
    data() {
        return {
            host:global.host,
            income:Object,
            isWaiter:-1,
            storeid:''
        };
    },
    beforeCreate() {
    },
    created(){
        console.log('created',this.$route.params.storeid)
        this.storeid = this.$route.params.storeid
    },
    mounted() {
        console.log('mounted',this.host)
        this.getUserWallet()
    },
    methods:{

        getUserWallet(){
            getUserWallet({
                user_id: this.$store.state.user.userid,
                shop_id: this.storeid ,
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
  @import './MyWallet.less';
</style>
