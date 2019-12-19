import Vue from 'vue';
import Vuex from 'vuex';

import api from '../apiSingleton';
import auth from './modules/authorization';
import seminars from './modules/seminars';
import preachers from './modules/preachers';
import lessons from './modules/lessons';
import listeners from './modules/listeners';

import createLogger from '../plugins/logger';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default function (/* { ssrContext } */) {
  const store = new Vuex.Store({
    modules: {
      auth: auth(api),
      seminars: seminars(api),
      preachers: preachers(api),
      lessons: lessons(api),
      listeners: listeners(api),
    },
    strict: debug,
    plugins: debug ? [createLogger()] : [],
  });

  api.apiClient.store = store;

  return store;
}
