import axios from "api/axios";
import { getConfig } from "@/configs";
import { withToast } from "api/with-toast";

export interface CityApi {
  getCities(): Promise<string[]>;
}

const cityApiMock: CityApi = {
  async getCities(): Promise<string[]> {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve([
          "Kyiv",
          "Lviv",
          "Odesa",
          "Kharkiv",
          "Dnipro",
          "Zaporizhzhia",
          "Mykolaiv",
          "Vinnytsia",
          "Kherson",
          "Poltava",
          "Chernihiv",
          "Sumy",
          "Ivano-Frankivsk",
          "Ternopil",
          "Chernivtsi",
          "Kropyvnytskyi",
          "Uzhhorod",
          "Kamianets-Podilskyi",
          "Mukachevo",
          "Bila Tserkva",
          "Kremenchuk",
        ]);
      })
    );
  },
};

const cityApi: CityApi = {
  async getCities(): Promise<string[]> {
    const response = await axios.get<string[]>("/cities");
    return response.data;
  },
};

const api = getConfig().isMock ? cityApiMock : withToast(cityApi);
export default api;
