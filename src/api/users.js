import axios from 'axios';
import baseURL from '../../config';

const getAuthHeader = () => ({
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

export const getUsers = async () => {
  const response = await axios.get(`${baseURL}/users/`, getAuthHeader());
  return response.data;
};

export const getUser = async (id) => {
  const response = await axios.get(`${baseURL}/users/${id}/`, getAuthHeader());
  return response.data;
};

export const createUser = async (userData) => {
  const response = await axios.post(`${baseURL}/users/`, userData, getAuthHeader());
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await axios.patch(`${baseURL}/users/${id}/`, userData, getAuthHeader());
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await axios.delete(`${baseURL}/users/${id}/`, getAuthHeader());
  return response.data;
};