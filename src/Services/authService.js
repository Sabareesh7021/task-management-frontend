import api from '../Utils/api'

export const authService = {
  login: (body) => api.post("auth/login/", body)
};
