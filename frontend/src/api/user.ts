import axios from './axios';
import type { User } from 'types/user';
import { getConfig } from '@/configs';

export interface UserApi {
  getUsers(): Promise<User[]>;
  getUserById(id: string): Promise<User>;
  login(user: { email: string; password: string }): Promise<User>;
}

const userApiMock: UserApi = {
  async getUsers(): Promise<User[]> {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve([
          { id: '1', name: 'Alice', email: 'alice@example.com' },
          { id: '2', name: 'Bob', email: 'bob@example.com' },
        ]);
      }, 1000)
    );
  },
  async getUserById(id: string): Promise<User> {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve({ id, name: 'Mock User', email: 'mock@example.com' });
      }, 500)
    );
  },
  async login(user: { email: string; password: string }): Promise<User> {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve({ ...user, id: '1', name: 'Mock User' });
      }, 500)
    );
  },
};

const userApi: UserApi = {
  async getUsers(): Promise<User[]> {
    const response = await axios.get<User[]>('/users');
    return response.data;
  },
  async getUserById(id: string): Promise<User> {
    const response = await axios.get<User>(`/users/${id}`);
    return response.data;
  },
  async login(user: { email: string; password: string }): Promise<User> {
    const response = await axios.post<User>('/login', user);
    return response.data;
  },
};

const api = getConfig().isMock ? userApiMock : userApi;
export default api;
