// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import lazyLoad from 'vue-lazyload';
import FeedBack from './components/feedback/index.js';
import store from './store/index.js';

import './styles/common.less';
import './styles/animate.less';
import './styles/variable.less';
import './styles/vux-rewrite.less';
import './iconfont/iconfont.css';
global.host = 'https://food.zzebz.com';
global.isDev = process.env.NODE_ENV === 'development';
global.logoUrl = 'https://food.zzebz.com/static/index/assets/website_logo.png';
global.websiteName = '又来客了';
global.websiteDesc = '缺客就用又来客了';

Vue.use(FeedBack);
Vue.use(lazyLoad, {
  error: require('./assets/loading-error.png')
});

Vue.prototype.wx = require('weixin-js-sdk');
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
