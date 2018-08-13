<template>
<div class="container">


    <div class='sing'>
        <div class='chose'>
            <div class='one'>
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

    
   
</div>
</template>

<script>

import { getMoneyWithdraw} from '@/api/index.js';
const wx = require('weixin-js-sdk');

export default {
    name: 'WealthWithdraw',
    data() {
        return {
            myMoney:'',
            inputvalue:''
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
        MoneyWithdraw(){
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
                getMoneyWithdraw({
                    waiter_id: this.$store.state.user.userid,
                    money: this.inputvalue
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
        }
        
    },
    components: {
      
    }
};

</script>

<style lang="less" scoped>
  @import './WealthWithdraw.less';
</style>
