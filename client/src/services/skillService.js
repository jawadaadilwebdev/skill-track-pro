import api from './api';

export const skillService = {
  getAll: (params) => api.get('/skills', { params }).then((r) => r.data),
  create: (data) => api.post('/skills', data).then((r) => r.data),
  update: (id, data) => api.put(`/skills/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/skills/${id}`).then((r) => r.data),
};
