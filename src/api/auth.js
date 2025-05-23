import axios from 'axios';
import baseURL from '../../config';

export const login = async (credentials) => {
  const response = await axios.post(`${baseURL}/login/`, credentials);
  return response.data;
};

export const logout = async (refreshToken) => {
  const response = await axios.post(`${baseURL}/logout/`, {
    refresh: refreshToken
  }, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  return response.data;
};