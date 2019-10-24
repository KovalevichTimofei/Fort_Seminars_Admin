import Base from './Base';

export default class PreachersApi extends Base {
  getPreachers() {
    return this.apiClient.get('preachers');
  }

  getPreacher(id) {
    return this.apiClient.get(`preachers/${id}`);
  }

  createPreacher(newPreacher) {
    return this.apiClient.post('preachers/create', newPreacher);
  }

  editPreacher(id, editedPreacher) {
    return this.apiClient.put(`preachers/${id}`, editedPreacher);
  }

  deletePreacher(id) {
    return this.apiClient.delete(`preachers/${id}`);
  }
}
