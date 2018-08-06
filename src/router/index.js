import Vue from 'vue';
import Router from 'vue-router';
import Welcome from '@/pages/Welcome/Welcome';

const Shop = () => import ('@/pages/Shop/Shop');
const Settlement = () => import ('@/pages/Settlement/Settlement');
const Payment = () => import ('@/pages/Payment/Payment');
const Trolley = () => import ('@/pages/Trolley/Trolley');
const Evaluate = () => import ('@/pages/Evaluate/Evaluate');

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Welcome',
      component: Welcome,
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
