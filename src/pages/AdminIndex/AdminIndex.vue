<template>
<div class="container">
    
    <!-- header -->
    <div class="header">
        <div class="lside">
            <div class="title text-ellipsis">
                {{detail.shop_name}}
            </div>
            <div class="btn">
                <img src="../../assets/baiye/mp@2x.png" />
            </div>
        </div>
        <div class="rside">
            <img :src="detail.avatar" alt="" />
        </div>
    </div>

    <!-- statistics -->
    <div class="statistics">
        <div class="top">
            <div class="lside">
                <div>累计收入(元)</div>
                <div>{{detail.money}}</div>
            </div>
            <div class="rside">
                <div>今日收益(元)</div>
                <div>{{detail.today_earnings}}</div>
            </div>
        </div>
        <div class="bottom">
            <div class="lside">
                <div class="item">
                    <div>销售金额</div>
                    <div>{{detail.total_money}}</div>
                </div>
                <div class="item">
                    <div>今日销售金额</div>
                    <div>{{detail.today_money}}</div>
                </div>
            </div>
            <div class="rside">
                <div class="item">
                    <div>今日订单</div>
                    <div>{{detail.today_order}}</div>
                </div>
                <div class="item">
                    <div>冻结收益</div>
                    <div>{{detail.free_money}}</div>
                </div>
            </div>
        </div>
    </div>

    <!-- buttons -->
    <div class="btns">
        <!-- :to="{name:AdminShop}"  -->
        <router-link class="item" v-for="item in navLink" :key="item.name" :to='item.src' >
            <img :src="item.icon" />
            <div class="name">{{item.name}}</div>
        </router-link>
    </div>
</div>
</template>

<script>

import { getAdminIndexInfo } from '@/api/index.js';
const wx = require('weixin-js-sdk');

export default {
    name: 'AdminIndex',
    data() {
        return {
            navLink:[
                { name: '我的店铺', icon: require('../../assets/baiye/c1@2x.png'), src: 'AdminShop' },
                { name: '选品上架', icon: require('../../assets/baiye/c2@2x.png'), src: 'AdminShelf' },
                { name: '订单管理', icon: require('../../assets/baiye/c3@2x.png'), src: 'ShopOrder' },
                { name: '我的财富', icon: require('../../assets/baiye/c4@2x.png'), src: 'Wealth' },
                { name: '我的客户', icon: require('../../assets/baiye/c5@2x.png'), src: '../adminCustomer/adminCustomer' },
                { name: '我的名片', icon: require('../../assets/baiye/c7@2x.png'), src: '../../assets/businessCard/businessCard' },
                { name: '店铺设置', icon: require('../../assets/baiye/c9@2x.png'), src: '../adminSettings/adminSettings' },
            ],
            detail:{
                shop_name:'紫燕百味鸡',
                avatar:require('../../assets/head.jpg')
            }
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
                user_id: this.$store.state.user.userid,
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
  @import './AdminIndex.less';
</style>
