import api from "../utils/api.js";

export const authService = {
  login: (body) => api.post("auth/login/", body)
};
