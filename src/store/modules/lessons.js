import api from '../../apiSingleton';

const stateObj = {
  loading: false,
  loadingFailed: false,
  lessons: [],
};

export const FETCH_LESSONS_START = 'fetchLessonsStart';
export const FETCH_LESSONS_SUCCESS = 'fetchLessonsSuccess';
export const FETCH_LESSONS_FAIL = 'fetchLessonsFail';

const actions = {
  fetchLessonsByMonth({ commit }, monthNumber) {
    commit(FETCH_LESSONS_START);
    return api.lessons.getLessonsByMonth(monthNumber)
      .then(data => commit(FETCH_LESSONS_SUCCESS, data))
      .catch(() => commit(FETCH_LESSONS_FAIL));
  },
  reWriteLessons({ commit }) {
    commit('reWriteLessons');
  },
};

const mutations = {
  fetchLessonsStart(state) {
    state.loading = true;
    state.loadingFailed = false;
  },
  fetchLessonsSuccess(state, data) {
    state.lessons = data;
    state.loading = false;
  },
  fetchLessonsFail(state) {
    state.loading = false;
    state.loadingFailed = true;
  },
  reWriteLessons(state) {
    console.log('rewrite');
    state.lessons = [...state.lessons];
  },
};

export default {
  namespaced: true,
  state: stateObj,
  actions,
  mutations,
};
