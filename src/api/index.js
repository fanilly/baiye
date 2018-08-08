/**
 * @Author:      allenAugustine
 * @Email:       iallenaugustine@gmail.com  -  misterji0708@qq.com
 * @DateTime:    2018-05-17 10:58:41
 * @Description: app 请求集合
 */

import HTTPS from './public.js';
const isDev = process.env.NODE_ENV === 'development';
const HOST = isDev ? '' : 'https://food.zzebz.com';

const REQUESTS = {
  //获取微信JS-SDK配置信息
  getWxSettings() {
    return HTTPS.fetchPost(HOST + '/api/5b69400bc5674', {
      jump_url: location.href
    })
  },
  //获取首页banner数据
  getIndexBanner() {
    return HTTPS.fetchGet(HOST + '/api/5b46c0219c671', {
      type_id: 2
    })
  },
  //获取附近的店
  getNearStore(data) {
    return HTTPS.fetchGet(HOST + '/api/5b499bc0501bd', data)
  },
  //获取我的店铺
  getMyShop(data) {
    return HTTPS.fetchGet(HOST + '/api/5b6553a099d78', data)
  },
  //获取商品分类
  getGoodsCate(data) {
    return HTTPS.fetchGet(HOST + '/api/5afe9c48af79e', data)
  },
  //获取商品列表
  getGoodsLists(data) {
    return HTTPS.fetchGet(HOST + '/api/5afea7da66ff3', data)
  },
  //获取实体店店铺详情
  getPhysicalShopDetail(data) {
    return HTTPS.fetchGet(HOST + '/api/5a68cfe513df8', data)
  },
  //获取店铺评价列表
  getCommentsListsData(data) {
    return HTTPS.fetchGet(HOST + '/api/5b4d4c317270e', data)
  },
  //获取店铺评价列表
  toggleCollectionStatus(data) {
    return HTTPS.fetchGet(HOST + '/api/5b34830dca2dd', data)
  },

  searchShop(data) {
    return HTTPS.fetchGet(HOST + '/api/5b49ae292625a', data)
  }


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

export const getWxSettings = REQUESTS.getWxSettings;
export const getIndexBanner = REQUESTS.getIndexBanner;
export const getNearStore = REQUESTS.getNearStore;
export const searchShop = REQUESTS.searchShop;
export const getMyShop = REQUESTS.getMyShop;
export const getGoodsCate = REQUESTS.getGoodsCate;
export const getGoodsLists = REQUESTS.getGoodsLists;
export const getPhysicalShopDetail = REQUESTS.getPhysicalShopDetail;
export const getCommentsListsData = REQUESTS.getCommentsListsData;
export const toggleCollectionStatus = REQUESTS.toggleCollectionStatus;
