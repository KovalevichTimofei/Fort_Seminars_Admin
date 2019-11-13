import api from '../../apiSingleton';

const stateObj = {
  loading: false,
  loadingFailed: false,
  lessons: [],
  creating: false,
  createFailed: false,
};

export const FETCH_LESSONS_START = 'fetchLessonsStart';
export const FETCH_LESSONS_SUCCESS = 'fetchLessonsSuccess';
export const FETCH_LESSONS_FAIL = 'fetchLessonsFail';

function fetchLessonsByMonth({ commit }, monthNumber) {
  commit(FETCH_LESSONS_START);
  return api.lessons.getLessonsByMonth(monthNumber)
    .then(data => commit(FETCH_LESSONS_SUCCESS, data))
    .catch(() => commit(FETCH_LESSONS_FAIL));
}

function fetchLessonsBySeminar({ commit }, seminarId) {
  commit(FETCH_LESSONS_START);
  return api.lessons.getLessonsBySeminar(seminarId)
    .then(data => commit(FETCH_LESSONS_SUCCESS, data))
    .catch(() => commit(FETCH_LESSONS_FAIL));
}

export const CREATE_LESSON_START = 'createLessonStart';
export const CREATE_LESSON_SUCCESS = 'createLessonSuccess';
export const CREATE_LESSON_FAIL = 'createLessonFail';

function createLesson({ commit }, newLesson) {
  commit('CREATE_LESSON_START');
  return api.lessons.createLesson(newLesson)
    .then(data => commit(CREATE_LESSON_SUCCESS, data))
    .catch(() => commit(CREATE_LESSON_FAIL));
}

function reWriteLessons({ commit }) {
  commit('reWriteLessons');
}

const actions = {
  fetchLessonsByMonth,
  fetchLessonsBySeminar,
  reWriteLessons,
  createLesson,
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
  createLessonStart(state) {
    state.creating = true;
    state.createFailed = false;
  },
  createLessonSuccess(state) {
    state.creating = false;
  },
  createLessonFail(state) {
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
