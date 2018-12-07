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
    <main class="main" v-if="carlist && carlist.data.length>0">
      <div class='tit1'>
        <!-- <image src='../images/banyuan.png'></image> -->
        请仔细确认您的订单
      </div>
      <div v-for="(item,index) in carlist.data" :key="index"  :class="{order:true,bn:index==(carlist.data.length-1)}">
        <div class="dwt JB">{{item.cate_name}}</div>
        <div class="item" v-for="(now,nowdex) in item.goods" :key="nowdex">
          <img :src="now.img_url+'?x-oss-process=image/resize,m_lfit,w_50,limit_0/auto-orient,1/quality,q_90'"
            class="pic" />
          <div class="name" v-if="now.attr==''">{{now.title}}</div>
          <div class="nameb" v-if="now.attr!=''">
            <span class="tone">{{now.title}}</span>
            <span class="two">{{now.attr}}</span>
          </div>
          <div class="num">×{{now.number}}</div>
          <div class="price">¥
            <span>{{now.price}}</span>
          </div>
        </div>
      </div>
      <div class='tip'>
        <div class='lhalf'></div>
        <div class='heng'></div>
        <div class='rhalf'></div>
      </div>

      <!-- 优惠券 -->
      <div class="select-box" @click.stop="showSelectCoupon = true">
        <div class="lside">优惠券</div>
        <div :class="{center:true,'red-color':coupons.length!=0&&!selectedCoupon[0]}">{{coupons.length == 0 ? '无优惠券可用' : selectedCoupon[0] ? selectedCoupon[0] : '有'+(coupons.length-1)+'张优惠券可用'}}</div>
        <img :src="arrowIcon" alt="">
      </div>

      <transition name="fade">
        <div class="picker-wapper" v-if="showSelectCoupon && coupons.length >= 1">
          <div class="mask" @click="showSelectCoupon = false"></div>
          <div class="picker-box">
            <div class="picker-header">
              <span @click="showSelectCoupon = false">确定</span>
            </div>
            <picker class="picker" :data="coupons" :columns="3" v-model="selectedCoupon" @on-change="selectCouponChange"></picker>
          </div>
        </div>
      </transition>

      <!-- 赠品券 -->
      <div class="select-box" v-if="gifes.length >= 1" @click.stop="showSelectGife = true">
        <div class="lside">赠品券</div>
        <div :class="{center:true,'red-color':gifes.length!=0&&!selectedGife[0]}">{{gifes.length == 0 ? '无赠品券可用' : selectedGife[0] ? selectedGife[0] : '有'+(gifes.length-1)+'张赠品券可用'}}</div>
        <img :src="arrowIcon" alt="">
      </div>

      <transition name="fade">
        <div class="picker-wapper" v-if="showSelectGife && gifes.length >= 1">
          <div class="mask" @click="showSelectGife = false"></div>
          <div class="picker-box">
            <div class="picker-header">
              <span @click="showSelectGife = false">确定</span>
            </div>
            <picker class="picker" :data="gifes" :columns="3" v-model="selectedGife" @on-change="selectGifeChange"></picker>
          </div>
        </div>
      </transition>

      <!-- 快递 -->
      <div class="select-box" v-if="express.length >= 1" @click.stop="showSelectExpress = true">
        <div class="lside">选择快递</div>
        <div class="center">{{selectedExpress[0]}}</div>
        <img :src="arrowIcon" alt="">
      </div>

      <transition name="fade">
        <div class="picker-wapper" v-if="showSelectExpress && express.length >= 1">
          <div class="mask" @click="showSelectExpress = false"></div>
          <div class="picker-box">
            <div class="picker-header">
              <span @click="showSelectExpress = false">确定</span>
            </div>
            <picker class="picker" :data="express" :columns="3" v-model="selectedExpress" @on-change="selectExpressChange"></picker>
          </div>
        </div>
      </transition>

      <div class="sum">
        <div class="sl">运费</div>
        <div class="sm"></div>
        <div class="sr yl">¥
            <span>{{orderData ? orderData.shipping_fee : '--'}}</span>
        </div>
      </div>
      <div class="sum">
        <div class="sl">总计</div>
        <div class="sm">共{{carlist.total_num}}个</div>
        <div class="sr yl">¥
            <span>{{orderTotalMoney}}</span>
        </div>
      </div>
      <textarea class="textarea" v-model="remark" placeholder="点击添加订单备注"></textarea>
    </main>
    <footer-submit @handleSubmit="handleSubmit" :btn-txt="'提交订单'+orderTotalMoney"></footer-submit>
  </section>
