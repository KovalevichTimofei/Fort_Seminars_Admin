import Base from './Base';

export default class ListenersApi extends Base {
  getListeners(options) {
    return this.apiClient.post('listeners', options);
  }

  getListener(id) {
    return this.apiClient.get(`listeners/${id}`);
  }

  createListener(newListener) {
    return this.apiClient.post('listeners/create', newListener);
  }

  registerListener(listener) {
    return this.apiClient.post('listeners/register', listener);
  }

  editListener(id, editedListener) {
    return this.apiClient.put(`listeners/${id}`, editedListener);
  }

  deleteListener(id) {
    return this.apiClient.delete(`listeners/${id}`);
  }
}
