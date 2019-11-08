import api from '../../apiSingleton';

const stateObj = {
  loading: false,
  loadingFailed: false,
  creating: false,
  createFailed: false,
  preacher: {},
  preachers: [],
};

export const FETCH_PREACHER_START = 'fetchPreacherStart';
export const FETCH_PREACHER_SUCCESS = 'fetchPreacherSuccess';
export const FETCH_PREACHER_FAIL = 'fetchPreacherFail';

function fetchCurrentPreacher({ commit }, id) {
  commit(FETCH_PREACHER_START);
  return api.preachers.getPreacher(id)
    .then(data => commit(FETCH_PREACHER_SUCCESS, data))
    .catch(() => commit(FETCH_PREACHER_FAIL));
}

export const FETCH_PREACHERS_START = 'fetchPreacherStart';
export const FETCH_PREACHERS_SUCCESS = 'fetchPreachersSuccess';
export const FETCH_PREACHERS_FAIL = 'fetchPreacherFail';

function fetchAllPreachers({ commit }) {
  commit(FETCH_PREACHERS_START);
  return api.preachers.getPreachers()
    .then(data => commit(FETCH_PREACHERS_SUCCESS, data))
    .catch(() => commit(FETCH_PREACHERS_FAIL));
}

export const CREATE_PREACHER_START = 'createPreacherStart';
export const CREATE_PREACHER_SUCCESS = 'createPreacherSuccess';
export const CREATE_PREACHER_FAIL = 'createPreacherFail';

function createPreacher({ commit }, options) {
  commit(CREATE_PREACHER_START);
  return api.preachers.createPreacher(options)
    .then(data => commit(CREATE_PREACHER_SUCCESS, data))
    .catch(() => commit(CREATE_PREACHER_FAIL));
}

const actions = {
  fetchCurrentPreacher,
  fetchAllPreachers,
  createPreacher,
};

const mutations = {
  fetchPreacherStart(state) {
    state.loading = true;
    state.loadingFailed = false;
  },
  fetchPreacherSuccess(state, data) {
    state.preacher = data || {};
    state.loading = false;
  },
  fetchPreachersSuccess(state, data) {
    state.preachers = data || [];
    state.loading = false;
  },
  fetchPreacherFail(state) {
    state.loading = false;
    state.loadingFailed = true;
  },
  createPreacherStart(state) {
    state.creating = true;
    state.createFailed = false;
  },
  createPreacherSuccess(state, data) {
    state.preacher = data || {};
    state.creating = false;
  },
  createPreacherFail(state) {
    state.creating = false;
    state.createFailed = true;
  },
};

export default {
  namespaced: true,
  state: stateObj,
  actions,
  mutations,
};
