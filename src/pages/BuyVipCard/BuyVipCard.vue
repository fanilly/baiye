<template>
<div class="container">


    <div class='card'>
        <div class="part" v-if="mylist.length>0">
            <div class='tit3'>
                <img class='timg' src='../../assets/icon01.png' /> 已购会员卡
            </div>
            <!-- bindtap='godetail' data-cardid="{{item.card_id}}" data-status="{{item.status}}"  -->
            <img class='bimg' src='../../assets/hhhh_09.png' />
            <div class="nomore">尚未购买会员卡</div>
            <div class='list' v-for="item in mylist" @click='goDetail(item.card_id,item.status)'>
                <img class='card-bg' :src='item.surface' />
                <div class="card-surface">
                    <div class="card-surface-title">
                        <img class="tx-img" :src='shopinfo.avatar' />{{shopinfo.name}}
                    </div>
                    <div class="card-surface-content">
                        <div class="title">{{item.name}}</div>
                        <div class="date" v-if="item.effective">有效期:{{item.effective}}个月</div>
                        <div class="date" v-if="!item.effective">有效期:永久有效</div>
                    </div>
                </div>
                <div class="price">￥
                    <span class="font60">{{item.price}}</span>
                </div>
            </div>
        </div>
        <div class="part">
            <div class='tit3'>
                <img class='timg' src='../../assets/icon02.png' /> 购买会员卡
            </div>
            <img class='bimg' src='../../assets/hhhh_09.png' />
            <div class="nomore"  v-if="cardlist.length==0">暂无可购买的会员卡，敬请期待！</div>
           <!-- bindtap='godetail' data-cardid="{{item.aid}}" -->
            <div class='list' v-for="item in cardlist"  @click='goDetail(item.aid,0)'  v-if="cardlist.length>0">
                <img class='card-bg' :src='item.surface' />
                <div class="card-surface">
                    <div class="card-surface-title">
                        <img class="tx-img" :src='shopinfo.avatar' />
                        <span style="flex:1;">{{shopinfo.name}}</span>
                    </div>
                    <div class="card-surface-content">
                        <div class="title">{{item.name}}</div>
                        <div class="date" v-if="item.effective">有效期:{{item.effective}}个月</div>
                        <div class="date" v-if="!item.effective">有效期:永久有效</div>
                    </div>
                </div>
                <div class="price-buy">￥
                    <span class="font60">{{item.price}}</span>
                </div>
                <div class="price-btn" v-if="item.type == 1">
                    <span class="font30 bg-yew">立即购买</span>
                </div>
                <div class="price-btn" v-if="item.type == 2">
                    <span class="font30 bg-black">立即购买</span>
                </div>
            </div>
        </div>
    </div>


    
   
</div>
</template>

<script>

import { getVipCardList,getMyVipCard,getPhysicalShopDetail } from '@/api/index.js';
const wx = require('weixin-js-sdk');

export default {
    name: 'BuyVipCard',
    data() {
        return {
            host:global.host,
            mylist:[],
            cardlist:[],
            storeid:'',
            shopinfo:{}
        };
    },
    beforeCreate() {
    },
    created(){
        this.storeid = this.$route.params.storeid
    },
    mounted() {
        console.log('mounted',this.storeid)
        this.feedback.Loading.open('加载中');
        this.getMyVipCard()
        this.getVipCardList()
        this.getPhysicalShopDetail()
    },
    methods:{
        //获取实体店店铺信息
        getPhysicalShopDetail(){
            getPhysicalShopDetail({
                user_id: this.$store.state.user.userid,
                id: this.storeid 
            }).then(res=>{
                console.log('获取店铺信息',res)
                if (res.data.code == 1) {
                    this.shopinfo = res.data.data;
                }else{
                    this.feedback.Toast({  msg:res.data.info,  timeout:1500 });
                }
            })
        },
        //获取我的会员卡
        getMyVipCard(){
            getMyVipCard({
                uid: this.$store.state.user.userid,
                shopid: this.storeid ,
            }).then(res => {
                console.log('获取我的会员卡',res)
                if (res.data.code == 1) {
                    this.mylist = res.data.data;
                }else{
                    this.feedback.Toast({  msg:res.data.info,  timeout:1500 });
                }
            }); 
        },
        //获取可购买会员卡
        getVipCardList(){
            getVipCardList({
                shopid: this.storeid ,
            }).then(res => {
                this.feedback.Loading.close()
                console.log('获取可购买会员卡',res)
                if (res.data.code == 1) {
                    this.cardlist = res.data.data;
                }else{
                    this.feedback.Toast({  msg:res.data.info,  timeout:1500 });
                }
            }); 
        },
        //会员卡详情
        goDetail(id,status){
            this.$router.push({name:'BuyVipDetail',params:{storeid:this.storeid,goodid:id,status:status}})
        }
    },
    components: {
      
    }
};

</script>

<style lang="less" scoped>
  @import './BuyVipCard.less';
</style>
