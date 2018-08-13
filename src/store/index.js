import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user.js'
import payment from './modules/payment.js'
import coordinate from './modules/coordinate.js'
import searchResult from './modules/searchResult.js'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    payment,
    coordinate,
    searchResult
  }
});
