import api from '../../apiSingleton';

const stateObj = {
  loading: false,
  loadingFailed: false,
  success: false,
  listeners: [],
};

export const REGISTER_USER_START = 'registerUserStart';
export const REGISTER_USER_SUCCESS = 'registerUserSuccess';
export const REGISTER_USER_FAIL = 'registerUserFail';

function registerUser({ commit }, userInfo) {
  commit(REGISTER_USER_START);
  return api.users.registerUser(userInfo)
    .then((data) => {
      commit(REGISTER_USER_SUCCESS, data);
      return data;
    })
    .catch(() => commit(REGISTER_USER_FAIL));
}

export const FETCH_USERS_START = 'fetchUsersStart';
export const FETCH_USERS_SUCCESS = 'fetchUsersSuccess';
export const FETCH_USERS_FAIL = 'fetchUsersFail';

function fetchAllUsers({ commit }, options) {
  commit(FETCH_USERS_START);
  return api.users.getUsers(options)
    .then((data) => {
      commit(FETCH_USERS_SUCCESS, data);
      return data;
    })
    .catch(() => commit(FETCH_USERS_FAIL));
}

const actions = {
  registerUser,
  fetchAllUsers,
};

const mutations = {
  registerUserStart(state) {
    state.loading = true;
    state.success = false;
    state.loadingFailed = false;
  },
  registerUserSuccess(state, data) {
    state.success = data.result;
    state.loading = false;
  },
  registerUserFail(state) {
    state.loading = false;
    state.loadingFailed = true;
  },
  fetchUsersStart(state) {
    state.loading = true;
    state.loadingFailed = false;
  },
  fetchUsersSuccess(state, data) {
    state.listeners = data || [];
    state.loading = false;
  },
  fetchUsersFail(state) {
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
