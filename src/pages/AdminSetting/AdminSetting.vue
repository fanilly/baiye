<template>
<div class="container">
    
    <!--pages/shopPwd/shopPwd.wxml-->
    <div class="wapper">
        <form bindsubmit="handleFormSubmit">
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
                    <div class="rside"><input type="file" class="upload" :accept="accept" @change="handleChooseImg" >上传</div>
                </div>
                <img class="img" :src="viewImgs ? viewImgs : require('../../assets/baiye/c23@2x.png') " />
                <!-- <img class="img" :src="../../assets/baiye/c23@2x.png"/> -->
            </div>
            <div class="footer">
                <button form-type="submit" class="btn">确认</button>
            </div>
        </form>
    </div>


   
</div>
</template>

<script>
// 创建本地地址
const getFileUrl = (sourceObj) => { return window.URL.createObjectURL(sourceObj.files.item(0)); };
import axios from 'axios';

import { getShopSetting, } from '@/api/index.js';
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
            viewImgs: '',
            filedata:Object,
        };
    },
    beforeCreate() {
    },
    created(){
        this.shopid = this.$route.params.shopid
    },
    mounted() {
        this.getShopSetting()
    },
    methods:{
        //获取店铺设置的数据
        getShopSetting(){
            getShopSetting({
                shop_id: this.shopid
            }).then(res=>{
                console.log('获取店铺数据',res)
            })
        },
        //选择图片
        handleChooseImg(e) {
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
            //this.feedback.Loading.open('操作中');
            // 将选择的图片显示到页面中
            let index = e.target.dataset.index * 1;
            this.viewImgs = getFileUrl(e.srcElement)
            
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
                if (response.data.code == 1) {
                    console.log(response.data.data.id)
                    // this.changeShopBanner(response.data.data.id)
                }
                console.log(response.data)
            })
        },
    },
    components: {
      
    }
};

</script>

<style lang="less" scoped>
  @import './AdminSetting.less';
</style>
