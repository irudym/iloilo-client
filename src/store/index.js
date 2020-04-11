import Vue from 'vue';
import Vuex from 'vuex';
import * as Cookies from 'js-cookie';
import * as types from './types';

// configure cookies
const COOKIE_EMAIL = 'iloilo-user-email';
const COOKIE_AUTH_TOKEN = 'iolio-user-auth_token';
const COOKIE_USER_ID = 'iloilo-user-user-id';

Vue.use(Vuex);

const initialState = {
  user: {
    email: Cookies.get(COOKIE_EMAIL),
    auth_token: Cookies.get(COOKIE_AUTH_TOKEN),
    id: Cookies.get(COOKIE_USER_ID),
  },
  timeIntervalId: null,
};

export default new Vuex.Store({
  state: {
    ...initialState,
  },
  mutations: {
    [types.LOGIN_USER](state, payload) {
      state.user = { ...payload.user };

      // put data to cookies
      Cookies.set(COOKIE_AUTH_TOKEN, state.user.auth_token);
      Cookies.set(COOKIE_EMAIL, state.user.email);
      Cookies.set(COOKIE_USER_ID, state.user.id);
    },
    [types.LOGOUT_USER](state) {
      state.user = {
        email: null,
        auth_token: null,
        id: null,
      };
    },
    [types.SET_TIME_INTERVAL](state, payload) {
      state.timeIntervalId = payload.id;
    },
  },
  actions: {
    loginUser(context, user) {
      context.commit(types.LOGIN_USER, { user });
    },
    logoutUser(context) {
      context.commit(types.LOGOUT_USER);
    },
    setTimeInterval(context, id) {
      context.commit(types.SET_TIME_INTERVAL, { id });
    },
  },
  getters: {
    isLogged: (state) => state.user.email && state.user.auth_token,
    getToken: (state) => state.user.auth_token,
    getUserId: (state) => state.user.id,
    getTimeInterval: (state) => state.timeIntervalId,
  },
  modules: {
  },
});
