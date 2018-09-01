import { SET_PAYMENT_OPTIONS } from '../mutation-type.js';
import { liveAppPayment, wechatPayment, getWxSettings, paymentCallback } from '@/api/index.js';
import Toast from '@/components/feedback/src/toast';
import Loading from '@/components/feedback/src/loading';
const wx = require('weixin-js-sdk');

export default {
  state: {
    canUse: null,
    totalMoney: null,
    orderNo: null,
    orderType: null,
    shopid: null,
    kind: null
  },

  getters: {},

  mutations: {
    [SET_PAYMENT_OPTIONS](state, payload) {
      if(payload.shopid) state.shopid = payload.shopid;
      state.canUse = payload.canUse;
      state.totalMoney = payload.totalMoney;
      state.orderNo = payload.orderNo;
      state.orderType = payload.orderType;
      state.kind = payload.kind;
    }
  },

  actions: {

    // 开始支付
    async startPayment({ dispatch, commit, state }, payload) {
      const live_token = sessionStorage.getItem('LIVE_TOKEN');
      //微信支付授权
      getWxSettings().then(res => {
        let data = res.data.data;
        wx.config({
          debug: global.isDev,
          appId: data.appid,
          timestamp: data.timestamp,
          nonceStr: data.nonceStr,
          signature: data.signature,
          jsApiList: ['chooseWXPay']
        });
      });

      if(!live_token){ //在不是直播平台中调起支付
        const paymentResult = await wechatPayment({
          order_no: state.orderNo,
          user_id: payload.userid,
          order_type: state.orderType,
          platform: sessionStorage.getItem('PLATFORM') || '',
          type: 2
        });
        let paymentData = paymentResult.data.data,
          paymentResultCode = paymentResult.data.code;

        // 微信浏览器直接调用支付
        if(paymentResultCode == 1){
          wx.chooseWXPay({
            timestamp: paymentData.timestamp.toString(),
            nonceStr: paymentData.nonceStr,
            package: paymentData.package,
            signType: paymentData.signType,
            paySign: paymentData.paySign,
            success: res=> {
              let msg = state.kind == 1
                ? '付款成功，现在为你跳转会员卡页面'
                : state.kind == 3
                ? '付款成功，现在为你跳转虚拟店页面'
                : '付款成功，现在为你跳转订单页面';

              Toast({ msg });
              dispatch('paymetnSuccess', payload)

            },
            fail:err=>{
              Toast({
                msg:JSON.stringify(err),
                timeout:1500
              })
            }
          });
        }else if(paymentResultCode == 2){
          localStorage.setItem('PAYMENT_CALLBACK', JSON.stringify(state));
          location.href = paymentData.mweb_url;
        }else{
          Toast({msg: paymentResult.info,timeout: 1200})
        }
      }else{ //星说直播中调起支付
        let paymentResult = liveAppPayment({
          order_no: state.orderNo,
          user_id: payload.userid,
          order_type: state.orderType,
          live_token: live_token
        });
        let paymentResultCode = paymentResult.data.code;
        if(paymentResultCode == 1){
          localStorage.setItem('PAYMENT_CALLBACK', JSON.stringify(state));
          location.href = 'app://payorder/' + paymentResult.data.data.order_no;
        }else{
          Toast({
            msg: paymentResult.data.info,
            timeout: 1200
          })
        }
      }
    },

    //支付成功
    paymetnSuccess({ state }, payload){
      switch(state.kind){
        case 1:
          payload.router.replace({
            name:'buyVipCard',
            params: {
              storeid: state.shopid
            }
          });
          break;
        case 2:
          payload.router.replace({
            name:'Order'
          });
          break;
        case 3:
          payload.router.replace({
            name:'FictitiousOrder'
          });
          break;
        default:
          payload.router.push({
            name: 'CouponList',
            params: {
              shopid: state.shopid
            }
          });
          break;
      }
    },

    //APP 与 Browser 中的支付回调
    async testingOrder({ dispatch, commit, state }, payload){
      let paymentCallbackData = localStorage.getItem('PAYMENT_CALLBACK');
      Toast({msg:paymentCallbackData,timeout: 20000});
      if(paymentCallbackData){
        paymentCallbackData = JSON.parse(paymentCallbackData);
        commit(SET_PAYMENT_OPTIONS,paymentCallbackData);
        Loading.open('支付中');
        const res = await paymentCallback({
          order_type: paymentCallbackData.orderType,
          order_no: paymentCallbackData.orderNo,
        });
        Loading.close();
        Toast({ msg: res.data.info });
        if(res.data.code == 1){
          dispatch('paymetnSuccess', payload)
        }
        localStorage.setItem('PAYMENT_CALLBACK','');
      }
    }
  }
}
