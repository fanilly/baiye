<template>
  <section class="container">
    <header class="address" @click.stop="handleChooseAddress">
      <img class="coordinate" :src="coordinateIcon">
      <div class="content">
        <template v-if="address">
          <h2>{{address.user_name}} <span>{{address.user_phone}}</span></h2>
          <p>{{address.user_address}}</p>
        </template>
        <h2 v-else>请选择地址</h2>
      </div>
      <img class="arrow" :src="arrowIcon" alt="">
    </header>
    <main class="main">
      <div class='tit1'>
        <!-- <image src='../images/banyuan.png'></image> -->
        请仔细确认您的订单
      </div>
      <div class="order bn">
        <!-- <div class="dwt JB">{{goodInfo.cate_name}}</div> -->
        <div class="item">
          <img :src="goodInfo.img" class="pic" />
          <div class="name" v-if="goodInfo.attr=='暂无规格'">{{goodInfo.names}}</div>
          <div class="nameb" v-if="goodInfo.attr!='暂无规格'">
            <span class="tone">{{goodInfo.names}}</span>
            <span class="two">{{goodInfo.attr}}</span>
          </div>
          <div class="num">×{{goodInfo.num}}</div>
          <div class="price">¥
            <span>{{goodInfo.price}}</span>
          </div>
        </div>
      </div>
      <div class='tip'>
        <div class='lhalf'></div>
        <div class='heng'></div>
        <div class='rhalf'></div>
      </div>

      <div class="sum">
        <div class="sl">运费</div>
        <div class="sm"></div>
        <div class="sr yl">¥
            <span>{{orderData ? orderData.shipping_fee : '--'}}</span>
        </div>
      </div>
      <div class="sum">
        <div class="sl">总计</div>
        <div class="sm">共{{goodInfo.num}}个</div>
        <div class="sr yl">¥
            <span>{{orderTotalMoney}}</span>
        </div>
      </div>
      <textarea class="textarea" v-model="remark" placeholder="订单备注"></textarea>
    </main>
    <footer-submit @handleSubmit="makeVirtualOrder" :btn-txt="'提交订单'+orderTotalMoney"></footer-submit>
  </section>
</template>

<script>
  import { getAddress, getWxSettings, getShippingFee, changeAddress, makeVirtualOrder } from '@/api/index.js';
  import { Picker } from 'vux';
  import footerSubmit from '@/components/footerSubmit/footerSubmit.vue';
  import { SET_PAYMENT_OPTIONS } from '@/store/mutation-type.js';
  export default {
    name: 'AdminShopSettlement',
    props:{
      shopid:{
        require: true
      }
    },
    data() {
      return {
        coordinateIcon: require('../../assets/takeout06.png'),
        arrowIcon: require('../../assets/return.png'),
        totalMoney: 0,
        address:null,

        remark:'',
        orderData:null,

        orderTotalMoney:0,
        total_price:0,
        userid:''
      };
    },
    created(){
      this.goodInfo = this.$route.params
      this.userid = this.$route.params.userid
      //console.log(this.goodInfo)
      this.total_price = this.$route.params.price * this.$route.params.num
    },
    watch:{

    },
    methods: {
      handleChooseAddress(){
        if(global.browserIsWeChat){
          this.wx.openAddress({
            success: res => {
              changeAddress({
                user_phone: res.telNumber || '',
                user_name: res.userName || '',
                user_address: res.detailInfo || '',
                user_province: res.provinceName || '',
                user_city: res.cityName || '',
                user_country: res.countryName || '',
                zip_code: res.postalCode || '',
                user_id: this.userid //this.$store.state.user.userid
              }).then(resData=>{
                if(resData.data.code == 1){
                  if(!this.address) this.address = {};
                  this.address.aid = resData.data.data.address_id;
                  this.address.user_name = res.userName;
                  this.address.user_address = res.detailInfo;
                  this.address.user_phone = res.telNumber;
                  this.getShippingFee();
                }else{
                  this.feedback.Toast({
                    msg:resData.data.info,
                    timeout: 1200
                  })
                }
              });
            }
          });
        }else{
          this.$router.push({
            name: 'AddressList'
          })
        }
      },
      makeVirtualOrder(){
        if(!this.address){
          this.feedback.Toast({
            msg: '请选择收货地址',
            timeout: 1000
          });
          return;
        }
        this.feedback.Loading.open('提交中');
        makeVirtualOrder({
          order_no:this.orderData.order_no,
          shop_id:this.goodInfo.shopid,
          goods_id:this.goodInfo.goodid,
          virtual_id:this.goodInfo.virtualshopid,
          shipping_fee:this.orderData.shipping_fee,
          remark: this.remark,
          attr:this.goodInfo.attrid,
          num:this.goodInfo.num,
          user_id: this.$store.state.user.userid,
        }).then(res=>{
          console.log(res);
          this.feedback.Loading.close();
          if(res.data.code == 1){
            this.$store.commit(SET_PAYMENT_OPTIONS, {
              canUse: false,
              orderNo: res.data.data.order_no,
              totalMoney: res.data.data.total_money,
              orderType: 'VO',
              kind: 3,
            })
            this.$router.replace({
              name:'Payment'
            })
          }else{
            this.feedback.Toast({
              msg:res.data.info,
              timeout: 1200,
            })
          }
        })
      },

      //获取运费
      getShippingFee(){
        getShippingFee({
          shop_id:this.goodInfo.shopid,
          address_id:this.address.aid,
          order_no: '',
          order_price:this.total_price,
          type: 2,
          remark:this.remark || '无'
        }).then(res=>{
          if(res.data.code == 1){
            this.orderData = res.data.data;
            this.orderTotalMoney = (this.total_price * 1 + this.orderData.shipping_fee * 1).toFixed(2)

          }else{
            this.feedback.Toast({
              msg:res.data.info,
              timeout: 1200
            });
            setTimeout(()=>{
              this.$router.go(-1);
            }, 1000);
          }
          console.log('运费',res);
        })
      }
    },

    mounted() {
      getAddress({ uid: this.$store.state.user.userid }).then(res=>{
        console.log('获取地址信息')
        if(res.data.code == 1){
          this.address = res.data.data[0];
          console.log(this.address);
          this.getShippingFee();

        }else{
          this.feedback.Toast({
            msg:res.data.info
          });

        }
      });

      getWxSettings().then(res => {
        let data = res.data.data;
        this.wx.config({
          debug: global.isDev,
          appId: data.appid,
          timestamp: data.timestamp,
          nonceStr: data.nonceStr,
          signature: data.signature,
          jsApiList: ['openAddress']
        });
      });
    },
    components:{
      footerSubmit,
      Picker
    }
  };

</script>
<style lang="less" scoped>
  @import './Settlement.less';

</style>
