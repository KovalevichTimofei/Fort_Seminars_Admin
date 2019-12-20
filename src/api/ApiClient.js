export default class ApiClient {
  constructor({ prefix = 'api' } = {}) {
    this.prefix = prefix;
    this.store = null;
  }

  get(requestUrl, payload = {}, params = {}) {
    return this.request({
      url: requestUrl,
      method: 'get',
      body: payload,
      params,
    });
  }

  put(requestUrl, payload = {}) {
    return this.request({
      url: requestUrl,
      method: 'put',
      body: payload,
    });
  }

  patch(requestUrl, payload = {}) {
    return this.request({
      url: requestUrl,
      method: 'PATCH',
      body: payload,
    });
  }

  post(requestUrl, payload = {}, contentType) {
    return this.request({
      url: requestUrl,
      method: 'post',
      body: payload,
      contentType,
    });
  }

  delete(requestUrl, payload = {}) {
    return this.request({
      url: requestUrl,
      method: 'delete',
      body: payload,
    });
  }

  static refreshTokenPromise = null;

  refreshToken() {
    ApiClient.refreshTokenPromise = this.post('auth/refresh', {
      refreshToken: window.localStorage.getItem('refreshToken'),
    }).then((data) => {
      if (data.code === 401) {
        Promise.reject();
      }
      window.localStorage.setItem('token', data.token);
      window.localStorage.setItem('refreshToken', data.refreshToken);
    });
  }

  request({
    url, method, body, contentType,
  }) {
    let status;
    let init;

    const token = localStorage.getItem('token');

    if (contentType === 'file' || contentType === 'logout' || method === 'get') {
      init = {
        method,
        headers: {
          Accept: 'application/json',
          Authorization: token,
        },
      };
    } else {
      init = {
        method,
        headers: {
          Accept: 'application/json',
          Authorization: token,
          'Content-Type': 'application/json',
        },
      };
    }

    if (method !== 'get' && method !== 'head') {
      if (contentType === 'file') {
        init.body = body;
      } else {
        init.body = JSON.stringify(body);
      }
    }

    return fetch(`${this.prefix}/${url}`, init).then((res) => {
      ({ status } = res);
      return res.json();
    })
      .then((data) => {
        if (status >= 400 && status !== 422) {
          if (status === 401 && data.message === 'Not Authorized') {
            console.log('refresh');
            this.refreshToken();
            return ApiClient.refreshTokenPromise.then(() => this.request({
              url, method, body, contentType,
            }));
          }
          if (status === 401) {
            window.localStorage.removeItem('token');
            this.store.$router.push('/signin');
          }
          if (status === 404) {
            console.log('Not found');
          }
          throw new Error('Bad response from server');
        }

        if (status === 204) {
          return status;
        }
        if (status === 422) {
          return Promise.reject(new Error({ status, data }));
        }
        if (data) {
          return data;
        }

        return Promise.reject(data.error);
      });
  }
}
