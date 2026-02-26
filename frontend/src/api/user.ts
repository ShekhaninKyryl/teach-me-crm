import axios from "./axios";
import type { User } from "@shared/types/user";
import { getConfig } from "@/configs";

export interface UserApi {
  getUserByEmail(email: string): Promise<User>;
  getUserById(id: string): Promise<User>;
  login(user: { email: string; password: string }): Promise<User>;
  logout(): Promise<void>;
  me(): Promise<User>;
}

const userApiMock: UserApi = {
  async getUserByEmail(email: string): Promise<User> {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve({ id: "1", name: "Tom Smith", email });
      }, 500)
    );
  },
  async getUserById(id: string): Promise<User> {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve({ id, name: "Tom Smith", email: "mock@example.com" });
      }, 500)
    );
  },
  async login(user: { email: string; password: string }): Promise<User> {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve({ ...user, id: "1", name: "Tom Smith" });
      }, 500)
    );
  },
  async logout(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 500));
  },
  async me(): Promise<User> {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve({ id: "1", name: "Tom Smith", email: "some@email.com" });
      }, 500)
    );
  },
};

const userApi: UserApi = {
  async getUserByEmail(email: string): Promise<User> {
    const response = await axios.get<User>("/users", {
      params: { email },
    });
    return response.data;
  },
  async getUserById(id: string): Promise<User> {
    const response = await axios.get<User>(`/users/${id}`);
    return response.data;
  },
  async login(user: { email: string; password: string }): Promise<User> {
    await axios.post<User>("/login", user);
    return this.me();
  },
  async logout(): Promise<void> {
    await axios.post("/logout");
  },
  async me(): Promise<User> {
    const response = await axios.get<User>("/me");
    return response.data;
  },
};

const api = getConfig().isMock ? userApiMock : userApi;
export default api;
