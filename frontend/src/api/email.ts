import axios from './axios';
import { getConfig } from '@/configs';

export interface EmailApi {
  checkEmailExists(email: string): Promise<{ exists: boolean }>;
}

const emailApiMock: EmailApi = {
  async checkEmailExists(email: string): Promise<{ exists: boolean }> {
    return new Promise((resolve) =>
      setTimeout(() => {
        const existingEmails = ['test@email.com'];
        resolve({ exists: existingEmails.includes(email) });
      }, 500)
    );
  },
};

const emailApi: EmailApi = {
  async checkEmailExists(email: string): Promise<{ exists: boolean }> {
    const response = await axios.get<{ exists: boolean }>('/email/check', {
      params: { email },
    });
    return response.data;
  },
};

const api = getConfig().isMock ? emailApiMock : emailApi;
export default api;
