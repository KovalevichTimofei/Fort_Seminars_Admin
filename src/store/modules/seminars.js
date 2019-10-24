import api from '../../apiSingleton';

const stateObj = {
  loading: false,
  loadingFailed: false,
  seminars: [],
  seminar: {},
};

export const FETCH_SEMINAR_START = 'fetchSeminarStart';
export const FETCH_SEMINAR_SUCCESS = 'fetchSeminarSuccess';
export const FETCH_SEMINAR_FAIL = 'fetchSeminarFail';

function fetchCurrentSeminar({ commit }) {
  commit(FETCH_SEMINAR_START);
  return api.seminars.getCurrentSeminar()
    .then(data => commit(FETCH_SEMINAR_SUCCESS, data))
    .catch(() => commit(FETCH_SEMINAR_FAIL));
}

export const FETCH_SEMINARS_START = 'fetchSeminarsStart';
export const FETCH_SEMINARS_SUCCESS = 'fetchSeminarsSuccess';
export const FETCH_SEMINARS_FAIL = 'fetchSeminarsFail';

function fetchAllSeminars({ commit }) {
  commit(FETCH_SEMINARS_START);
  return api.seminars.getSeminars()
    .then(data => commit(FETCH_SEMINARS_SUCCESS, data))
    .catch(() => commit(FETCH_SEMINARS_FAIL));
}

const actions = {
  fetchCurrentSeminar,
  fetchAllSeminars,
};

const mutations = {
  fetchSeminarStart(state) {
    state.loading = true;
    state.loadingFailed = false;
  },
  fetchSeminarSuccess(state, data) {
    state.seminar = data || {};
    state.loading = false;
  },
  fetchSeminarsSuccess(state, data) {
    state.seminars = data || [];
    state.loading = false;
  },
  fetchSeminarFail(state) {
    state.loading = false;
    state.loadingFailed = true;
  },
};

export default {
  namespaced: true,
  state: stateObj,
  actions,
  mutations,
};
