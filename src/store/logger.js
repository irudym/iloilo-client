import Vue from 'vue';

const vuexLogger = [];
Vue.prototype.$vuexLogger = vuexLogger;


export const loggerPlugin = (store) => {
  // called when the store is initialized
  store.subscribe((mutation, state) => {
    // called after every mutation.
    // The mutation comes in the format of `{ type, payload }`.
    vuexLogger.push({
      mutation,
      state,
    });
  });
};
