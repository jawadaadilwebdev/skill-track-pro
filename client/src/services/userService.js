import api from './api';

export const userService = {
  getDashboard: () => api.get('/users/dashboard').then((r) => r.data),
  updateProfile: (data) =>
    api
      .put('/users/profile', data, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data),
  getAllUsers: (params) => api.get('/users', { params }).then((r) => r.data),
  deleteUser: (id) => api.delete(`/users/${id}`).then((r) => r.data),
  getPlatformStats: () => api.get('/users/admin/stats').then((r) => r.data),
};
