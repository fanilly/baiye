<template>
<div class="container">
    
    <div class="header">
        <div class="lside">
            <div>我的余额(元)</div>
            <div>{{moneyData.available_money}}</div>
        </div>
        <div class="rside">申请提现</div>
    </div>

    <div class="record">
        <router-link class="item"  :to='{name:"WealthDetail",params:{shopid:shopid,index:0}}'>
            <div class="lside">申请中</div>
            <div class="center">{{moneyData.apply_money}}</div>
            <div class="rside">
                <img src="../../assets/baiye/icon09@2x.png" />
            </div>
        </router-link>
        <router-link class="item" :to='{name:"WealthDetail",params:{shopid:shopid,index:1}}'>
            <div class="lside">已完成</div>
            <div class="center">{{moneyData.cash_money}}</div>
            <div class="rside">
                <img src="../../assets/baiye/icon09@2x.png" />
            </div>
        </router-link>
    </div>

    <div class="list-btn-wapper" v-if='isOff'>
        <router-link class="btn-lists" :to='{name:"WealthStream",params:{shopid:shopid,money:moneyData.money,cash:moneyData.cash_money}}'>
            <img class="icon" src="../../assets/baiye/c19@2x.png" />
            <div class="center">账单明细</div>
            <div class="rside">
                <img src="../../assets/baiye/icon09@2x.png" />
            </div>
        </router-link>
        <router-link class="btn-lists" :to='{name:"WealthPassword",params:{shopid:shopid,haspassword:moneyData.has_password}}'>
            <img class="icon" src="../../assets/baiye/c20@2x.png" />
            <div class="center">提现密码{{moneyData.has_password ? '修改' : '设置'}}</div>
            <div class="rside">
                <img src="../../assets/baiye/icon09@2x.png" />
            </div>
        </router-link>
    </div>

   
</div>
</template>

<script>

import { getShopWealth } from '@/api/index.js';
const wx = require('weixin-js-sdk');

export default {
    name: 'Wealth',
    data() {
        return {
           moneyData:{},
           shopid:'',
           isOff:false
        };
    },
    beforeCreate() {
    },
    created(){
        this.shopid = this.$route.params.shopid
    },
    mounted() {
        //this.feedback.Loading.open('请求中');
        this.getShopWealth()
    },
    methods:{
        getShopWealth(){
            getShopWealth({
               shop_id :this.shopid
            }).then(res=>{
                this.isOff = true
                //this.feedback.Loading.close();
                console.log('我的财富',res)
                if(res.data.code==1){
                    this.moneyData = res.data.data
                }
            })
        }
    },
    components: {
      
    }
};

</script>

<style lang="less" scoped>
  @import './Wealth.less';
</style>
