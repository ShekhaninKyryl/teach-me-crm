import axios from "./axios";
import { getConfig } from "@/configs";
import type { Event } from "@shared/types/event";
import { MOCK_EVENTS } from "api/mocks/events";

export interface EventApi {
  getEvents(userId: string): Promise<Event[]>;
  createEvents(events: Event[]): Promise<void>;
  updateEvents(events: Event[]): Promise<void>;
  deleteEvent(eventId: string): Promise<void>;
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
  async createEvents(events) {
    console.log("Created events: ", events.length);
  },

  async updateEvents(events) {
    console.log("Updated events: ", events.length);
  },

  async deleteEvent(eventId: string) {
    console.log("Deleted event: ", eventId);
  },
};

const eventApi: EventApi = {
  async getEvents(userId) {
    const response = await axios.get<Event[]>(`/events/${userId}`, {
      params: { userId },
    });
    return response.data;
  },
  async createEvents(events) {
    const response = await axios.post<void>("/events", events);
    return response.data;
  },

  async updateEvents(events) {
    const response = await axios.patch<void>("/events", events);
    return response.data;
  },

  async deleteEvent(eventId: string) {
    const response = await axios.delete<void>(`/events/${eventId}`);
    return response.data;
  },
};

const api = getConfig().isMock ? eventApiMock : eventApi;
export default api;
