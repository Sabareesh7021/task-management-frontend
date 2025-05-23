import axios from 'axios';
import baseURL from '../../config';

const getAuthHeader = () => ({
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

export const getTasks = async () => {
  const response = await axios.get(`${baseURL}/tasks/`, getAuthHeader());
  return response.data;
};

export const getTask = async (id) => {
  const response = await axios.get(`${baseURL}/tasks/${id}/`, getAuthHeader());
  return response.data;
};

export const createTask = async (taskData) => {
  const response = await axios.post(`${baseURL}/tasks/`, taskData, getAuthHeader());
  return response.data;
};

export const updateTask = async (id, taskData) => {
  const response = await axios.patch(`${baseURL}/tasks/${id}/`, taskData, getAuthHeader());
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await axios.delete(`${baseURL}/tasks/${id}/`, getAuthHeader());
  return response.data;
};

export const getTaskReport = async (id) => {
  const response = await axios.get(`${baseURL}/tasks/${id}/report/`, getAuthHeader());
  return response.data;
};