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


import { getAdminIndexInfo,publicUploadImg } from '@/api/index.js';
const wx = require('weixin-js-sdk');
// 创建本地地址
const getFileUrl = (sourceObj) => { return window.URL.createObjectURL(sourceObj.files.item(0)); };


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
                    this.viewImgs = res.data.data.banner
                }
            });
        },
        //选择图片
        handleChooseImg(e) {
            let fileType = e.target.files[0].type;
            console.log(this.filedata)
            // 文件类型只能为accept中定义的类型
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
            
            this.filedata = e.target.files[0]
            this.publicUploadImg()
        },
        //图片上传
        publicUploadImg(file){
            var that = this
            publicUploadImg({
                name:'name',
                file:file ,
                user_id:this.$store.state.user.userid,
            }).then(res => {
                console.log('上传图片',res)
                if (res.data.code == 1) {
                }
                //this.feedback.Toast({  msg:res.data.info, timeout:1500 });
            })
        },

        
        
    },
    components: {
    }
};


</script>

<style lang="less" scoped>
  @import './AdminShopCard.less';
</style>
