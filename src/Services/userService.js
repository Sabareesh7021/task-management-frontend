import api from '../Utils/api'

export const userService = {
  getUsers: (params) => api.get('/auth/get-users/', params),
  getUser: (id) => api.get(`/auth/user/${id}/`),
  createUser: (userData) => api.post('/auth/create-user/', userData),
  updateUser: (id, userData) => api.patch(`/auth/update-user/${id}/`, userData),
  deleteUser: (id) => api.delete(`/auth/delete-user/${id}/`)
};