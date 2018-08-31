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
    <main class="main" v-if="orderData">
      <div class='tit1'>
        请仔细确认您的订单
      </div>

      <!-- 活动商品 -->
      <div :class="{order:true, bn:type == 1}">
        <div class="dwt JB">活动商品</div>
        <div class="item">
          <img :src="orderData.goods_pic+'?x-oss-process=image/resize,m_lfit,w_50,limit_0/auto-orient,1/quality,q_90'"
            class="pic" />
          <div class="name">{{orderData.goods_name}}</div>
          <div class="num">×1</div>
          <div class="price">¥
            <span>{{goodsMoney}}</span>
          </div>
        </div>
      </div>
      <!-- 赠品 -->
      <div v-if="type != 1" class="order bn">
        <div class="dwt JB">活动赠品</div>
        <div class="item">
          <img :src="orderData.give_pic+'?x-oss-process=image/resize,m_lfit,w_50,limit_0/auto-orient,1/quality,q_90'"
            class="pic" />
          <div class="name">{{orderData.give_name}}</div>
          <!-- <div class="nameb" v-if="now.attr!=''">
            <span class="tone">{{now.title}}</span>
            <span class="two">{{now.attr}}</span>
          </div> -->
          <div class="num">×1</div>
          <div class="price">¥
            <span>{{orderData.cost_price}}</span>
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
            <span>{{orderData.shipping ? orderData.shipping.shipping : '--'}}</span>
        </div>
      </div>
      <div class="sum">
        <div class="sl">总计</div>
        <div class="sr yl">¥
            <span>{{orderTotalMoney}}</span>
        </div>
      </div>
      <div class="sum">
        <div class="sl">实付</div>
        <div class="sr yl">¥
            <span>{{orderData.act_price}}</span>
        </div>
      </div>
      <textarea class="textarea" v-model="remark" placeholder="点击添加订单备注"></textarea>
    </main>
    <footer-submit @handleSubmit="handleSubmit" btn-txt="提交订单"></footer-submit>
  </section>
</template>
<script>
  import { getActivityOrder, getWxSettings, changeAddress, activityPlaceOrder } from '@/api/index.js';
  import footerSubmit from '@/components/footerSubmit/footerSubmit.vue';
  import { SET_PAYMENT_OPTIONS } from '@/store/mutation-type.js';
  export default {
    name: 'ActivitySettlement',
    props:{
      goodsid:{
        require: true
      },
      activityid: {
        require: true
      },
      type: {
        require: true
      }
    },

    data() {
      return {
        coordinateIcon: require('../../assets/takeout06.png'),
        arrowIcon: require('../../assets/return.png'),
        totalMoney: 0,
        address: null,
        remark:'',
        orderData: null,
      };
    },

    computed:{
      goodsMoney(){
        return this.type != 1 ? this.orderData.act_price : this.orderData.act_price * 1 + this.orderData.cost_price * 1;
      },
      orderTotalMoney(){
        return this.orderData.act_price * 1 + this.orderData.cost_price * 1 + this.orderData.shipping.shipping * 1;
      }
    },

    methods: {
      //选择地址
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
                user_id: this.$store.state.user.userid
              }).then(resData=>{
                if(resData.data.code == 1){
                  if(!this.address) this.address = {};
                  this.address.aid = resData.data.data.address_id;
                  this.address.user_name = res.userName || '';
                  this.address.user_address = res.detailInfo || '';
                  this.address.user_phone = res.telNumber || '';
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

      handleGoPayment() {
        this.$router.push({
          name: 'Payment',
          query: {
            totalMoney: this.totalMoney
          }
        });
      },

      //提交订单
      handleSubmit(){
        if(!this.address){
          this.feedback.Toast({
            msg: '请选择收货地址',
            timeout: 1000
          });
          return;
        }
        this.feedback.Loading.open('提交中');
        activityPlaceOrder({
          num: 1,
          goods_id: this.goodsid,
          shop_id: this.orderData.shop_id,
          activity_id: this.activityid,
          remark: this.remark,
          user_id: this.$store.state.user.userid,
          shipping_fee: this.orderData.shipping.shipping,
          order_no: this.orderData.shipping.order_no
        }).then(res=>{
          console.log(res);
          this.feedback.Loading.close();
          if(res.data.code == 1){
            this.$store.commit(SET_PAYMENT_OPTIONS, {
              canUse: res.data.data.can_use,
              orderNo: res.data.data.order_no,
              totalMoney: res.data.data.total_money,
              orderType: 'OD',
              kind: 2,
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
    },

    mounted() {
      getActivityOrder({
        user_id:this.$store.state.user.userid,
        activity_id: this.activityid,
        goods_id: this.goodsid
      }).then(res=>{
        console.log(res)
        if(res.data.code == 1){
          this.orderData = res.data.data;
          this.address = res.data.data.address && res.data.data.address != [] ? res.data.data.address : null;
        }else{
          this.feedback.Toast({
            msg: res.data.info,
            timeout: 1200
          })
        }
      })

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
      footerSubmit
    }
  };

</script>
<style lang="less"
  scoped>
  @import './ActivitySettlement.less';

</style>
