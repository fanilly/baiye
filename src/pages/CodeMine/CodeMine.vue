<template>
<div class="container">
    
    <div class='mine'>
        <div class='inside'>
            <img class='tx' :src='codedata.shop_avatar' />
            <div class='word'>
                <div class='tit1'>{{codedata.shop_name}}</div>
                <!-- <div class='tit1'>ID：896565</div> -->
            </div>
        </div>
    </div>

    <div class='main'>
        <div class='tit1'>{{codedata.waiter_name}}</div>
        <div class='tit2'>扫我领取店铺优惠券</div>
        <div class='pic'>
            <img :src='host+codedata.qrcode' />
        </div>
    </div>

    <div class='support'>易倍增科技提供技术支持（注：所有解释权归平台所有）</div>
   
</div>
</template>

<script>

import { getCodeMIne } from '@/api/index.js';
const wx = require('weixin-js-sdk');

export default {
    name: 'CodeMine',
    data() {
        return {
            host:global.host,
            codedata:Object,
        };
    },
    beforeCreate() {
    },
    mounted() {
        console.log(this.host)
        this.getCodeMIne()
    },
    methods:{
        getCodeMIne(){
            getCodeMIne({
                user_id: this.$store.state.user.userid,
                type:2
            }).then(res => {
                console.log('我的二维码',this.$store.state.user,res)
                if (res.data.code == 1) {
                    this.codedata = res.data.data;
                }
            });
        }  
    },
    components: {
      
    }
};

</script>

<style lang="less" scoped>
  @import './CodeMine.less';
</style>
