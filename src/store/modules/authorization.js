let api;

const stateObj = {
  loading: false,
  loadingFailed: false,
  signed: false,
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

function signOut({ commit }) {
  window.localStorage.removeItem('token');
  commit(SIGNIN_FAIL);
}

const actions = {
  signIn,
  signOut,
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
    state.signed = true;
  },
  signInFail(state) {
    state.loading = false;
    state.loadingFailed = true;
    state.signed = false;
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
