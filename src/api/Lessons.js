import Base from './Base';

export default class LessonsApi extends Base {
  getLessons() {
    return this.apiClient.get('lessons');
  }

  getLessonsByMonth(monthNumber) {
    return this.apiClient.get(`lessons/month/${monthNumber}`);
  }

  getLesson(id) {
    return this.apiClient.get(`lessons/${id}`);
  }

  createLesson(newLesson) {
    return this.apiClient.post('lessons/create', newLesson);
  }

  editLesson(id, editedLesson) {
    return this.apiClient.put(`lessons/${id}`, editedLesson);
  }

  deleteLesson(id) {
    return this.apiClient.delete(`lessons/${id}`);
  }
}
