import api from '../../apiSingleton';
import { replaceSlashs } from '../../plugins/decoder';

const stateObj = {
  loading: false,
  loadingFailed: false,
  editing: false,
  editFailed: false,
  creating: false,
  createFailed: false,
  deleting: false,
  deleteFailed: false,
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

function fetchSeminarById({ commit }, id) {
  commit(FETCH_SEMINAR_START);
  return api.seminars.getSeminar(id)
    .then(data => commit(FETCH_SEMINAR_SUCCESS, data))
    .catch(() => commit(FETCH_SEMINAR_FAIL));
}

export const FETCH_SEMINARS_START = 'fetchSeminarsStart';
export const FETCH_SEMINARS_SUCCESS = 'fetchSeminarsSuccess';
export const FETCH_SEMINARS_FAIL = 'fetchSeminarsFail';

function fetchAllSeminars({ commit }, options) {
  commit(FETCH_SEMINARS_START);
  return api.seminars.getSeminars(options)
    .then(data => commit(FETCH_SEMINARS_SUCCESS, data))
    .catch(() => commit(FETCH_SEMINARS_FAIL));
}

export const CREATE_SEMINAR_START = 'createSeminarStart';
export const CREATE_SEMINAR_SUCCESS = 'createSeminarSuccess';
export const CREATE_SEMINAR_FAIL = 'createSeminarFail';

function createSeminar({ commit }, options) {
  commit(CREATE_SEMINAR_START);
  return api.seminars.createSeminar(options)
    .then(data => commit(CREATE_SEMINAR_SUCCESS, data))
    .catch(() => commit(CREATE_SEMINAR_FAIL));
}

export const EDIT_SEMINAR_START = 'editSeminarStart';
export const EDIT_SEMINAR_SUCCESS = 'editSeminarSuccess';
export const EDIT_SEMINAR_FAIL = 'editSeminarFail';

function editSeminar({ commit }, options) {
  commit(EDIT_SEMINAR_START);
  return api.seminars.editSeminar(options.seminar.id, options)
    .then(data => commit(EDIT_SEMINAR_SUCCESS, data))
    .catch(() => commit(EDIT_SEMINAR_FAIL));
}

export const DELETE_SEMINAR_START = 'deleteSeminarStart';
export const DELETE_SEMINAR_SUCCESS = 'deleteSeminarSuccess';
export const DELETE_SEMINAR_FAIL = 'deleteSeminarFail';

function deleteSeminar({ commit }, id) {
  commit(DELETE_SEMINAR_START);
  return api.seminars.deleteSeminar(replaceSlashs(id))
    .then(data => commit(DELETE_SEMINAR_SUCCESS, data))
    .catch(() => commit(DELETE_SEMINAR_FAIL));
}

const actions = {
  fetchSeminarById,
  fetchCurrentSeminar,
  fetchAllSeminars,
  createSeminar,
  editSeminar,
  deleteSeminar,
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
  createSeminarStart(state) {
    state.creating = true;
    state.createFailed = false;
  },
  createSeminarSuccess(state, data) {
    if (data) state.seminars.push(data);
    state.creating = false;
  },
  createSeminarFail(state) {
    state.creating = false;
    state.createFailed = true;
  },
  editSeminarStart(state) {
    state.editing = true;
    state.editFailed = false;
  },
  editSeminarSuccess(state, data) {
    if (data) {
      const editedElIndex = state.seminars.findIndex(el => el.id === data.id);
      state.seminars.splice(editedElIndex, 1, data);
    }
    state.editing = false;
  },
  editSeminarFail(state) {
    state.editing = false;
    state.editFailed = true;
  },
  deleteSeminarStart(state) {
    state.deleting = true;
    state.deleteFailed = false;
  },
  deleteSeminarSuccess(state, data) {
    if (data) state.seminars = state.seminars.filter(seminar => seminar.id !== data.id);
    state.deleting = false;
  },
  deleteSeminarFail(state) {
    state.deleting = false;
    state.deleteFailed = true;
  },
};

export default {
  namespaced: true,
  state: stateObj,
  actions,
  mutations,
};
