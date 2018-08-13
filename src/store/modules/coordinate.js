import { SET_COORDINATE } from '../mutation-type.js';
import getCoordinate from '@/api/getCoordinate.js';

export default {
  state: {
    latitude: null,
    longitude: null
  },

  getters: {},

  mutations: {
    [SET_COORDINATE](state, payload) {
      state.latitude = payload.latitude;
      state.longitude = payload.longitude;
    }
  },

  actions: {
    async getCoordinate({ commit }) {
      const coordinate = await getCoordinate();
      commit(SET_COORDINATE, {
        latitude: coordinate.latitude,
        longitude: coordinate.longitude
      });
    }
  }
}
