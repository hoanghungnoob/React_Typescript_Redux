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
  const response = await axios.get<ApiResponse>('https://7cp0w6p72k.execute-api.ap-southeast-1.amazonaws.com/users');
  return response.data.data;
};

export const createUser = async (user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> => {
  const response = await axios.post<SingleUserResponse>('https://7cp0w6p72k.execute-api.ap-southeast-1.amazonaws.com/users', user);
  return response.data.data;
};

export const updateUser = async (id: number, user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> => {
  const response = await axios.put<SingleUserResponse>(`https://7cp0w6p72k.execute-api.ap-southeast-1.amazonaws.com/users/${id}`, user);
  return response.data.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await axios.delete(`https://7cp0w6p72k.execute-api.ap-southeast-1.amazonaws.com/users/${id}`);
};
