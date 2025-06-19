import axios from "axios";
import { User } from '../types';

const API_URL = "https://stayfinder-backend-5wmn.onrender.com"; // adjust as needed

interface AuthResponse {
  token: string;
  user: User;
}

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
};

export const register = async (name: string, email: string, password: string): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/register`, { name, email, password });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getCurrentUser = async (): Promise<User> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  const response = await axios.get(`${API_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const updateProfile = async (userData: Partial<User>): Promise<User> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }

  const response = await axios.put(`${API_URL}/profile`, userData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};
