import Vue from 'vue';
import Vuex from 'vuex';

import seminars from './modules/seminars';
import preachers from './modules/preachers';
import lessons from './modules/lessons';
import listeners from './modules/listeners';

import createLogger from '../plugins/logger';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default function (/* { ssrContext } */) {
  return new Vuex.Store({
    modules: {
      seminars,
      preachers,
      lessons,
      listeners,
    },
    strict: debug,
    plugins: debug ? [createLogger()] : [],
  });
}
