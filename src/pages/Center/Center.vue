<template>
    <div class="container">

        <router-link class='user' :to="{name:'UserInfo'}">
            <div class="info">
                <a class="tx"><img :src="uerInfo.avatar" alt=""></a>
                <a class="come"><span class="tit3">{{uerInfo.nickName}}</span></a>
            </div>
        </router-link>

        <div class='comelist'>
            <router-link v-for='item in nav' :key='item.name' class='link'  :to='item.url'>
                <img class='limg' :src='item.src' />
                <div class='all'>
                    <span>{{item.name}}</span>
                    <img src='../../assets/return.png' class='rimg' />
                </div>
            </router-link>
        </div>
        <div class='comelist'>
            <router-link class='link' v-for='item in nav2' :key='item.name' :to='item.url'>
                <img class='limg' :src='item.src' />
                <div class='all'>
                    <span>{{item.name}}</span>
                    <span class='red' v-if='item.words!=""'>{{item.words}}</span>
                    <img src='../../assets/return.png' class='rimg' />
                </div>
            </router-link>
        </div>
        <div class='support' style="position: static">易倍增科技提供技术支持</div>


        <footer-nav active-index="2"></footer-nav>
    </div>
</template>
<script>
import footerNav from '@/components/footerNav/footerNav.vue';

export default {
    name: 'Center',
    data() {
        return {
            nav: [
                { name: '我的订单', url: '/Order', words: '', src: require('../../assets/takeout04.png') },
                { name: '我的收藏', url: '/Collection', words: '', src: require('../../assets/sc.png') },
            ],
            nav2: [
                { name: '地址管理', url: '../address/index', src: require('../../assets/icon04.png') },
                { name: '帮助中心', url: '/Issue/List', words: '', src: require('../../assets/icon05.png') },
            ],
            uerInfo:this.$store.state.user,
        };
    },
    mounted() {
        if(this.uerInfo.userType==2){
            let nav = this.nav;
            nav.push({ name: '我的虚拟店', url: 'AdminIndex', words: '', src: require('../../assets/icon02.png') })
            this.nav = nav
        }
        if(this.uerInfo.userType==1){
            let nav = this.nav;
            nav.push(...[{ name: '我的二维码', url: 'CodeMine', words: '', src: require('../../assets/sc5.png') },
                    { name: '我的拓客码', url: 'CodeExtend', words: '', src: require('../../assets/sc5.png') },
                    { name: '我的收益', url: '/MoneyRest/'+this.$store.state.user.userid, words: '', src: require('../../assets/sc6.png') }]);
            this.nav = nav
        }
    },
    components: {
        footerNav,
    }
};

</script>
<style lang="less" scoped>
  @import './Center.less';
</style>
