import axios from 'api/axios';
import { getConfig } from 'configs/index';

export interface CityApi {
  getCities(): Promise<string[]>;
  getCityByValue(city: string): Promise<string>;
}

const cityApiMock = {
  async getCities(): Promise<string[]> {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve([
          'Kyiv',
          'Lviv',
          'Odesa',
          'Kharkiv',
          'Dnipro',
          'Zaporizhzhia',
          'Mykolaiv',
          'Vinnytsia',
          'Kherson',
          'Poltava',
          'Chernihiv',
          'Sumy',
          'Ivano-Frankivsk',
          'Ternopil',
          'Chernivtsi',
          'Kropyvnytskyi',
          'Uzhhorod',
          'Kamianets-Podilskyi',
          'Mukachevo',
          'Bila Tserkva',
          'Kremenchuk',
        ]);
      })
    );
  },
  async getCityByValue(city: string): Promise<string> {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve(`City: ${city}`);
      }, 500)
    );
  },
};

const cityApi: CityApi = {
  async getCities(): Promise<string[]> {
    const response = await axios.get<string[]>('/cities');
    return response.data;
  },
  async getCityByValue(city: string): Promise<string> {
    const response = await axios.get<string>(`/cities/${city}`);
    return response.data;
  },
};

const api = getConfig().isMock ? cityApiMock : cityApi;
export default api;
