<template>
<div class="container">


    <div class='sing'>
        <div class='chose'>
            <div class='one'  @click='openAccountOk = true'>
                <div class='sleft'>提现至</div>
                <img src='../../assets/return.png' />
                <div class="sr">微信</div>
            </div>
        </div>
    </div>

    <div class='sing'>
        <div class='tit1'>提现金额</div>
        <div class='shuru'>
            <span>¥</span>
            <input placeholder='输入金额' v-model="inputvalue" type="number" ></input>
        </div>
        <div class='both'>
            <span class='tl'>可提现金额 ¥{{myMoney}}</span>
            <span class='t2' @click='getAll'>全部提现</span>
             <!-- bindtap='choseall' -->
        </div>
    </div>

    <div class='fbottom'>
        <div class='submit JB' @click='MoneyWithdraw'>确认提现</div>
         <!-- bindtap='gopay' -->
    </div>

    <div class="popBg" v-cloak v-if='openAccountOk' @click='openAccountOk = false'></div>
    <div class="popPicker" v-cloak v-if='openAccountOk'>
        <h2>选择性别 <span  @click='openAccountOk = false'>确定</span></h2>
        <picker :data='accounts' v-model='accountValue' @on-change='changeAccount'></picker>
    </div>

    <!-- <view class="pop-mask" wx:if="{{startWidthdraw}}">
        <view class="pop">
            <view class="ptitle">请输入提现密码</view>
            <view class="close" bindtap="handleClosePop">
                <image src="../images/shopicon48.png"></image>
            </view>
            <view class="price">
                <text>￥</text>{{inputMoney}}</view>
            <view class="desc">提现金额</view>
            <view class="input-group">
                <input wx:for="{{password}}" wx:key="{{index}}" maxlength="1" type="password" data-index="{{index}}" value="{{item == -1 ? '' : item}}" />
                <view class="hide-input" bindtap="handleStartInput">
                    <input type="number" focus="{{foucs}}" maxlength="6" bindinput="handleRecordPwd" confirm-type="send" />
                </view>
            </view>
        </view>
    </view> -->

   
</div>
</template>

<script>
import {  Picker } from 'vux'

import { makeShopWithdraw} from '@/api/index.js';
const wx = require('weixin-js-sdk');

export default {
    name: 'WealthWithdraw',
    data() {
        return {
            myMoney:'',
            inputvalue:'',
            accounts:[[
                { id: 0, name: '微信零钱', value:'微信零钱' },
                { id: 1, name: '支付宝账户', value:'支付宝账户' }
            ]],
            accountValue:[''],
            account:'',
            openAccountOk:false
        };
    },
    beforeCreate() {
    },
    created(){
       console.log('created',this.$route.params.money) 
       this.myMoney = this.$route.params.money
    },
    mounted(){
        
    },
    methods:{
        makeShopWithdraw(){
            if(this.myMoney==0){
                this.feedback.Toast({  msg:'当前余额为0，无法提现',  timeout:1500 });
            }else if(this.inputvalue==""){
                this.feedback.Toast({  msg:'请先输入提现金额',  timeout:1500 });
                this.inputvalue = ''
            }else if(this.inputvalue*1>this.myMoney*1){
                this.feedback.Toast({  msg:'提现金额不足，请重新输入',  timeout:1500 });
                this.inputvalue = ''
            }else if(this.inputvalue==0){
                this.feedback.Toast({  msg:'请输入正确的提现金额',  timeout:1500 });
                this.inputvalue = ''
            }else{
                makeShopWithdraw({
                    /*waiter_id: this.$store.state.user.userid,
                    money: this.inputvalue*/

                    // shop_id Integer[整数] 必填   1  虚拟店ID 
                    // money Integer[整数] 必填   10  提现金额 最少10元 
                    // password String[字符串] 必填     提现密码 
                    // type 1微信 2支付宝

                }).then(res => {
                    console.log('提现',res)
                    this.inputvalue = ''
                    if (res.data.code == 1) {
                        this.feedback.Toast({  msg:'提现成功！',  timeout:1500 });
                        setTimeout(()=>{
                             this.$router.back(-1)
                        },1500)
                    }
                });
            }
        },
        getAll(){
            this.inputvalue = this.myMoney
        },
        changeAccount(value){
            this.accountValue = value
            if(value=='微信零钱') this.sex = 1
            else if(value=='支付宝账户') this.sex = 2
        },
        
    },
    components: {
      
    }
};





</script>

<style lang="less" scoped>
  @import './WealthWithdraw.less';
</style>
