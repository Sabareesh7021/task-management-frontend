import axios from "axios";
import baseURL from "../config";

const getAccessToken = () => localStorage.getItem("access") || null;

const API = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include token
API.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (config.data instanceof FormData) {
      config.headers["Content-Type"] = "multipart/form-data";
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token refresh
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem("refresh");
        if (!refreshToken) throw new Error("No refresh token");
        
        const response = await axios.post(`${baseURL}auth/refresh/`, {
          refresh: refreshToken
        });
        
        const { access } = response.data;
        localStorage.setItem("access", access);
        originalRequest.headers.Authorization = `Bearer ${access}`;
        
        return API(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

const callApi = async (endpoint, method = "get", params = null) => {
  try {
    let response;
    switch (method.toLowerCase()) {
      case "get":
        response = await API.get(endpoint, { params });
        break;
      case "post":
        response = await API.post(endpoint, params);
        break;
      case "delete":
        response = await API.delete(endpoint, { data: params });
        break;
      case "patch":
        response = await API.patch(endpoint, params);
        break;
      case "put":
        response = await API.put(endpoint, params);
        break;
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
    return response?.data;
  } catch (error) {
    console.error("API call error:", error);
    return error.response?.data || { error: error.message || "An error occurred" };
  }
};

const api = {
  get: (endpoint, params) => callApi(endpoint, "get", params),
  post: (endpoint, params) => callApi(endpoint, "post", params),
  delete: (endpoint, params) => callApi(endpoint, "delete", params),
  patch: (endpoint, params) => callApi(endpoint, "patch", params),
  put: (endpoint, params) => callApi(endpoint, "put", params),
};

export default api;