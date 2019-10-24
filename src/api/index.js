import ApiClient from './ApiClient';
import config from '../config';

import SeminarApi from './Seminars';
import PreachersApi from './Preachers';
import UsersApi from './Users';
import LessonsApi from './Lessons';

export default function () {
  if (!config.apiPrefix) {
    throw new Error('[apiPrefix] in config.js required');
  }

  const api = new ApiClient({ prefix: config.apiPrefix });

  return {
    apiClient: api,
    seminars: new SeminarApi({ apiClient: api }),
    preachers: new PreachersApi({ apiClient: api }),
    users: new UsersApi({ apiClient: api }),
    lessons: new LessonsApi({ apiClient: api }),
  };
}
