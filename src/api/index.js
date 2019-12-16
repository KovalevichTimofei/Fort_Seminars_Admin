import ApiClient from './ApiClient';

import AuthApi from './Authorization';
import SeminarApi from './Seminars';
import PreachersApi from './Preachers';
import ListenersApi from './Listeners';
import LessonsApi from './Lessons';

export default function (data) {
  if (!data.apiPrefix) {
    throw new Error('[apiPrefix] in config.js required');
  }

  const api = new ApiClient({ prefix: data.apiPrefix });

  return {
    apiClient: api,
    auth: new AuthApi({ apiClient: api }),
    seminars: new SeminarApi({ apiClient: api }),
    preachers: new PreachersApi({ apiClient: api }),
    listeners: new ListenersApi({ apiClient: api }),
    lessons: new LessonsApi({ apiClient: api }),
  };
}
