import { SET_PAYMENT_OPTIONS } from '../mutation-type.js';

export default {
  state: {
    canUse: null,
    totalMoney: null,
    orderNo: null,
    orderType:null,
    kind:null
  },

  getters: {},

  mutations: {
    [SET_PAYMENT_OPTIONS](state, payload) {
      state.canUse = payload.canUse;
      state.totalMoney = payload.totalMoney;
      state.orderNo = payload.orderNo;
      state.orderType = payload.orderType;
      state.kind = payload.kind;
    }
  },

  actions: {}
}