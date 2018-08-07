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
import './iconfont/iconfont.css';

Vue.use(FeedBack);
Vue.use(lazyLoad, {
  error: require('./assets/loading-error.png')
});

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
