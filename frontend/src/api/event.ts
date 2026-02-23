import axios from "./axios";
import { getConfig } from "@/configs";
import type { Event } from "@shared/types/event";
import { MOCK_EVENTS } from "api/mocks/events";

export interface EventApi {
  getEvents(userId: string): Promise<Event[]>;
  setEvents(events: Event[]): Promise<void>;
}

const eventApiMock: EventApi = {
  async getEvents(userId) {
    console.log("Fetched events for ", userId);
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve(MOCK_EVENTS);
      }, 1000)
    );
  },
  async setEvents(events) {
    console.log("Updated events: ", events.length);
  },
};

const eventApi: EventApi = {
  async getEvents(userId) {
    const response = await axios.get<Event[]>("/events", {
      params: { userId },
    });
    return response.data;
  },
  async setEvents(events) {
    const response = await axios.post<void>("/events", events);
    return response.data;
  },
};

const api = getConfig().isMock ? eventApiMock : eventApi;
export default api;
