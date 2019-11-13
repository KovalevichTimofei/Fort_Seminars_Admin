import Base from './Base';

export default class SeminarsApi extends Base {
  getSeminars(options) {
    return this.apiClient.post('seminars', options);
  }

  getSeminar(id) {
    return this.apiClient.get(`seminars/${id}`);
  }

  getCurrentSeminar() {
    return this.apiClient.get('seminars/current');
  }

  createSeminar(newSeminar) {
    return this.apiClient.post('seminars/create', newSeminar);
  }

  editSeminar(id, editedSeminar) {
    console.log('edit seminar');
    return this.apiClient.put(`seminars/${id}`, editedSeminar);
  }

  deleteSeminar(id) {
    return this.apiClient.delete(`seminars/${id}`);
  }
}
