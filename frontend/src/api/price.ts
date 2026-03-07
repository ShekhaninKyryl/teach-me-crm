import axios from "api/axios";
import { getConfig } from "@/configs";
import { withToast } from "api/with-toast";

export interface PriceApi {
  getPriceRange(): Promise<number[]>;
}
const priceApiMock: PriceApi = {
  getPriceRange: async (): Promise<number[]> => {
    return [0, 100];
  },
};

const priceApi: PriceApi = {
  getPriceRange: async (): Promise<number[]> => {
    const response = await axios.get<number[]>("/price/range");
    return response.data;
  },
};

const api = getConfig().isMock ? priceApiMock : withToast(priceApi);
export default api;
