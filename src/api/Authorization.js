import Base from './Base';

export default class AuthApi extends Base {
  signIn(data) {
    return this.apiClient.post('auth/signin', data);
  }

  refresh(data) {
    return this.apiClient.post('auth/refresh', data);
  }
}
