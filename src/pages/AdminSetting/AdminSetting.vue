<template>
<div class="container">

    <!--pages/shopPwd/shopPwd.wxml-->
    <div class="wapper">

        <div class="input-box-wapper">
            <div class="input-box-type1">
                <div class="lside">店铺名称:</div>
                <input placeholder-style="color:#ccc" type="text" name="shop_name" placeholder="请输入店铺名称" v-model="shop_name" />
            </div>
            <div class="input-box-type1">
                <div class="lside">店主名称:</div>
                <input placeholder-style="color:#ccc" type="text" name="real_name" placeholder="请输入店主姓名" v-model="real_name" />
            </div>
            <div class="input-box-type1">
                <div class="lside">手机号:</div>
                <input placeholder-style="color:#ccc" type='number' maxlength="11" name="phone" placeholder="请输入负责人手机号" v-model="phone" />
            </div>
            <div class="input-box-type1">
                <div class="lside">支付宝号:</div>
                <input placeholder-style="color:#ccc" type="text" maxlength="80" name="alipay_no" placeholder="请输入支付宝账号" v-model="alipay_no" />
            </div>
        </div>
        <div class="img-upload">
            <div class="header">
                <div class="lside">店铺主图</div>
                <div class="center">建议上传750*350</div>
                <!-- <div class="rside" bindtap="handleChooseImage">上传</div> -->
                <div class="rside"><input type="file" class="upload" accept="image/*"  @change="handleChooseImg" >上传</div>
            </div>
            <img class="img" :src="banner" />
            <!--  ? banner : require('../../assets/baiye/c23@2x.png')  -->
            <!-- <img class="img" :src="../../assets/baiye/c23@2x.png"/> -->
        </div>
        <div class="footer">
            <div form-type="submit" class="btn" @click = 'changeShopSetting'>确认</div>
        </div>

    </div>



</div>
</template>

<script>
// 创建本地地址
const getFileUrl = (sourceObj) => { return window.URL.createObjectURL(sourceObj.files.item(0)); };
import axios from 'axios';

import { getShopSetting, changeShopSetting } from '@/api/index.js';
const wx = require('weixin-js-sdk');

export default {
    name: 'AdminSetting',
    data() {
        return {
            shop_name:'',
            real_name:'',
            phone:'',
            alipay_no:'',
            uploadFile:{path:''},
            shopid:'',
            accept: 'image/gif,image/jpeg,image/png,image/jpg',
            banner: '',
            filedata:Object,
            ImdID:'',
        };
    },
    beforeCreate() {
    },
    created(){
        this.shopid = this.$route.params.shopid
    },
    mounted() {
        this.feedback.Loading.open('加载中');
        this.getShopSetting()
    },
    methods:{
        //获取店铺设置的数据
        getShopSetting(){
            getShopSetting({
                shop_id: this.shopid
            }).then(res=>{
                this.feedback.Loading.close();
                console.log('获取店铺数据',res)
                this.shop_name = res.data.data.shop_name ? res.data.data.shop_name : ''
                this.real_name = res.data.data.real_name ? res.data.data.real_name : ''
                this.phone = res.data.data.phone ? res.data.data.phone : ''
                this.alipay_no = res.data.data.alipay_no ? res.data.data.alipay_no : ''
                this.banner = res.data.data.banner ? res.data.data.banner : require('../../assets/baiye/c23@2x.png')
                this.ImdID = res.data.data.banner_id ? res.data.data.banner_id : ''
            })
        },
        //选择图片
        handleChooseImg(e) {
            console.log('------------------')
            console.log(e)
            console.log('------------------')
            let fileType = e.target.files[0].type;
            console.log(this.filedata)
            // 匹配文件类型
            if (this.accept.indexOf(fileType) == -1 || fileType == '') {
                this.feedback.Toast({
                    msg: '请选择正确的文件类型',
                    icon: 'error',
                    timeout: 1500
                 });
                return;
            }
            //this.feedback.Loading.open('上传图片中');
            // 将选择的图片显示到页面中
            let index = e.target.dataset.index * 1;
            this.banner = getFileUrl(e.srcElement)
            this.feedback.Toast({  msg:'上传中',  timeout:1500 });
            //上传图片
            let file = e.target.files[0]
            let param = new FormData()  // 创建form对象
            param.append('file', file, file.name)  // 通过append向form对象添加数据
            //param.append('chunk', '0') // 添加form表单中其他数据
            console.log(param.get('file')) // FormData私有类对象，访问不到，可以通过get判断值是否传进去
            
            let config = {
              headers: {'Content-Type': 'multipart/form-data'}
            }
            axios.post(global.host+'/api/5b0bee5c49e21', param, config)
            .then(response => {
                this.feedback.Loading.close();
                if (response.data.code == 1) {
                    this.feedback.Toast({  msg:'上传成功',  timeout:1500 });
                    this.ImdID = response.data.data.id
                }
                console.log(response.data)
            }).catch(err=>{
              this.feedback.Alert({  msg:JSON.stringify(err)+'::::--------::::'+JSON.stringify(param) });
            })
        },



        //提交
        changeShopSetting(){
            if(this.shop_name==''){ this.feedback.Toast({  msg:'店铺名称不能为空',  timeout:1500 });}
            else if(this.real_name==''){ this.feedback.Toast({  msg:'店主姓名不能为空',  timeout:1500 });}
            else if(this.phone==''){ this.feedback.Toast({  msg:'手机号不能为空',  timeout:1500 });}
            else if(this.phone.length!=11){ this.feedback.Toast({  msg:'手机号长度有误',  timeout:1500 });}
            else if(this.alipay_no==''){ this.feedback.Toast({  msg:'支付宝账号不能为空',  timeout:1500 });}
            else if(this.ImdID==''){ this.feedback.Toast({  msg:'请上传店铺主图',  timeout:1500 });}
            else{
                this.feedback.Loading.open('提交中');
                changeShopSetting({
                    shop_name:this.shop_name,
                    real_name:this.real_name,
                    phone:this.phone,
                    banner:this.ImdID,
                    alipay_no:this.alipay_no,
                    shop_id:this.shopid
                }).then(res=>{
                    console.log('修改店铺信息',res)
                    this.feedback.Loading.close();
                    if(res.data.code==1){
                        this.feedback.Toast({  msg:'修改成功',  timeout:1500 });
                        setTimeout(()=>{
                             this.$router.back(-1)
                        },1500)
                    }
                })
            }

        }



    },
    beforeDestroy(){
        this.feedback.Loading.close();
    },
    components: {

    }
};

</script>

<style lang="less" scoped>
  @import './AdminSetting.less';
</style>
