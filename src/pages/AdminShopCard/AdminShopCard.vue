<template>
<div class="container">
    

    <div class="container">
        <div class="header">
            <img :src="viewImgs != '' ? viewImgs : '../images/poster.jpg' " />
            <div class="btn"><input type="file" class="upload" :accept="accept" @change="handleChooseImg" >更换</div>
        </div>
        <div class="main">
            <div class="content">
                <div class="title">{{shopInfo.shop_name}}</div>
                <img :src="shopInfo.qrcode" />
                <div class="remark">扫码进店</div>
            </div>
        </div>
    </div>

   
</div>
</template>

<script>


import { getAdminIndexInfo,publicUploadImg,changeShopBanner } from '@/api/index.js';
const wx = require('weixin-js-sdk');
// 创建本地地址
const getFileUrl = (sourceObj) => { return window.URL.createObjectURL(sourceObj.files.item(0)); };
import axios from 'axios';

export default {
    name: 'AdminShopCard',
    data() {
        return {
            shopInfo:{},
            imgs: [],
            imgData: {
                accept: 'image/gif, image/jpeg, image/png, image/jpg',
            },
            accept: 'image/gif,image/jpeg,image/png,image/jpg',
            viewImgs: '',
            filedata:Object,
        };
    },
    beforeCreate() {
    },
    created(){
        
    },
    mounted() {
        this.getAdminIndexInfo();
    },
    methods:{
        getAdminIndexInfo() {
            getAdminIndexInfo({
                user_id: this.$store.state.user.userid,
            }).then(res => {
                //console.log('虚拟店信息',res)
                if (res.data.code == 1) {
                    this.shopInfo = res.data.data;
                    this.viewImgs = res.data.data.background
                }
            });
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
                    this.changeShopBanner(response.data.data.id)
                }
                console.log(response.data)
            })
        },
        //更换店铺背景图
        changeShopBanner(id){
            changeShopBanner({
                shop_id: this.shopInfo.id,
                background: id
            }).then(res=>{
                this.feedback.Toast({  msg:res.data.info,  timeout:1500 });
                this.getAdminIndexInfo();
                console.log('更换门店名片背景图',res)
            })
        }
    },
    components: {
    }
};


</script>

<style lang="less" scoped>
  @import './AdminShopCard.less';
</style>
