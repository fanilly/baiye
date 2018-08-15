<template>
<div class="container">


    <div class='sing'>
        <div class='chose'>
            <div class='one'  @click='openAccountOk = true'>
                <div class='sleft'>提现至</div>
                <img src='../../assets/return.png' />
                <div class="sr">{{types}}</div>
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
        </div>
    </div>

    <div class='fbottom'>
        <div class='submit JB' @click='goWithdraw'>确认提现</div>
    </div>

    <div class="popBg" v-cloak v-if='openAccountOk' @click='openAccountOk = false'></div>
    <div class="popPicker" v-cloak v-if='openAccountOk'>
        <h2>选择提现方式 <span  @click='openAccountOk = false'>确定</span></h2>
        <picker :data='accounts' v-model='accountValue' @on-change='changeAccount'></picker>
    </div>

    <div class="pop-mask" v-if="startWidthdraw">
        <div class="pop">
            <div class="ptitle">请输入提现密码</div>
            <div class="close" @click='startWidthdraw=false'>
                <img src='../../assets/shopicon17.png' />
            </div>
            <div class="price">
                <span>￥</span>{{inputvalue}}</div>
            <div class="desc">提现金额</div>
            <div class="input-group">
                <input type="password" maxlength="6" v-model ='password'/>
                <!-- <input v-for="(item,index) in passwordData" maxlength="1" type="password" v-model="passwordData[index]" />
                <div class="hide-input" bindtap="handleStartInput">
                    <input type="number" focus="foucs" maxlength="6" bindinput="handleRecordPwd" confirm-type="send" />
                </div> -->
            </div>
            <div class='sure' @click='makeShopWithdraw'>确定</div>

        </div>
    </div>

   
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
            openAccountOk:false,
            type:1,
            passwordData:[-1, -1, -1, -1, -1, -1],
            foucs: false,
            password:' ',
            startWidthdraw:false,
            types:'微信零钱'
        };
    },
    beforeCreate() {
    },
    created(){
       console.log('created',this.$route.params.money) 
       this.myMoney = this.$route.params.money
       this.shopid = this.$route.params.shopid
    },
    mounted(){
        
    },
    methods:{
        //打开密码框
        goWithdraw(){
            if(this.myMoney==0){
                this.feedback.Toast({  msg:'当前余额为0，无法提现',  timeout:1500 });
            }else if(this.inputvalue==""){
                this.feedback.Toast({  msg:'请先输入提现金额',  timeout:1500 });
            }else if(this.inputvalue*1>this.myMoney*1){
                this.feedback.Toast({  msg:'提现金额不足，请重新输入',  timeout:1500 });
            }else if(this.inputvalue==0){
                this.feedback.Toast({  msg:'请输入正确的提现金额',  timeout:1500 });
            }else{
                this.password = ''
                this.startWidthdraw = true
            }
            
        },
        //提交
        makeShopWithdraw(){
            console.log('dfdjs',this.myMoney,this.inputvalue)
            if(this.password.length==''){
                this.feedback.Toast({  msg:'请输入提现密码',  timeout:1500 });
            }else if(this.password.length!=6){
                this.feedback.Toast({  msg:'提现密码长度有误',  timeout:1500 });
            }else{
                makeShopWithdraw({
                    shop_id: this.shopid,
                    money: this.inputvalue,
                    type: this.type,
                    password:this.password
                }).then(res => {
                    console.log('提现',res)
                    if (res.data.code == 1) {
                        this.startWidthdraw = false
                        this.feedback.Toast({  msg:'提现成功！',  timeout:1500 });
                        setTimeout(()=>{
                             this.$router.back(-1)
                        },1500)
                    }else{
                        this.feedback.Toast({  msg:res.data.info,  timeout:1500 });
                    }
                });
            }
        },

        //全部提现
        getAll(){
            this.inputvalue = this.myMoney
        },

        //选择提现方式
        changeAccount(value){
            var res = value[0]
            this.types = res
            console.log(value[0])
            if(res=='微信零钱'){ this.type = 1
            }else{   this.type = 2  }
        },
        
    },
    components: {
        Picker
    }
};





</script>

<style lang="less" scoped>
  @import './WealthWithdraw.less';
</style>
