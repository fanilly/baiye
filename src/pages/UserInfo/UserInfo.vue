<template>
<div class="container">
    
<form bindsubmit="submit">
<div class="ziset">
    <div class="sg">
        <div class='slin'>
            <span class="tl">头像</span>
            <img mode='scaleFix' :src='userInfo.avatar' class='tx' />
        </div>
        <div class='slin'>
            <span class="tl">昵称</span>
            <input type="text" name='name' v-model="userInfo.nickName==''? '暂无' : userInfo.nickName " disabled />
        </div>
    </div>
    <div class='sg'>
        <router-link class='slin' :to="{name:'UserPhoneSet'}">
            <span class="tl">手机号</span>
            <img src='../../assets/return.png' class='imgr'  />
            <span class='rt'>{{uesrdata.mobile}}</span>
        </router-link> 
        <div class='slin'>
            <span class="tl">性别</span>
            <img src='../../assets/return.png' class='imgr' />
            <input class="right" readonly type="text" v-model='sexyValue' placeholder="选择"  @click='openSexyOk = true'>
        </div>
        <div class='slin'>
            <span class="tl">年龄</span>
            <img src='../../assets/return.png' class='imgr' />
            <input class="right" readonly type="text" v-model='ageValue' placeholder="选择" @click='openAgeOk = true'>
        </div>
    </div>
    
    <div class="popBg" v-cloak v-if='openSexyOk' @click='openSexyOk = false'></div>
    <div class="popPicker" v-cloak v-if='openSexyOk'>
        <h2>选择性别 <span  @click='openSexyOk = false'>确定</span></h2>
        <picker :data='sexy' v-model='sexyValue' @on-change='changeSexy'></picker>
    </div>

    <div class="popBg" v-cloak v-if='openAgeOk' @click='openAgeOk = false'></div>
    <div class="popPicker" v-cloak v-if='openAgeOk'>
        <h2>选择性别 <span  @click='openAgeOk = false'>确定</span></h2>
        <picker :data='ageData' v-model='ageValue' @on-change='changeAge'></picker>
    </div>

    <div class='fbottom'> 
        <div class='submit JB' formType="submit" @click='submitUserInfo'>提交</div>
    </div>

</div>
</form>
   
</div>
</template>

<script>
import {  Picker } from 'vux'
import { submitUserInfo, getUserInfo } from '@/api/index.js';
const wx = require('weixin-js-sdk');


export default {
    name: 'UserInfo',
    data() {
        return {
            uesrdata:Object,
            sexy:[[
                { id: 0, name: '男', value:'男' },
                { id: 1, name: '女', value:'女' }
            ]],
            sexyValue:[''],
            sex:'',
            openSexyOk:false,
            ageData: [['5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50']],
            ageValue:[''],
            age:'',
            openAgeOk:false,
            userInfo:this.$store.state.user
        };
    },
    beforeCreate() {

    },
    created(){
        
    },
    mounted() {
        console.log(this.userInfo)
        this.getUserInfo()
    },
    methods:{
        getUserInfo(){
            getUserInfo({
                user_id: this.$store.state.user.userid
            }).then(res => {
                console.log('获取个人资料',res)
                if (res.data.code == 1) {
                    this.uesrdata = res.data.data
                    this.sex = res.data.data.sex
                    if(res.data.data.sex==1) this.sexyValue = ['男']
                    if(res.data.data.sex==2) this.sexyValue = ['女']
                    var age = res.data.data.age
                    this.age = res.data.data.age
                    this.ageValue = [age]
                }
            });
        },
        changeSexy(value){
            this.sexyValue = value
            if(value=='男') this.sex = 1
            else if(value=='女') this.sex = 2
        },
        
        //修改年龄
        changeAge(value){
            this.ageValue = value
            this.age = Number(value)
        },

        //提交个人信息
        submitUserInfo(){
            if(this.sex==''){ this.feedback.Toast({  msg:'性别不能为空',  timeout:1500 });}
            else if(this.age==''){ this.feedback.Toast({  msg:'年龄不能为空',  timeout:1500 });}
            else{
                submitUserInfo({
                    user_id:this.$store.state.user.userid,
                    age:this.age,
                    sex:this.sex
                }).then(res => {
                    console.log('修改个人资料',res)
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
        },
    },
    components: {
        Picker
    }
};

</script>

<style lang="less" scoped>
  @import './UserInfo.less';
</style>
