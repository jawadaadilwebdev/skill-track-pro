import api from './api';

// Certifications support file upload, so we build FormData when a file is present.
const toFormData = (data) => {
  const fd = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) fd.append(key, value);
  });
  return fd;
};

export const certificationService = {
  getAll: (params) => api.get('/certifications', { params }).then((r) => r.data),
  create: (data) =>
    api
      .post('/certifications', toFormData(data), { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data),
  update: (id, data) =>
    api
      .put(`/certifications/${id}`, toFormData(data), { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data),
  remove: (id) => api.delete(`/certifications/${id}`).then((r) => r.data),
};