</template>
<script>
  import { getCartLists, getAddress, getWxSettings, getShippingFeeNew, getCoupons, changeAddress, getGife, submitOrder } from '@/api/index.js';
  import { Picker } from 'vux';
  import footerSubmit from '@/components/footerSubmit/footerSubmit.vue';
  import { SET_PAYMENT_OPTIONS, SET_ISWAIMAI } from '@/store/mutation-type.js';
  export default {
    name: 'Settlement',
    props:{
      shopid:{
        require: true
      },
      is_waimai: {

      }
    },
    data() {
      return {
        coordinateIcon: require('../../assets/takeout06.png'),
        arrowIcon: require('../../assets/return.png'),
        totalMoney: 0,
        carlist: null,
        address:null,

        remark:'',
        orderData:null,
        totalWeight: 0,

        //优惠券
        actuallyMoney:'',
        selectedCouponType:'',
        showSelectCoupon:false,
        selectedCouponId:0,
        selectedCoupon:[],
        coupons: [],

        //抵用券
        showSelectGife:false,
        selectedGifeId:0,
        selectedGife:[],
        gifes: [],

        //快递
        showSelectExpress:false,
        selectedExpressId:0,
        selectedExpress:[],
        express: [],
      };
    },
    computed:{
      orderTotalMoney(){
        if(!this.carlist) return '';
        if(!this.orderData) return '';
        console.log(this.actuallyMoney);
        return this.actuallyMoney ? ((this.actuallyMoney * 1 + this.orderData.shipping_fee * 1).toFixed(2)) : ((this.carlist.total_price * 1 + this.orderData.shipping_fee * 1).toFixed(2));
      }
    },
    watch:{
      // actuallyMoney(){
      //   let at = this.actuallyMoney ? ((this.actuallyMoney * 1 + this.orderData.shipping_fee * 1).toFixed(2)) : ((this.carlist.total_price * 1 + this.orderData.shipping_fee * 1).toFixed(2));
      //   console.log(at);
      // }
    },
    methods: {
      selectCouponChange(current){
        let selectItem = this.coupons.filter(item=>item.name == current[0]);
        this.selectedCouponId = selectItem[0].id;
        this.selectedCouponType = selectItem[0].type;
        this.actuallyMoney = selectItem[0].actually_money ? selectItem[0].actually_money : '';
      },
      selectGifeChange(current){
        let selectItem = this.gifes.filter(item=>item.name == current[0]);
        this.selectedGifeId = selectItem[0].id;
      },
      selectExpressChange(current){
        let selectItem = this.express.filter(item=>item.name == current[0]);
        this.orderData.shipping_fee = selectItem[0].price * 1;
        this.selectedExpressId = selectItem[0].id;
      },
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
                  this.getShippingFeeNew();
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

      //提交订单
      handleSubmit(){
        if(!this.address){
          this.feedback.Toast({
            msg: '请选择收货地址',
            timeout: 1000
          });
          return;
        }
        if(!this.orderData) return;
        this.feedback.Loading.open('提交中');
        let goods = [];
        this.carlist.data.forEach(item=>{
          goods.push(...item.goods.map(sub=>({id:sub.id,num:sub.number,attr:sub.attr_id})))
        });
        submitOrder({
          goods,
          shop_id: this.shopid,
          member:1,
          remark:this.remark,
          user_id:this.$store.state.user.userid,
          coupon_id: this.selectedCouponId,
          coupon_type: this.selectedCouponType,
          is_waimai: 1,
          express_id: this.selectedExpressId,
          shipping_fee:this.orderData.shipping_fee,
          order_no:this.orderData.order_no,
          gift_id:this.selectedGifeId
        }).then(res=>{
          console.log(res);
          this.feedback.Loading.close();
          if(res.data.code == 1){
            this.$store.commit(SET_ISWAIMAI,{
              is_waimai: 1
            });
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

      //获取购物车数据
      getCartLists() {
        getCartLists({
          is_waimai: this.$store.state.user.is_waimai,
          shop_id: this.shopid,
          user_id: this.$store.state.user.userid
        }).then(res => {
          if (res.data.code == 1) {
            this.carlist = res.data.data;
            console.log('购物车数据',res)
            this.totalWeight = res.data.data.total_weight;
            if(this.address) this.getShippingFeeNew();
            this.getCoupons();
            this.getGife();
            console.log(this.carlist);
          }
        })
      },

      //获取优惠券
      getCoupons(){
        getCoupons({
          shop_id:this.shopid,
          user_id:this.$store.state.user.userid,
          total_price:this.carlist.total_price,
          discounts_price:this.carlist.discounts_price
        }).then(res=>{
          if(res.data.code == 1 && res.data.data.length!=0){
            this.coupons = res.data.data.map(item=>({
              id:item.aid,
              name:item.name,
              value:item.name,
              type: item.type,
              actually_money:item.actually_money
            }));
            this.coupons.unshift({
              id:0,
              name:'不使用优惠券',
              value:'不使用优惠券',
              type:''
            })
          }
          console.log('优惠券',res)
        })
      },

      //获取赠品券
      getGife(){
        getGife({
          shop_id:this.shopid,
          user_id:this.$store.state.user.userid
        }).then(res=>{
          if(res.data.code == 1 && res.data.data.length!=0){
            this.gifes = res.data.data.map(item=>({
              id:item.aid,
              name:item.name,
              value:item.name,
            }));
            this.gifes.unshift({
              id:0,
              name:'不使用赠品券',
              value:'不使用赠品券',
            })
          }
          console.log('赠品券',res)
        })
      },

      //获取运费
      getShippingFeeNew(){
        getShippingFeeNew({
          is_waimai: this.$store.state.user.is_waimai,
          user_id:this.$store.state.user.userid,
          shop_id:this.shopid,
          address_id:this.address.aid,
          weight: this.totalWeight,
          order_no: '',
          order_price:this.carlist.total_price,
          remark:this.remark || '无'
        }).then(res=>{
          if(res.data.code == 1){
            this.orderData = {
              shipping_fee: res.data.data.express[0].price * 1,
              order_no: res.data.data.order_no
            };
            this.express = [];
            this.express.push(...res.data.data.express.map(item=>({
              id: item.express_id,
              name: item.express,
              price: item.price,
              value: item.express,
            })))
            // this.express = ;
            console.log('--------------===============',this.express)
            this.selectedExpressId = res.data.data.express[0].express_id;
            this.selectedExpress[0] = res.data.data.express[0].express;
          }else{
            this.feedback.Toast({
              msg:res.data.info,
              timeout: 1200
            });
            // setTimeout(()=>{
            //   this.$router.go(-1);
            // }, 1000);
          }
          console.log('运费',res);
        })
      }
    },

    mounted() {
      if(this.is_waimai){
        this.$store.commit(SET_ISWAIMAI,{
          is_waimai: this.is_waimai
        });
      }
      this.getCartLists();
      getAddress({ uid: this.$store.state.user.userid }).then(res=>{
        if(res.data.code == 1){
          this.address = res.data.data[0];
          console.log(this.address);
          if(this.carlist) this.getShippingFeeNew();
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
