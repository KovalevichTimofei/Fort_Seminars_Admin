import api from '../../apiSingleton';
import { DELETE_PREACHER_FAIL } from './preachers';

const stateObj = {
  listeners: [],
  listener: {},
  loading: false,
  loadingFailed: false,
  creating: false,
  createFailed: false,
  editing: false,
  editFailed: false,
  deleting: false,
  deleteFailed: false,
};

export const FETCH_LISTENERS_START = 'fetchListenersStart';
export const FETCH_LISTENER_SUCCESS = 'fetchListenerSuccess';
export const FETCH_LISTENERS_SUCCESS = 'fetchListenersSuccess';
export const FETCH_LISTENERS_FAIL = 'fetchListenersFail';

function fetchListener({ commit }, id) {
  commit(FETCH_LISTENERS_START);
  return api.listeners.getListener(id)
    .then(data => commit(FETCH_LISTENER_SUCCESS, data))
    .catch(() => commit(FETCH_LISTENERS_FAIL));
}

function fetchAllListeners({ commit }, options) {
  commit(FETCH_LISTENERS_START);
  return api.listeners.getListeners(options)
    .then((data) => {
      commit(FETCH_LISTENERS_SUCCESS, data);
      return data;
    })
    .catch(() => commit(FETCH_LISTENERS_FAIL));
}

export const CREATE_LISTENER_START = 'createListenerStart';
export const CREATE_LISTENER_SUCCESS = 'createListenerSuccess';
export const CREATE_LISTENER_FAIL = 'createListenerFail';

function createListener({ commit }, options) {
  commit(CREATE_LISTENER_START);
  return api.listeners.createListener(options)
    .then(data => commit(CREATE_LISTENER_SUCCESS, data))
    .catch((err) => {
      commit(CREATE_LISTENER_FAIL);
      throw new Error(err);
    });
}

export const EDIT_LISTENER_START = 'editListenerStart';
export const EDIT_LISTENER_SUCCESS = 'editListenerSuccess';
export const EDIT_LISTENER_FAIL = 'editListenerFail';

function editListener({ commit }, options) {
  commit(EDIT_LISTENER_START);
  return api.listeners.editListener(options.id, options)
    .then(data => commit(EDIT_LISTENER_SUCCESS, data))
    .catch((err) => {
      commit(EDIT_LISTENER_FAIL);
      throw new Error(err);
    });
}

export const DELETE_LISTENER_START = 'deleteListenerStart';
export const DELETE_LISTENER_SUCCESS = 'deleteListenerSuccess';
export const DELETE_LISTENER_FAIL = 'deleteListenerFail';

function deleteListener({ commit }, id) {
  commit(DELETE_LISTENER_START);
  return api.listeners.deleteListener(id)
    .then(data => commit(DELETE_LISTENER_SUCCESS, data))
    .catch((err) => {
      commit(DELETE_LISTENER_FAIL);
      throw new Error(err);
    });
}

const actions = {
  fetchListener,
  fetchAllListeners,
  createListener,
  editListener,
  deleteListener,
};

const mutations = {
  fetchListenersStart(state) {
    state.loading = true;
    state.loadingFailed = false;
  },
  fetchListenerSuccess(state, data) {
    state.listener = data;
    state.loading = false;
  },
  fetchListenersSuccess(state, data) {
    state.listeners = data || [];
    state.loading = false;
  },
  fetchListenersFail(state) {
    state.loading = false;
    state.loadingFailed = true;
  },
  createListenerStart(state) {
    state.creating = true;
    state.createFailed = false;
  },
  createListenerSuccess(state, data) {
    if (data) state.listeners.push(data);
    state.creating = false;
  },
  createListenerFail(state) {
    state.creating = false;
    state.createFailed = true;
  },
  editListenerStart(state) {
    state.editing = true;
    state.editFailed = false;
  },
  editListenerSuccess(state, data) {
    if (data) {
      const editedElIndex = state.listeners.findIndex(el => el.id === data.id);
      state.listeners.splice(editedElIndex, 1, data);
    }
    state.editing = false;
  },
  editListenerFail(state) {
    state.editing = false;
    state.editFailed = true;
  },
  deleteListenerStart(state) {
    state.deleting = true;
    state.deleteFailed = false;
  },
  deleteListenerSuccess(state, data) {
    if (data) state.listeners = state.listeners.filter(listener => listener.id !== data.id);
    state.deleting = false;
  },
  deleteListenerFail(state) {
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
