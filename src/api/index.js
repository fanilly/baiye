/**
 * @Author:      allenAugustine
 * @Email:       iallenaugustine@gmail.com  -  misterji0708@qq.com
 * @DateTime:    2018-05-17 10:58:41
 * @Description: app 请求集合
 */

import HTTPS from './public.js';
const isDev = process.env.NODE_ENV === 'development';
const HOST = isDev ? '' : 'https://food.zzebz.com';
console.log(typeof HOST);

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
  //获取实体店店铺详情
  getPhysicalGoodsDetail(data) {
    return HTTPS.fetchGet(HOST + '/api/5b4dde8fcdfe6', data)
  },
  //获取店铺评价列表
  getCommentsListsData(data) {
    return HTTPS.fetchGet(HOST + '/api/5b4d4c317270e', data)
  },
  //切换店铺收藏状态
  toggleCollectionStatus(data) {
    return HTTPS.fetchGet(HOST + '/api/5b34830dca2dd', data)
  },
  //添加购物车
  addCart(data) {
    return HTTPS.fetchPost(HOST + '/api/5affdc171ab3f', data)
  },
  //改变购物车商品数量
  changeCartGoodsNum(data) {
    return HTTPS.fetchPost(HOST + '/api/5affe18b2dc6c', data)
  },
  //获取购物车数据列表
  getCartLists(data) {
    return HTTPS.fetchPost(HOST + '/api/5affe7226acfc', data)
  },
  //清空购物车
  clearCartLists(data) {
    return HTTPS.fetchPost(HOST + '/api/5b08c6b37270e', data)
  },
  //获取用户地址
  getAddress(data){
    return HTTPS.fetchGet(HOST + '/api/5b1e2516f0e01', data)
  },
  //获取运费
  getShippingFee(data){
    return HTTPS.fetchPost(HOST + '/api/5b1bb5181e848', data)
  },
  //获取优惠券
  getCoupons(data){
    return HTTPS.fetchGet(HOST + '/api/5b0fa3285cf4e', data)
  },
  //获取赠品券
  getGife(data){
    return HTTPS.fetchGet(HOST + '/api/5b5a740529f63', data)
  },
  //改变收货地址
  changeAddress(data){
    return HTTPS.fetchPost(HOST + '/api/5b6cef0396c13', data)
  },
  //提交订单
  submitOrder(data){
    return HTTPS.fetchPost(HOST + '/api/5b022d3de59d4', data)
  },
  //余额支付
  balancePayment(data){
    return HTTPS.fetchPost(HOST + '/api/5b235e58ddcd4', data)
  },
  //微信支付
  wechatPayment(data){
    return HTTPS.fetchPost(HOST + '/api/5b06dcf02625a', data)
  },
  //获取热搜关键词
  getHotSearchKeyword(){
    return HTTPS.fetchQuickGet(HOST + '/api/5b5542e64c4b4')
  },
  //获取热搜关键词
  getSearchResult(data){
    return HTTPS.fetchGet(HOST + '/api/5b49ae292625a', data)
  },
  //获取实体店订单列表
  getPhysicalOrderLists(data) {
    return HTTPS.fetchGet(HOST + '/api/5b35f142f0537', data)
  },
  //取消或删除掉订单
  cancelOrDelOrder(data) {
    return HTTPS.fetchPost(HOST + '/api/5b35f8754c4b4', data)
  },
  //获取评价标签
  getEvaluateTags(data) {
    return HTTPS.fetchGet(HOST + '/api/5b0926575f5e1', data)
  },
  //提价评价
  submitEvaluate(data) {
    return HTTPS.fetchPost(HOST + '/api/5b092c2a03d09', data)
  },
  //获取实体店订单详情
  getPhysicalOrderDetail(data) {
    return HTTPS.fetchGet(HOST + '/api/5b0691771ab3f', data)
  },

  searchShop(data) {
    return HTTPS.fetchGet(HOST + '/api/5b49ae292625a', data)
  },

  //获取虚拟店店主信息
  getAdminIndexInfo(data) {
    return HTTPS.fetchPost(HOST + '/api/5b4dbbe85f5e1', data)
  },
  //获取我的二维码
  getCodeMIne(data) {
    return HTTPS.fetchGet(HOST + '/api/5b4094006ea05', data)
  },
  //获取我的拓客码
  getCodeExtend(data){
    return HTTPS.fetchGet(HOST + '/api/5b4d999e1312d', data)
  },
  //获取 我的收益--服务员资金
  getMoneyRest(data){
    return HTTPS.fetchGet(HOST + '/api/5b4073a9e4e1c', data)
  },
  //获取 个人中心 优惠券数量 我的余额 我的评价数量
  getMoneyRestAll(data){
    return HTTPS.fetchPost(HOST + '/api/5b0fb5835553c', data)
  },
  //服务员提现
  getMoneyWithdraw(data){
    return HTTPS.fetchGet(HOST + '/api/5b4081b5ca2dd', data)
  },
  //获取交易明细
  getMoneyStraeam(data){
    return HTTPS.fetchGet(HOST + '/api/5b40733ce4e1c', data)
  },
  //修改个人中心资料
  submitUserInfo(data){
    return HTTPS.fetchPost(HOST + '/api/5b0ccdfe49e21', data)
  },
  //获取个人中心资料
  getUserInfo(data){
    return HTTPS.fetchGet(HOST + '/api/5b0bf1e0dea80', data)
  },

  //获取虚拟店
  getShopList(data){
    return HTTPS.fetchGet(HOST + '/api/5b4db309b34a7', data)
  },
  //获取虚拟店 下架
  delFromShop(data){
    return HTTPS.fetchPost(HOST + '/api/5b4db546d9701', data)
  },
  //选品上架 列表
  getAllShopList(data){
    return HTTPS.fetchGet(HOST + '/api/5b4da16cd9701', data)
  },
  //选品上架 上架
  addFromShop(data){
    return HTTPS.fetchPost(HOST + '/api/5b4db546d9701', data)
  },
  //发送验证码 --普通用户
  sendPhoneCode(data){
    return HTTPS.fetchPost(HOST + '/api/5a60ee2bb46ba', data)
  },
  //修改手机号
  changePhone(data){
    return HTTPS.fetchPost(HOST + '/api/5b0bfdd5831a8', data)
  },
  //上传文件方法 --暂时不用
  publicUploadImg(data){
    return HTTPS.fetchFilePost(HOST + '/api/5b0bee5c49e21', data)
  },
  //修改虚拟店信息 post
  changeShopBanner(data){
    return HTTPS.fetchPost(HOST + '/api/5b50042a81b32', data)
  },
  //获取我的客户
  getShopCustomer(data){
    return HTTPS.fetchGet(HOST + '/api/5b4f19a6d9701', data)
  },
  //获取我的财富
  getShopWealth(data){
    return HTTPS.fetchPost(HOST + '/api/5b4f11151312d', data)
  },
  //获取虚拟店我的财富明细 
  getWealthStream(data){
    return HTTPS.fetchGet(HOST + '/api/5b4f0e0acdfe6', data)
  },
  //修改提现密码,查看是否设置手机号
  checkShopSetting(data){
    return HTTPS.fetchPost(HOST + '/api/5b4eed0b81b32', data)
  },
  //提交密码修改
  submitPasswordChange(data){
    return HTTPS.fetchPost(HOST + '/api/5b4ee53fc65d4', data)
  },
  //提交密码设置
  submitPasswordSet(data){
    return HTTPS.fetchPost(HOST + '/api/5b4ee593dd40a', data)
  },
  //获取商户验证码 5b19fb9e7a120 post
  sendAdminCode(data){
    return HTTPS.fetchPost(HOST + '/api/5b19fb9e7a120', data)
  },
  //获取钱包明细 5b4f11bfc65d4 get
  getWealthDetail(data){
    return HTTPS.fetchGet(HOST + '/api/5b4f11bfc65d4', data)
  },
  //获取虚拟店订单列表 5b4ef4e2c65d4
  getShopOrder(data){
    return HTTPS.fetchGet(HOST + '/api/5b4ef4e2c65d4', data)
  }

  // //获取商品列表
  // getGoosList() {
  //   return HTTPS.fetchQuickGet(GET_GOODS_LIST_URL);
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
export const getPhysicalOrderLists = REQUESTS.getPhysicalOrderLists;
export const getCommentsListsData = REQUESTS.getCommentsListsData;
export const toggleCollectionStatus = REQUESTS.toggleCollectionStatus;
export const addCart = REQUESTS.addCart;
export const changeCartGoodsNum = REQUESTS.changeCartGoodsNum;
export const getCartLists = REQUESTS.getCartLists;
export const getPhysicalGoodsDetail = REQUESTS.getPhysicalGoodsDetail;
export const clearCartLists = REQUESTS.clearCartLists;
export const getAddress = REQUESTS.getAddress;
export const getShippingFee = REQUESTS.getShippingFee;
export const getCoupons = REQUESTS.getCoupons;
export const getGife = REQUESTS.getGife;
export const changeAddress = REQUESTS.changeAddress;
export const submitOrder = REQUESTS.submitOrder;
export const balancePayment = REQUESTS.balancePayment;
export const wechatPayment = REQUESTS.wechatPayment;
export const getHotSearchKeyword = REQUESTS.getHotSearchKeyword;
export const getSearchResult = REQUESTS.getSearchResult;
export const cancelOrDelOrder = REQUESTS.cancelOrDelOrder;
export const getEvaluateTags = REQUESTS.getEvaluateTags;
export const submitEvaluate = REQUESTS.submitEvaluate;
export const getPhysicalOrderDetail = REQUESTS.getPhysicalOrderDetail;


