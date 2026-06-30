import api from './api';

export const goalService = {
  getAll: (params) => api.get('/goals', { params }).then((r) => r.data),
  create: (data) => api.post('/goals', data).then((r) => r.data),
  update: (id, data) => api.put(`/goals/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/goals/${id}`).then((r) => r.data),
};
