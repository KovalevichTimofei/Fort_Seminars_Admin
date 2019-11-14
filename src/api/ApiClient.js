export default class ApiClient {
  constructor({ prefix = 'api' } = {}) {
    this.prefix = prefix;
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

  request({
    url, method, body, contentType,
  }) {
    let status;
    let init;

    // const token = localStorage.getItem('auth_token');

    if (contentType === 'file' || contentType === 'logout' || method === 'get') {
      init = {
        method,
        headers: {
          Accept: 'application/json',
        },
      };
    } else {
      init = {
        method,
        headers: {
          Accept: 'application/json',
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
    console.log(`${this.prefix}/${url}`, init);

    return fetch(`${this.prefix}/${url}`, init).then((res) => {
      ({ status } = res);

      if (status === 204) {
        return status;
      }

      return res.json();
    }).then((data) => {
      if (status >= 400 && status !== 422) {
        if (status === 404) {
          console.log('Not found');
        }
        if (data.message) {
          throw new Error(data.message);
        }
        throw new Error('Bad response from server');
      }

      // 204 No Content --> return status
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
