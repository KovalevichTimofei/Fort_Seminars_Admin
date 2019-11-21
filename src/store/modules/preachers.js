import api from '../../apiSingleton';

const stateObj = {
  preacher: {},
  preachers: [],
  loading: false,
  loadingFailed: false,
  creating: false,
  createFailed: false,
  editing: false,
  editFailed: false,
  deleting: false,
  deleteFailed: false,
};

const getters = {
  preachersOptions: state => state.preachers.map(preacher => ({
    value: preacher.id,
    label: preacher.ifo,
  })),
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

export const EDIT_PREACHER_START = 'editPreacherStart';
export const EDIT_PREACHER_SUCCESS = 'editPreacherSuccess';
export const EDIT_PREACHER_FAIL = 'editPreacherFail';

function editPreacher({ commit }, options) {
  commit(EDIT_PREACHER_START);
  return api.preachers.editPreacher(options.id, options)
    .then(data => commit(EDIT_PREACHER_SUCCESS, data))
    .catch(() => commit(EDIT_PREACHER_FAIL));
}

export const DELETE_PREACHER_START = 'deletePreacherStart';
export const DELETE_PREACHER_SUCCESS = 'deletePreacherSuccess';
export const DELETE_PREACHER_FAIL = 'deletePreacherFail';

function deletePreacher({ commit }, id) {
  commit(DELETE_PREACHER_START);
  return api.preachers.deletePreacher(id)
    .then(data => commit(DELETE_PREACHER_SUCCESS, data))
    .catch(() => commit(DELETE_PREACHER_FAIL));
}

const actions = {
  fetchCurrentPreacher,
  fetchAllPreachers,
  createPreacher,
  deletePreacher,
  editPreacher,
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
    if (data) state.preachers.push(data);
    state.creating = false;
  },
  createPreacherFail(state) {
    state.creating = false;
    state.createFailed = true;
  },
  editPreacherStart(state) {
    state.editing = true;
    state.editFailed = false;
  },
  editPreacherSuccess(state, data) {
    if (data) {
      const editedElIndex = state.preachers.findIndex(el => el.id === data.id);
      state.preachers.splice(editedElIndex, 1, data);
    }
    state.editing = false;
  },
  editPreacherFail(state) {
    state.editing = false;
    state.editFailed = true;
  },
  deletePreacherStart(state) {
    state.deleting = true;
    state.deleteFailed = false;
    state.deleteSuccess = false;
  },
  deletePreacherSuccess(state, data) {
    if (data) state.preachers = state.preachers.filter(preacher => preacher.id !== data.id);
    state.deleting = false;
    state.deleteSuccess = true;
  },
  deletePreacherFail(state) {
    state.deleting = false;
    state.deleteFailed = true;
    state.deleteSuccess = false;
  },
};

export default {
  namespaced: true,
  state: stateObj,
  getters,
  actions,
  mutations,
};
