import Vue from 'vue';
import Router from 'vue-router';
import Index from '@/pages/Index/Index';
import login from '../api/login.js';
import store from '../store/index.js';
import { SET_USER_INFO } from '../store/mutation-type.js';

const Shop = () => import ('@/pages/Shop/Shop');
const Settlement = () => import ('@/pages/Settlement/Settlement');
const Payment = () => import ('@/pages/Payment/Payment');
const Trolley = () => import ('@/pages/Trolley/Trolley');
const Evaluate = () => import ('@/pages/Evaluate/Evaluate');
const Search = () => import ('@/pages/Search/Search');
const SearchResult = () => import ('@/pages/SearchResult/SearchResult');
const Order = () => import ('@/pages/Order/Order');
const OrderDetail = () => import ('@/pages/OrderDetail/OrderDetail');
const Collection = () => import ('@/pages/Collection/Collection');
const Center = () => import ('@/pages/Center/Center');
const IssueIndex = () => import ('@/pages/Issue/Index');
const IssueList = () => import ('@/pages/Issue/Issue');
const IssueDetail = () => import ('@/pages/Issue/Detail');
const CouponIndex = () => import ('@/pages/Issue/Index');
const AdminIndex = () => import ('@/pages/Coupon/Index');
const CouponBuy = () => import ('@/pages/Coupon/Buy');
const CouponList = () => import ('@/pages/Coupon/List');
const MyEvaluate = () => import ('@/pages/MyEvaluate/MyEvaluate');
const AdminShop = () => import ('@/pages/AdminShop/AdminShop');
const AdminShelf = () => import ('@/pages/AdminShelf/AdminShelf');
const ShopOrder = () => import ('@/pages/ShopOrder/ShopOrder');
const ShopCenter = () => import ('@/pages/ShopCenter/ShopCenter');
const Wealth = () => import ('@/pages/Wealth/Wealth');
const CodeMine = () => import ('@/pages/CodeMine/CodeMine');
const CodeExtend = () => import ('@/pages/CodeExtend/CodeExtend');
const MoneyRest = () => import ('@/pages/MoneyRest/MoneyRest');
const MoneyWithdraw = () => import ('@/pages/MoneyWithdraw/MoneyWithdraw');
const MoneyStream = () => import ('@/pages/MoneyStream/MoneyStream');
const UserInfo = () => import ('@/pages/UserInfo/UserInfo');
const UserPhoneSet = () => import ('@/pages/UserPhoneSet/UserPhoneSet');
const AdminShopCard = () => import ('@/pages/AdminShopCard/AdminShopCard');
const AdminCustomer = () => import ('@/pages/AdminCustomer/AdminCustomer');
const AdminSetting = () => import ('@/pages/AdminSetting/AdminSetting');
const WealthStream = () => import ('@/pages/WealthStream/WealthStream');
const WealthPassword = () => import ('@/pages/WealthPassword/WealthPassword');
const WealthDetail = () => import ('@/pages/WealthDetail/WealthDetail');
const WealthWithdraw = () => import ('@/pages/WealthWithdraw/WealthWithdraw');
const AdminShopPreview = () => import ('@/pages/AdminShopPreview/AdminShopPreview');
const AdminShopDetail = () => import ('@/pages/AdminShopDetail/AdminShopDetail');
const AdminShopSettlement = () => import ('@/pages/AdminShopSettlement/AdminShopSettlement');
const MyWallet = () => import ('@/pages/MyWallet/MyWallet');
const MyWalletStream = () => import ('@/pages/MyWalletStream/MyWalletStream');



Vue.use(Router);



