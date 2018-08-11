import { SET_COORDINATE } from '../mutation-type.js';

export default {
  state: {
    latitude: 34.79977,
    longitude: 113.66072
  },

  getters: {},

  mutations: {
    [SET_COORDINATE](state, payload) {
      state.latitude = payload.latitude;
      state.longitude = payload.longitude;
    }
  },

  actions: {}
}
