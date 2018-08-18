<template>
<div class="container">

    <div class='step'>
        <div class="info">
            <div class='fsg'>
                <div class='fr'><input placeholder='请输入新手机号' v-model='phone' /> </div>
            </div>
            <div class='fsg'>
                <div class='fr pr'>
                    <input placeholder='请输入验证码'  v-model='codes' type='number' />
                    <div :class='{"off": beginning}' @click='sendPhoneCode' >{{beginning ? '倒计时' + time + 's' : '发送验证码'}}</div>
                </div>
            </div>
        </div>
        <div class='fbottom'>
            <div class='submit' formType="submit" @click='changePhone'>确认</div>
        </div>
    </div>

</div>
</template>

<script>
import { sendPhoneCode, changePhone } from '@/api/index.js';
const wx = require('weixin-js-sdk');


export default {
    name: 'UserPhoneSet',
    data() {
        return {
            onflg:true,
            user_id:this.$store.state.user.userid,
            phone:'',
            time: 180,
            beginning: false,
            timer: null,
            codes:''
        };
    },
    beforeCreate() {

    },
    created(){

    },
    mounted() {
        console.log(this.userInfo)

    },
    methods:{
        sendPhoneCode(){
            if(this.phone=='') {
                this.feedback.Toast({  msg:'手机号不能为空',  timeout:1500 });
            }else if(this.phone.length!=11){
                this.feedback.Toast({  msg:'手机号长度有误，请重新输入',  timeout:1500 });
            }else if(!this.beginning){
                sendPhoneCode({
                     name: 'bind_phone',
                     user_id: this.user_id,
                     mobile: this.phone
                }).then(res => {
                    console.log('发送验证码',res)
                    this.feedback.Toast({  msg:res.data.info,  timeout:1500 });
                    if (res.data.code == 1) {
                        this.onflg = false

                        //显示倒计时
                        this.beginning =  true;
                        //开始倒计时
                        this.timer = setInterval(()=>{
                            let tempTime = this.time;
                            if (tempTime == 0) {
                                //倒计时结束
                                clearInterval(this.timer);
                                this.time = 180;
                                this.beginning =  false
                                return;
                            }
                            this.time = tempTime - 1
                        }, 1000);
                    }
                });
            }
        },
        changePhone(){
            if(this.phone=='') {
                this.feedback.Toast({  msg:'手机号不能为空',  timeout:1500 });
            }else if(this.phone.length!=11){
                this.feedback.Toast({  msg:'手机号长度有误，请重新输入',  timeout:1500 });
            }else if(this.codes==''){
                this.feedback.Toast({  msg:'验证码不能为空',  timeout:1500 });
            }else{
                changePhone({
                     code: this.codes,
                     user_id: this.user_id,
                     phone: this.phone
                }).then(res => {
                    console.log('修改手机号',res)
                    if (res.data.code == 1) {
                        this.feedback.Toast({  msg:'修改成功',  timeout:1500 });
                        setTimeout(()=>{
                             this.$router.back(-1)
                        },1500)
                    }else{
                        this.feedback.Toast({  msg:res.data.info,  timeout:1500 });
                    }
                });
            }
        }

    },
    components: {
    }
};

</script>

<style lang="less" scoped>
  @import './UserPhoneSet.less';
</style>