export const getShopList = REQUESTS.getShopList
export const delFromShop = REQUESTS.delFromShop
export const getAllShopList = REQUESTS.getAllShopList
export const addFromShop = REQUESTS.addFromShop
export const sendPhoneCode = REQUESTS.sendPhoneCode
export const changePhone = REQUESTS.changePhone
export const publicUploadImg = REQUESTS.publicUploadImg
export const changeShopBanner = REQUESTS.changeShopBanner


export const getAdminIndexInfo = REQUESTS.getAdminIndexInfo
export const getCodeMIne = REQUESTS.getCodeMIne
export const getCodeExtend = REQUESTS.getCodeExtend
export const getMoneyRest = REQUESTS.getMoneyRest
export const getMoneyRestAll = REQUESTS.getMoneyRestAll
export const getMoneyWithdraw = REQUESTS.getMoneyWithdraw
export const getMoneyStraeam = REQUESTS.getMoneyStraeam
export const submitUserInfo = REQUESTS.submitUserInfo
export const getUserInfo = REQUESTS.getUserInfo
export const getShopCustomer = REQUESTS.getShopCustomer
export const getShopWealth = REQUESTS.getShopWealth
export const getWealthStream = REQUESTS.getWealthStream
export const checkShopSetting = REQUESTS.checkShopSetting
export const submitPasswordChange = REQUESTS.submitPasswordChange
export const submitPasswordSet = REQUESTS.submitPasswordSet
export const sendAdminCode = REQUESTS.sendAdminCode
export const getWealthDetail = REQUESTS.getWealthDetail
export const getShopOrder = REQUESTS.getShopOrder




