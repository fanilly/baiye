import { SET_USER_TYPE, SET_USER_INFO } from '../mutation-type.js';
import Alert from '@/components/feedback/src/alert';

export default {
  state: {
    userid: null,
    nickName: '',
    userType: '',
    avatar: '',
    subscribe: true
  },

  getters: {},

  mutations: {
    [SET_USER_TYPE](state, payload) {
      state.userType = payload.userType
    },
    [SET_USER_INFO](state, payload) {
      if (!payload.subscribe && location.pathname != '/Follow') {
        Alert({
          msg: '检测到您未关注公众号，请先关注公众号',
          callback: function() {
            location.assign('/Follow');
          }
        });
      }
      state.userid = payload.userid;
      state.nickName = payload.nickName;
      state.userType = payload.userType;
      state.avatar = payload.avatar;
      state.subscribe = payload.subscribe;
      state.waiter_id = payload.waiter_id,
      state.virtual_id = payload.virtual_id
    }
  },

  actions: {}
}
