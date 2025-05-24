import api from "../utils/api.js";

export const taskervice = {
  getTasks: (params) => api.get('/api/get-tasks/', params),
  getTask: (id) => api.get(`/api/get-task/${id}/`),
  createTask: (userData) => api.post('/api/create-task/', userData),
  updateTask: (id, userData) => api.patch(`/api/update-task/${id}/`, userData),
  deleteTask: (id) => api.delete(`/api/delete-task/${id}/`),
  startTask: (id) => api.post(`/api/start-task/${id}/`)
};