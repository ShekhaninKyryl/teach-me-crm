import axios from "./axios";
import { getConfig } from "@/configs";
import { withToast } from "api/with-toast";

export interface EmailApi {
  checkEmailExists(email: string): Promise<boolean>;
}

const emailApiMock: EmailApi = {
  async checkEmailExists(email: string): Promise<boolean> {
    return new Promise((resolve) =>
      setTimeout(() => {
        const existingEmails = ["test@email.com"];
        resolve(existingEmails.includes(email));
      }, 500)
    );
  },
};

const emailApi: EmailApi = {
  async checkEmailExists(email: string): Promise<boolean> {
    const response = await axios.post<boolean>("/email/check", {
      email,
    });
    return response.data;
  },
};

const api = getConfig().isMock ? emailApiMock : withToast(emailApi);
export default api;
