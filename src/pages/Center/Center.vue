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
        <div class='comelist' v-if="!browserIsWeChat" @click="loginOut">
            <div class='link'>
                <img class='limg' :src='exitIcon' />
                <div class='all'>
                    <span>退出登录</span>
                    <img src='../../assets/return.png' class='rimg' />
                </div>
            </div>
        </div>
        <div class='support' style="position: static">易倍增科技提供技术支持</div>


        <footer-nav active-index="2"></footer-nav>
    </div>
</template>
<script>
import footerNav from '@/components/footerNav/footerNav.vue';
import { loginOut } from '@/api/index.js';
import { SET_USER_INFO } from '@/store/mutation-type.js';

export default {
    name: 'Center',
    data() {
        return {
            browserIsWeChat:false,
            exitIcon: require('../../assets/exit.png'),
            nav: [
                { name: '虚拟店订单', url: '/FictitiousOrder', words: '', src: require('../../assets/takeout04.png') },
                { name: '我的优惠券', url: '/Coupon/MyCoupon', words: '', src: require('../../assets/icon01.png') },
                { name: '我的关注', url: '/Collection', words: '', src: require('../../assets/sc.png') },
            ],
            nav2: [
                // { name: '地址管理', url: '../address/index', src: require('../../assets/icon04.png') },
                { name: '帮助中心', url: '/Issue/List', words: '', src: require('../../assets/icon05.png') },
            ],
            uerInfo:this.$store.state.user,
        };
    },
    methods:{
      loginOut(){
        this.feedback.Confirm({
          title: '提示',
          msg: '您确定要退出登陆吗？',
          options: [{
            txt: '取消',
            color: '#999'
          }, {
            txt: '确定',
            color: '#0bb20c',
            callback: () => {
              loginOut().then(res=>{
                if(res.data.code == 1){
                  sessionStorage.setItem('USER_TOKEN','');
                  sessionStorage.setItem('USER_INFO','');
                  this.$store.commit(SET_USER_INFO, {
                    userid: '',
                    userType: '',
                    nickName: '',
                    avatar: '',
                    subscribe: '',
                    waiter_id: '',
                    virtual_id: '',
                    pathname: ''
                  });
                  location.href = 'app://baiye/loginout';
                }
              })
            }
          }]
        });
      }
    },
    mounted() {
        this.browserIsWeChat = global.browserIsWeChat;
        console.log(global.browserIsWeChat)
        if(this.uerInfo.userType==2){
            let nav = this.nav;
            nav.push({ name: '我的虚拟店', url: '/AdminIndex', words: '', src: require('../../assets/icon02.png') })
            this.nav = nav
        }
        if(this.uerInfo.userType==1){
            let nav = this.nav;
            nav.push(...[{ name: '我的二维码', url: '/CodeMine', words: '', src: require('../../assets/sc5.png') },
                    { name: '我的拓客码', url: '/CodeExtend', words: '', src: require('../../assets/sc5.png') },
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
