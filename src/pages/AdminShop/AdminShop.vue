<template>
<div class="container">
    
    <!-- header -->
    <div class="header">
        <div v-for='(item,index) in navs' >
            <span>{{item.name}}</span>
            <!--  class="{{index == navsIndex ? 'active' : ''}}"  :click="say(index)" -->
            <!-- <img src="../images/baiye/c{{navsIndex == index && navsType == 0 ? '10' : navsIndex == index && navsType == 1 ? '12' : '11'}}@2x.png" /> -->
            <img src="../../assets/baiye/c11@2x.png" />
        </div>
    </div>

    <!-- 内容 -->
    <div class="goods-list-wapper">
        <div class="goods-list-item-wapper">
            <div class="goods-list-item">
                <div class="lside">
                    <img src="../../assets/cp.jpg" />
                </div>
                <div class="rside">
                    <div class="title">商品名称</div>
                    <div class="price"><span>￥</span>88.99</div>
                    <div class="bonus">奖金总额：<span>￥45.88</span></div>
                    <div class="remark">有<span>2895</span>人在卖<view>剩余256件</view></div>
                </div>
            </div>
            <div class="goods-item-controls">
                <div class="btn line">下架</div>
                <div class="btn fill">分享<button open-type="share" ></button></div>
            </div>
        </div>
        <div class="goods-list-item-wapper">
            <div class="goods-list-item">
                <div class="lside">
                    <img src="../../assets/cp.jpg" />
                </div>
                <div class="rside">
                    <div class="title">商品名称</div>
                    <div class="price"><span>￥</span>88.99</div>
                    <div class="bonus">奖金总额：<span>￥45.88</span></div>
                    <div class="remark">有<span>2895</span>人在卖<view>剩余256件</view></div>
                </div>
            </div>
            <div class="goods-item-controls">
                <div class="btn line">下架</div>
                <div class="btn fill">分享<button open-type="share" ></button></div>
            </div>
        </div>
    </div>

    <!-- statistics -->
    <div class="footer">
        <!--  bindtap="handleToggleShowQRCode" data-flag="1" -->
        <div>
            <img src="../../assets/baiye/c24@2x.png" />
            <span>店铺二维码</span>
        </div>
        <!-- bindtap="handleJump" data-url="../adminShopPreview/adminShopPreview?shopid={{fictitiousShopId}}&userid={{userid}}" -->
        <div >
            <img src="../../assets/baiye/c25@2x.png" />
            <span>店铺预览</span>
        </div>
         <!-- bindtap="handleJump" data-url="../adminShelf/adminShelf" -->
        <div>
            <img src="../../assets/baiye/c26@2x.png" />
            <span>添加商品</span>
        </div>
    </div>


   
</div>
</template>

<script>

import { getAdminIndexInfo } from '@/api/index.js';
const wx = require('weixin-js-sdk');

export default {
    name: 'AdminShop',
    data() {
        return {
            navs: [
                { name: '新品上架' },
                { name: '价格排序' },
                { name: '奖金排序' },
            ],
        };
    },
    beforeCreate() {
    },
    mounted() {
        this.getAdminIndexInfo();
    },
    methods:{
        getAdminIndexInfo() {
            getAdminIndexInfo({
                user_id: 112 //this.$store.state.user.userid,
            }).then(res => {
                console.log('虚拟店信息',this.$store.state.user,res)
                if (res.data.code == 1) {
                    this.detail = res.data.data;
                }
            });
        }
    },
    components: {
      
    }
};

</script>

<style lang="less" scoped>
  @import './AdminShop.less';
</style>
