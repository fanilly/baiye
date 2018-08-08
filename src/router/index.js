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
const Order = () => import ('@/pages/Order/Order');
const Center = () => import ('@/pages/Center/Center');
const AdminIndex = () => import ('@/pages/AdminIndex/AdminIndex');

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
        title: '首页'
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
      path: '/center',
      name: 'Center',
      component: Center,
      meta: {
        keepAlive: false,
        title: '个人中心'
      }
    },
    {
      path: '/shop/:shopid',
      name: 'Shop',
      props: true,
      component: Shop,
      meta: {
        keepAlive: false,
        title:'店铺首页'
      }
    },
    {
      path: '/settlement',
      name: 'Settlement',
      component: Settlement,
      meta: {
        keepAlive: false
      }
    }, {
      path: '/payment',
      name: 'Payment',
      component: Payment,
      meta: {
        keepAlive: false
      }
    }, {
      path: '/trolley',
      name: 'Trolley',
      component: Trolley,
      mate: {
        keepAlive: false
      }
    }, {
      path: '/evaluate',
      name: 'Evaluate',
      component: Evaluate,
      mate: {
        keepAlive: false
      }
    }, {
      path: '/adminIndex',
      name: 'AdminIndex',
      component: AdminIndex,
      mate: {
        keepAlive: false
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  if(to.meta.title) document.title = to.meta.title;

  if (!localStorage.getItem('USER_INFO')) {
    login().then(res => {
      store.commit(SET_USER_INFO, res);
      next();
    });
  } else {
    let userInfo = JSON.parse(localStorage.getItem('USER_INFO'));
    store.commit(SET_USER_INFO, userInfo);
    next();
  }
});

export default router;
