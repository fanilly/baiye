import { SET_USER_TYPE, SET_USER_INFO } from '../mutation-type.js';

export default {
  state: {
    userid: null,
    nickName: '',
    userType: '',
    avatar: ''
  },

  getters: {},

  mutations: {
    [SET_USER_TYPE](state, payload) {
      state.userType = payload.userType
    },
    [SET_USER_INFO](state, payload) {
      state.userid = payload.userid;
      state.nickName = payload.nickName;
      state.userType = payload.userType;
      state.avatar = payload.avatar;
    }
  },

  actions: {}
}
