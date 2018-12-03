// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import lazyLoad from 'vue-lazyload';
import FeedBack from './components/feedback/index.js';
import store from './store/index.js';
import ArrayExpand from './utils/Array.expand.js';
ArrayExpand();

import './styles/common.less';
import './styles/animate.less';
import './styles/variable.less';
import './styles/vux-rewrite.less';
import './iconfont/iconfont.css';
global.host = 'http://wgsg.zzebz.com';
global.loginUrl = 'http://wgsg.zzebz.com/index/login/login?jump_url=';
global.loginIn = 'app://baiye/loginin?jump_url=';
global.loginOut = 'app://baiye/loginout';
global.isDev = process.env.NODE_ENV === 'development';
global.logoUrl = 'http://wgsg.zzebz.com/static/index/assets/website_logo.png';
global.websiteName = '维根蔬谷';
global.websiteDesc = '维根蔬谷';
global.browserIsWeChat = navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1;
global.ignoreMap = ['Index','Follow','Search','SearchResult','ShopList','Shop'];

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
