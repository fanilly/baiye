import { SET_SEARCH_RESULT } from '../mutation-type.js';

export default {
  state: {
    cateId: null,
    goodsId: null
  },

  getters: {},

  mutations: {
    [SET_SEARCH_RESULT](state, payload) {
      state.cateId = payload.cateId;
      state.goodsId = payload.goodsId;
    }
  },

  actions: {}
}
