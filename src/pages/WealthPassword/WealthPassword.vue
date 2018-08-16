<template>
<div class="container">


    <div class="input-box-wapper">
        <div class="input-box-type1">
            <input type="number" v-model='shopPhone' bindinput="recordPhoneNumber" placeholder="" disabled />
        </div>
        <div class="input-box-type1">
            <input placeholder-style="color:#ccc" maxlength="6" v-model='code' type="number" name="code" placeholder="验证码" />
            <div class="btn" @click='sendAdminCode' :style="{color:beginning ? '#cccccc' : '#000000'}">{{beginning ? '倒计时' + time + 's' : '发送验证码'}}</div>
        </div>
    </div>
    <div class="input-box-wapper">
        <div class="input-box-type1" v-if="is_password">
            <input placeholder-style="color:#ccc" type="password" v-model='old_password' name="old_password" placeholder="请输入旧的提现密码" />
        </div>
        <div class="input-box-type1">
            <input placeholder-style="color:#ccc" type="password" v-model='password' name="password" placeholder="请输入提现密码" />
        </div>
        <div class="input-box-type1">
            <input placeholder-style="color:#ccc" type="password" v-model='confirm_password' name="confirm_password" placeholder="再次确认提现密码" />
        </div>
    </div>
    <div class="footer">
        <button form-type="submit" class="btn" @click='goSubmit'>确定</button>
        <!-- <button form-type="submit" v-if="!is_password" class="btn" @click='submitPasswordSet'>确认</button> v-if="is_password" -->
    </div>



</div>
</template>

<script>


import { checkShopSetting, submitPasswordChange, submitPasswordSet, sendAdminCode } from '@/api/index.js';
const wx = require('weixin-js-sdk');

export default {
    name: 'WealthPassword',
    data() {
        return {
            routeData:{},
            is_password:true,
            shopPhone:'',
            time: 180,
            beginning: false,
            code:'',
            old_password:'',
            password:'',
            confirm_password:'',
        };
    },
    created(){
        this.routeData = this.$route.params;
        this.is_password = this.routeData.haspassword == "true" || this.routeData.haspassword == true;
        document.title = this.is_password ? '提现密码修改' : '提现密码设置';
    },
    mounted() {
        this.checkShopSetting();
    },
    methods:{
        //获取店铺设置
        checkShopSetting(){
            checkShopSetting({
                shop_id:this.routeData.shopid
            }).then(res=>{
                console.log('查看店铺设置信息',res)
                if(res.data.code==1 ){
                    if( res.data.data.phone==''){
                        this.feedback.Confirm({
                            title: '温馨提示',
                            msg: '系统检测到您的店铺信息未绑定手机号，请先绑定手机号才能（设置/修改）支付密码',
                            options: [{ txt: '取消',  color: '#999',
                            callback: () => {
                                    this.$router.go(-1) //返回上一页
                                }
                            }, { txt: '确定', color: '#0bb20c',
                                callback: () => {
                                    //跳转到设置页
                                }
                            }]
                        });
                    }else{
                        this.shopPhone = res.data.data.phone
                    }
                }
            })
        },
        //设置密码
        submitPasswordSet(forms){
            submitPasswordSet(forms)
            .then(res=>{
                console.log('设置密码',res)
                this.feedback.Toast({  msg:res.data.info,  timeout:1500 });
                if(res.data.code==1){
                    setTimeout(()=>{
                         this.$router.back(-1)
                    },1500)
                }
            })
        },
        //修改密码
        submitPasswordChange(forms){
            submitPasswordChange(forms)
            .then(res=>{
                console.log('修改密码',res)
                this.feedback.Toast({  msg:res.data.info,  timeout:1500 });
                if(res.data.code==1){
                    setTimeout(()=>{
                         this.$router.back(-1)
                    },1500)
                }
            })
        },
        //提交数据
        goSubmit(){
            if(this.code=='') this.feedback.Toast({  msg:'请输入验证码',  timeout:1500 });
            else if(this.old_password=='' && this.is_password) this.feedback.Toast({  msg:'请输入旧的提现密码',  timeout:1500 });
            else if(this.password=='') this.feedback.Toast({  msg:'请输入提现密码',  timeout:1500 });
            else if(this.confirm_password=='') this.feedback.Toast({  msg:'请确认提现密码',  timeout:1500 });
            else if(this.password.length!=6 || this.confirm_password.length!=6 ) this.feedback.Toast({  msg:'提现密码应由6位数字组成',  timeout:1500 });
            else if(this.password != this.confirm_password) this.feedback.Toast({  msg:'两次输入的提现密码不一致',  timeout:1500 });
            else{
                var forms = {}
                forms.password = this.password
                forms.confirm_password = this.confirm_password
                forms.code = this.code
                forms.shop_id = this.routeData.shopid

                if(this.is_password){
                    forms.old_password = this.old_password
                    this.submitPasswordChange(forms)
                }else{
                    forms.old_password = ''
                    this.submitPasswordSet(forms)
                }
            }
        },
        //发送验证码
        sendAdminCode(){
            if(!this.beginning){
                this.feedback.Loading.open('发送中');
                sendAdminCode({
                    mobile: this.shopPhone,
                    name: this.is_password ? 'change_transaction_password' : 'set_transaction_password'
                }).then(res=>{
                    this.feedback.Loading.close()
                    console.log('发送验证码',res)
                    if(res.data.code==1){
                        //显示倒计时
                        this.beginning =  true

                        //开始倒计时
                        this.timer = setInterval(()=>{
                            let tempTime = this.time;
                            if (tempTime == 0) {
                                //倒计时结束
                                clearInterval(this.timer);
                                this.beginning =  false
                                return;
                            }
                            this.time = tempTime - 1
                        }, 1000);
                    }
                })
            }
        }
    },
    components: {

    }
};

</script>

<style lang="less" scoped>
  @import './WealthPassword.less';
</style>
