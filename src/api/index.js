/**
 * @Author:      allenAugustine
 * @Email:       iallenaugustine@gmail.com  -  misterji0708@qq.com
 * @DateTime:    2018-05-17 10:58:41
 * @Description: app 请求集合
 */

import HTTPS from './public.js';
console.log(process.env.NODE_ENV);
const HOST = 'http://mall-seo.hohu.cc';

const REQUESTS = {
  //获取首页banner数据
  getIndexBanner() {
    return HTTPS.fetchGet(HOST + '/api/5b46c0219c671', {
      type_id: 2
    })
  },


  // //获取商品列表
  // getGoosList() {
  //   return HTTPS.fetchQuickGet(GET_GOODS_LIST_URL);
  // },
  // //获取优惠券信息
  // getCoupons(options){
  //   return HTTPS.fetchGet(GET_COUPONS_URL,options);
  // },
  // //领取优惠券
  // receiveCoupon(options){
  //   return HTTPS.fetchGet(RECEIVE_COUPON_URL,options);
  // },
  // //图片上传
  // uploadImg(options){
  //   return HTTPS.fetchFilePost(UPLOAD_URL,options);
  // }
};

export const getIndexBanner = REQUESTS.getIndexBanner;
