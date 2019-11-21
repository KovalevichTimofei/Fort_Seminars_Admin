import api from '../../apiSingleton';

const stateObj = {
  lessons: [],
  loading: false,
  loadingFailed: false,
  creating: false,
  createFailed: false,
  editing: false,
  editFailed: false,
  deleting: false,
  deleteFailed: false,
};

export const FETCH_LESSONS_START = 'fetchLessonsStart';
export const FETCH_LESSONS_SUCCESS = 'fetchLessonsSuccess';
export const FETCH_ALL_LESSONS_SUCCESS = 'fetchAllLessonsSuccess';
export const FETCH_LESSONS_FAIL = 'fetchLessonsFail';

function fetchAllLessons({ commit }) {
  commit(FETCH_LESSONS_START);
  return api.lessons.getLessons()
    .then(data => commit(FETCH_ALL_LESSONS_SUCCESS, data))
    .catch(() => commit(FETCH_LESSONS_FAIL));
}

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
  commit(CREATE_LESSON_START);
  return api.lessons.createLesson(newLesson)
    .then(data => commit(CREATE_LESSON_SUCCESS, data))
    .catch(() => commit(CREATE_LESSON_FAIL));
}

export const EDIT_LESSON_START = 'editLessonStart';
export const EDIT_LESSON_SUCCESS = 'editLessonSuccess';
export const EDIT_LESSON_FAIL = 'editLessonFail';

function editLesson({ commit }, newLesson) {
  commit(EDIT_LESSON_START);
  return api.lessons.editLesson(newLesson.id, newLesson)
    .then(data => commit(EDIT_LESSON_SUCCESS, data))
    .catch(() => commit(EDIT_LESSON_FAIL));
}

export const DELETE_LESSON_START = 'deleteLessonStart';
export const DELETE_LESSON_SUCCESS = 'deleteLessonSuccess';
export const DELETE_LESSON_FAIL = 'deleteLessonFail';

function deleteLesson({ commit }, id) {
  console.log(id);
  commit(DELETE_LESSON_START);
  return api.lessons.deleteLesson(id)
    .then(data => commit(DELETE_LESSON_SUCCESS, data))
    .catch(() => commit(DELETE_LESSON_FAIL));
}

const actions = {
  fetchAllLessons,
  fetchLessonsByMonth,
  fetchLessonsBySeminar,
  createLesson,
  editLesson,
  deleteLesson,
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
  fetchAllLessonsSuccess(state, data) {
    state.lessons = data;
    state.loading = false;
  },
  fetchLessonsFail(state) {
    state.loading = false;
    state.loadingFailed = true;
  },
  createLessonStart(state) {
    state.creating = true;
    state.createFailed = false;
  },
  createLessonSuccess(state, data) {
    if (data) state.lessons.push(data);
    state.creating = false;
  },
  createLessonFail(state) {
    state.creating = false;
    state.createFailed = true;
  },
  editLessonStart(state) {
    state.editing = true;
    state.editFailed = false;
  },
  editLessonSuccess(state, data) {
    if (data) {
      const editedElIndex = state.lessons.findIndex(el => el.id === data.id);
      state.lessons.splice(editedElIndex, 1, data);
    }
    state.editing = false;
  },
  editLessonFail(state) {
    state.editing = false;
    state.editFailed = true;
  },
  deleteLessonStart(state) {
    state.deleting = true;
    state.deleteFailed = false;
  },
  deleteLessonSuccess(state, data) {
    if (data) {
      state.lessons = state.lessons.filter(lesson => lesson.id !== data.id);
    }
    state.deleting = false;
  },
  deleteLessonFail(state) {
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