const router = new Router({
  mode: 'history',
  // base: '/mallweb/dist',
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index,
      meta: {
        keepAlive: true,
        title: '首页',
        locationAssign: true
      }
    },
    {
      path: '/order',
      name: 'Order',
      component: Order,
      meta: {
        keepAlive: false,
        title: '订单'
      }
    },
    {
      path: '/OrderDetail/:orderNo',
      name: 'OrderDetail',
      component: OrderDetail,
      props: true,
      meta: {
        keepAlive: false,
        title: '订单详情'
      }
    },
    {
      path: '/center',
      name: 'Center',
      component: Center,
      meta: {
        keepAlive: false,
        title: '个人中心'
      }
    },
    {
      path: '/ShopCenter/:shopid',
      name: 'ShopCenter',
      props: true,
      component: ShopCenter,
      meta: {
        keepAlive: false,
        title: '会员中心'
      }
    },
    {
      path: '/shop/:shopid',
      name: 'Shop',
      props: true,
      component: Shop,
      meta: {
        keepAlive: false,
        title:'店铺首页',
        locationAssign: true
      }
    },
    {
      path: '/settlement/:shopid',
      name: 'Settlement',
      props: true,
      component: Settlement,
      meta: {
        keepAlive: false,
        title: '确认订单',
        locationAssign: true
      }
    }, {
      path: '/payment',
      name: 'Payment',
      component: Payment,
      meta: {
        keepAlive: false,
        title:'支付'
      }
    }, {
      path: '/Search',
      name: 'Search',
      component: Search,
      meta: {
        keepAlive: false,
        title:'搜索'
      }
    }, {
      path: '/Collection',
      name: 'Collection',
      component: Collection,
      meta: {
        keepAlive: false,
        title:'我的收藏'
      }
    }, {
      path: '/SearchResult/:word',
      name: 'SearchResult',
      component: SearchResult,
      props:true,
      meta: {
        keepAlive: false,
        title:''
      }
    }, {
      path: '/trolley/:shopid',
      name: 'Trolley',
      props: true,
      component: Trolley,
      mate: {
        keepAlive: false,
        title: '购物车'
      }
    }, {
      path: '/evaluate/:orderNo',
      name: 'Evaluate',
      props: true,
      component: Evaluate,
      mate: {
        keepAlive: false,
        title: '评价'
      }
    }, {
      path: '/Issue',
      name: 'IssueIndex',
      component: IssueIndex,
      mate: {
        keepAlive: false,
        title: '帮助中心'
      },
      children:[{
        path: '/Issue/List',
        name: 'IssueList',
        component: IssueList,
        meta:{
          keepAlive: false,
          title: '帮助中心'
        }
      }, {
        path: '/Issue/List/:id',
        name: 'IssueDetail',
        props: true,
        component: IssueDetail,
        meta:{
          keepAlive: false,
          title: ''
        }
      }]
    }, {
      path: '/Coupon',
      name: 'CouponIndex',
      component: CouponIndex,
      mate: {
        keepAlive: false,
        title: ''
      },
      children:[{
        path: '/Coupon/Buy/:shopid/:waitid',
        name: 'CouponBuy',
        props:true,
        component: CouponBuy,
        meta:{
          keepAlive: false,
          title: '领取优惠券',
          locationAssign: true
        }
      }, {
        path: '/Coupon/List/:shopid',
        name: 'CouponList',
        props: true,
        component: CouponList,
        meta:{
          keepAlive: false,
          title: '我的优惠券'
        }
      }]
    }, {
      path: '/MyEvaluate/:shopid',
      props:true,
      name: 'MyEvaluate',
      component: MyEvaluate,
      mate: {
        keepAlive: false,
        title: '我的评价'
      }
    }, {
      path: '/adminIndex',
      name: 'AdminIndex',
      component: AdminIndex,
      mate: {
        keepAlive: false,
        title: '我的店铺'
      }
    }, {
      path: '/adminShop/:shopid',
      name: 'AdminShop',
      component: AdminShop,
      mate: {
        keepAlive: false,
        title: '我的店铺'
      }
    }, {
      path: '/adminShelf/:shopid',
      name: 'AdminShelf',
      component: AdminShelf,
      mate: {
        keepAlive: false,
        title: '选品上架'
      }
    }, {
      path: '/shopOrder/:shopid',
      name: 'ShopOrder',
      component: ShopOrder,
      mate: {
        keepAlive: false,
        title: '订单管理'
      }
    }, {
      path: '/wealth/:shopid',
      name: 'Wealth',
      component: Wealth,
      mate: {
        keepAlive: false,
        title: '我的财富'
      }
    }, {
      path: '/codeMine',
      name: 'CodeMine',
      component: CodeMine,
      mate: {
        keepAlive: false,
        title: '我的二维码'
      }
    }, {
      path: '/codeExtend',
      name: 'CodeExtend',
      component: CodeExtend,
      mate: {
        keepAlive: false,
        title: '我的拓客码'
      }
    }, {
      path: '/moneyRest/:waitid',
      name: 'MoneyRest',
      component: MoneyRest,
      mate: {
        keepAlive: false,
        title: '我的收益'
      }
    }, {
      path: '/moneyWithdraw/:money',
      name: 'MoneyWithdraw',
      component: MoneyWithdraw,
      mate: {
        keepAlive: false,
        title: '提现'
      }
    }, {
      path: '/moneyStream',
      name: 'MoneyStream',
      component: MoneyStream,
      mate: {
        keepAlive: false,
        title: '交易明细'
      }
    }, {
      path: '/userInfo',
      name: 'UserInfo',
      component: UserInfo,
      mate: {
        keepAlive: false,
        title: '个人资料'
      }
    }, {
      path: '/userPhoneSet',
      name: 'UserPhoneSet',
      component: UserPhoneSet,
      mate: {
        keepAlive: false,
        title: '手机号设置'
      }
    }, {
      path: '/adminShopCard',
      name: 'AdminShopCard',
      component: AdminShopCard,
      mate: {
        keepAlive: false,
        title: '我的名片'
      }
    }, {
      path: '/adminCustomer/:shopid',
      name: 'AdminCustomer',
      component: AdminCustomer,
      mate: {
        keepAlive: false,
        title: '我的客户'
      }
    }, {
      path: '/adminSetting/:shopid',
      name: 'AdminSetting',
      component: AdminSetting,
      mate: {
        keepAlive: false,
        title: '店铺设置'
      }
    }, {
      path: '/wealthStream/:shopid/:money/:cash',
      name: 'WealthStream',
      component: WealthStream,
      mate: {
        keepAlive: false,
        title: '账单明细'
      }
    }, {
      path: '/wealthPassword/:shopid/:haspassword',
      name: 'WealthPassword',
      component: WealthPassword,
      mate: {
        keepAlive: false,
        title: '提现密码设置'
      }
    }, {
      path: '/wealthDetail/:shopid/:index',
      name: 'WealthDetail',
      component: WealthDetail,
      mate: {
        keepAlive: false,
        title: '钱包明细'
      }
    }, {
      path: '/wealthWithdraw/:money/:shopid',
      name: 'WealthWithdraw',
      component: WealthWithdraw,
      mate: {
        keepAlive: false,
        title: '提现'
      }
    }, {
      path: '/adminShopPreview/:shopid',
      name: 'AdminShopPreview',
      component: AdminShopPreview,
      mate: {
        keepAlive: false,
        title: '店铺预览'
      }
    }, {
      path: '/adminShopDetail/:shopid/:goodid',
      name: 'AdminShopDetail',
      component: AdminShopDetail,
      mate: {
        keepAlive: false,
        title: '商品详情'
      }
    }, {
      path: '/adminShopSettlement/:name/:img/:num/:attr/:price/:goodid/:shopid/:virtualshopid/attrid',
      name: 'AdminShopSettlement',
      component: AdminShopSettlement,
      mate: {
        keepAlive: false,
        title: '确认订单'
      }
    }, {
      path: '/myWallet/:storeid',
      name: 'MyWallet',
      component: MyWallet,
      mate: {
        keepAlive: false,
        title: '我的钱包'
      }
    }, {
      path: '/myWalletStream/:storeid',
      name: 'MyWalletStream',
      component: MyWalletStream,
      mate: {
        keepAlive: false,
        title: '钱包明细'
      }
    }
  ]
});

router.beforeEach((to, from, next) => {

  if(to.meta.title) document.title = to.meta.title;
  const userAgent = navigator.userAgent;

  if(to.meta.locationAssign && /iPhone|iPad|iPod/i.test(userAgent) && to.path != location.pathname){
    location.assign(to.fullPath);
    return;
  }

  if (!sessionStorage.getItem('USER_INFO')) {
    if(to.query.user_token){

      login(to.query.user_token).then(res => {
        store.commit(SET_USER_INFO, res);
        location.href = location.origin + location.pathname;
        next();
      });

    }else{
      const isDev = process.env.NODE_ENV === 'development';
      if(isDev){
        login(to.query.user_token).then(res => {
          store.commit(SET_USER_INFO, res);
          next();
        });
      }else{
        location.href = 'https://food.zzebz.com/index/login/login?jump_url=' + to.path.replace(/\//g, '^');
      }
    }
  } else {
    let userInfo = JSON.parse(sessionStorage.getItem('USER_INFO'));
    store.commit(SET_USER_INFO, userInfo);
    next();
  }
});

export default router;
