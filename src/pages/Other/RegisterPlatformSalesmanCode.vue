<template>
<div class="container">

    <div class='mine'>
        <div class='inside' v-if="codedata">
            <img class='tx' :src='codedata.avatar' />
            <div class='word'>
                <div class='tit1'>{{codedata.name}}</div>
                <div class='tit1'>ID：{{codedata.id}}</div>
            </div>
        </div>
    </div>

    <div class='main' v-if="codedata">
        <div class='tit1'>扫码注册</div>
        <div class='tit2'>请使用微信扫码注册店铺</div>
        <div class='pic'>
            <img :src='codedata.qrcode' />
        </div>
    </div>

    <div class='support'>易倍增科技提供技术支持（注：所有解释权归平台所有）</div>

</div>
</template>

<script>

import { getPlatformSalesmanCode } from '@/api/index.js';

export default {
    name: 'RegisterPlatformSalesmanCode',
    data() {
        return {
            host: global.host,
            codedata: null,
        };
    },
    beforeCreate() {
    },
    mounted() {
        console.log(this.host)
        this.getPlatformSalesmanCode()
    },
    methods:{
        getPlatformSalesmanCode(){
            getPlatformSalesmanCode({
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
  .container{ padding:.60rem .70rem; background-color: #1b1b1f; position: fixed; left:0; top: 0; width: 100%; height: 100%;}
  .mine{ text-align: center;
    .inside{ display: inline-block; padding-left: 1.40rem; position: relative;
        .tx{ display: block; width: 1.20rem; height: 1.20rem; overflow: hidden; border-radius: 50%; position: absolute; left: 0; top: 0; }
        .word{ display: flex; text-align: left; min-height: 1.20rem; align-items: center; flex-direction:column;justify-content:center;
            .tit1{ font-size: .34rem;line-height: .50rem; color: #fff;  }
            .tit2{ font-size: .22rem; line-height: .30rem; color: #fff;  }
        }
    }
  }


  .main{ background-color: #fff; border-radius: 0.06rem; padding:.50rem .60rem; text-align: center; margin-top:.60rem;
    .tit1{ font-size:.34rem; color: #333; line-height:.50rem; margin-bottom: .16rem;}
    .tit2{ font-size:.28rem; color: #999; line-height:.40rem;}
    .pic{margin: .50rem auto .30rem auto;
        img{ display: block; width: 4.20rem; height: 4.20rem; margin: 0 auto; border: 0.02rem solid #f2f2f2; }
    }
  }

  .support{ font-size: .16rem; position: fixed; left: 0; bottom: 0; padding: .30rem .20rem; height: 1.00rem; width: 100%; text-align: center; color: #5e5e63; }
</style>
