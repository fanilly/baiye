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
        keepAlive: false
      }
    },
    {
      path: '/order',
      name: 'Order',
      component: Order,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/center',
      name: 'Center',
      component: Center,
      meta: {
        keepAlive: false
      }
    },
    {
      path: '/shop',
      name: 'Shop',
      component: Shop,
      meta: {
        keepAlive: true
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
    }
  ]
});

router.beforeEach((to, from, next) => {
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
