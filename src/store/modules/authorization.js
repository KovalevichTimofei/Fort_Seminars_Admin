let api;

const stateObj = {
  loading: false,
  loadingFailed: false,
  signed: false,
  refreshTokenPromise: null,
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
  window.localStorage.removeItem('refreshToken');
  commit(SIGNIN_FAIL);
}

export const REFRESH_START = 'refreshStart';

function refreshToken({ commit }) {
  commit(REFRESH_START);
}

const actions = {
  signIn,
  signOut,
  refreshToken,
};

const mutations = {
  signInStart(state) {
    state.loading = true;
    state.loadingFailed = false;
  },
  signInSuccess(state, data) {
    if (data) {
      window.localStorage.setItem('token', data.token);
      window.localStorage.setItem('refreshToken', data.refreshToken);
    }
    state.loading = false;
    state.signed = true;
  },
  signInFail(state) {
    state.loading = false;
    state.loadingFailed = true;
    state.signed = false;
  },
  refreshStart(state) {
    state.refreshTokenPromise = api.auth.refresh({
      refreshToken: window.localStorage.getItem('refreshToken'),
    }).then((data) => {
      window.localStorage.setItem('token', data.token);
      window.localStorage.setItem('refreshToken', data.refreshToken);
    });
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
