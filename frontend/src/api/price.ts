import axios from 'api/axios';
import { getConfig } from '@/configs';

export interface PriceApi {
  getPriceByValue(value: string): Promise<string>;
  getPriceRange(): Promise<number[]>;
}
const priceApiMock: PriceApi = {
  getPriceByValue: async (value: string): Promise<string> => {
    // Mock implementation, replace with actual API call
    return `Price for ${value}`;
  },

  getPriceRange: async (): Promise<number[]> => {
    // Mock implementation, replace with actual API call
    return [0, 100];
  },
};

const priceApi: PriceApi = {
  getPriceByValue: async (value: string): Promise<string> => {
    const response = await axios.get<string>(`/price/${value}`);
    return response.data;
  },

  getPriceRange: async (): Promise<number[]> => {
    const response = await axios.get<number[]>('/price/range');
    return response.data;
  },
};

const api = getConfig().isMock ? priceApiMock : priceApi;
export default api;
