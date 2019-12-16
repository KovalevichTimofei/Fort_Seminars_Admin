let api;

const stateObj = {
  loading: false,
  loadingFailed: false,
};

export const SIGNIN_START = 'signInStart';
export const SIGNIN_SUCCESS = 'signInSuccess';
export const SIGNIN_FAIL = 'signInFail';

function signIn({ commit }, data) {
  commit(SIGNIN_START);
  return api.auth.signIn(data)
    .then(result => commit(SIGNIN_SUCCESS, result))
    .catch((err) => {
      commit(SIGNIN_FAIL);
      throw new Error(err);
    });
}

const actions = {
  signIn,
};

const mutations = {
  signInStart(state) {
    state.loading = true;
    state.loadingFailed = false;
  },
  signInSuccess(state, data) {
    if (data) {
      window.localStorage.setItem('token', data.token);
    }
    state.loading = false;
  },
  signInFail(state) {
    state.loading = false;
    state.loadingFailed = true;
  },
};

export default function (apiObj) {
  api = apiObj;

  return {
    namespaced: true,
    state: stateObj,
    actions,
    mutations,
  };
}
