// userApi.ts
import axios from 'axios';
import { User } from '../types/userTypes';

interface ApiResponse {
  success: boolean;
  status: number;
  message: string;
  data: User[];
}

interface SingleUserResponse {
  success: boolean;
  status: number;
  message: string;
  data: User;
}

export const fetchUsers = async (): Promise<User[]> => {
  const response = await axios.get<ApiResponse>('https://ye887syarg.execute-api.ap-southeast-1.amazonaws.com/users');
  return response.data.data;
};

export const createUser = async (user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> => {
  const response = await axios.post<SingleUserResponse>('https://ye887syarg.execute-api.ap-southeast-1.amazonaws.com/users', user);
  return response.data.data;
};

export const updateUser = async (id: number, user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> => {
  const response = await axios.put<SingleUserResponse>(`https://ye887syarg.execute-api.ap-southeast-1.amazonaws.com/users/${id}`, user);
  return response.data.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await axios.delete(`https://ye887syarg.execute-api.ap-southeast-1.amazonaws.com/users/${id}`);
};

export const loginUser = async (credentials: { name?: string; password?: string; token?: string }): Promise<User> => {
  try {
    if (credentials.token) {
      const response = await axios.post<SingleUserResponse>('http://localhost:3003/auth/check', { token: credentials.token });
      return response.data.data;
    } else if (credentials.name && credentials.password) {
      const response = await axios.post<SingleUserResponse>('http://localhost:3003/login', {
        name: credentials.name,
        password: credentials.password,
      });
      return response.data.data;
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (error) {
    console.error('Login error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      status: axios.isAxiosError(error) ? error.response?.status : undefined,
      data: axios.isAxiosError(error) ? error.response?.data : undefined,
    });
    throw error;
  }
};