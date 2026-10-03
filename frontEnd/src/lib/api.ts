import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  withCredentials: true
});

let refreshPromise: Promise<void> | null = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const isAuthRequest = original?.url?.startsWith('/auth/');

    if (error.response?.status !== 401 || original?._retry || isAuthRequest) {
      return Promise.reject(error);
    }

    original._retry = true;
    refreshPromise ??= api.post('/auth/refresh').then(() => undefined).finally(() => {
      refreshPromise = null;
    });

    try {
      await refreshPromise;
      return api(original);
    } catch {
      return Promise.reject(error);
    }
  }
);
