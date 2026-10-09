import { api } from '../lib/api';

/** Keep all HTTP transport calls behind this service layer. */
export const apiService = {
  get: api.get.bind(api),
  post: api.post.bind(api),
  put: api.put.bind(api),
  patch: api.patch.bind(api),
  delete: api.delete.bind(api)
};

