import Base from './Base';

export default class UsersApi extends Base {
  getUsers() {
    return this.apiClient.get('listeners');
  }

  getUser(id) {
    return this.apiClient.get(`listeners/${id}`);
  }

  createUser(newListener) {
    return this.apiClient.post('listeners/create', newListener);
  }

  registerUser(listener) {
    return this.apiClient.post('listeners/register', listener);
  }

  editUser(id, editedListener) {
    return this.apiClient.put(`listeners/${id}`, editedListener);
  }

  deleteUser(id) {
    return this.apiClient.delete(`listeners/${id}`);
  }
}
