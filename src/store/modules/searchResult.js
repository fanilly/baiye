import { SET_SEARCH_RESULT } from '../mutation-type.js';

export default {
  state: {
    cateId: null,
    goodsId: null
  },

  getters: {
    getSearchResultData(state){
      if(!state.cateId){
        let payload = JSON.parse(sessionStorage.getItem('SEARCH_RESULT_OPTIONS'));
        if(payload){
          state.cateId = payload.cateId;
          state.goodsId = payload.goodsId;
        }
      }
      return state
    }
  },

  mutations: {
    [SET_SEARCH_RESULT](state, payload) {
      sessionStorage.setItem('SEARCH_RESULT_OPTIONS', JSON.stringify(payload));
      state.cateId = payload.cateId;
      state.goodsId = payload.goodsId;
    }
  },

  actions: {}
}
