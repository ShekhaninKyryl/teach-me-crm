import axios from "api/axios";
import { getConfig } from "@/configs";
import { tutors as tutorsMock } from "api/mocks/tutors";
import type { User } from "@shared/types/user";
import type { Tutor, TutorWithPassword } from "@shared/types/tutor";
import { FORMAT_OPTIONS } from "@shared/types/common";
import type { Filter } from "@shared/types/filter";
import type { Student } from "@shared/types/students";
import { type ToastMapType, withToast } from "api/with-toast";
import { toast } from "sonner";
import { _ } from "@/translates";
import type { AppLanguage } from "@/constants/language";

export interface TutorApi {
  getTopTutors(): Promise<Tutor[]>;
  getTutorById(id: string): Promise<Tutor>;
  getTutorsStudents(tutorId: string): Promise<Student[]>;
  saveTutorsStudents(tutorId: string, students: Student[]): Promise<Student[]>;
  updateTutorProfile(tutorId: string, tutorData: Partial<TutorWithPassword>): Promise<Tutor>;
  createTutorProfile(tutor: Partial<TutorWithPassword> & { language?: AppLanguage }): Promise<{ success: true }>;
  searchTutors(query: Filter[]): Promise<Tutor[]>;
  getStudentsCount(tutorId: string): Promise<number>;
  setMaxStudents(tutorId: string, maxStudents: number): Promise<void>;
}

const tutorApiMock: TutorApi = {
  async getTopTutors(): Promise<Tutor[]> {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve([
          {
            id: "1",
            name: "John Doe",
            email: "j.doe@test.com",
            subjects: ["Math", "Physics"],
            formats: [FORMAT_OPTIONS.Online],
            rating: 4.5,
            price: 20,
            location: "New York",
            bio: "Experienced tutor with a passion for teaching.",
            avatar: "https://i.pravatar.cc/150?img=47",
            availability: [],
          },
          {
            id: "2",
            name: "Jane Smith",
            email: "j.smith@test.com",
            subjects: ["English", "History"],
            formats: [FORMAT_OPTIONS.Offline],
            rating: 4.8,
            price: 25,
            location: "Los Angeles",
            bio: "Dedicated educator with over 10 years of experience.",
            avatar: "https://i.pravatar.cc/150?img=49",
            availability: [],
          },
        ]);
      }, 1000)
    );
  },
  async getTutorById(id: string): Promise<Tutor> {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve({
          id,
          name: "Mock Tutor",
          email: "m.tutor@test.com",
          subjects: ["Math"],
          formats: [FORMAT_OPTIONS.Online],
          rating: 4.0,
          price: 30,
          location: "Mock City",
          bio: "Mock tutor bio",
          avatar: "https://example.com/mock-profile.jpg",
          availability: [],
        });
      }, 500)
    );
  },
  async getTutorsStudents(tutorId: string): Promise<Student[]> {
    console.log("Getting students for tutor:", tutorId);
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve([
          { id: "1", name: "Alice", email: "alice@example.com", color: "#ff0000" },
          { id: "2", name: "Bob", email: "bob@example.com", color: "#ff00ff" },
          { id: "3", name: "Charlie", email: "charlie@example", color: "#ffff00" },
          { id: "4", name: "User 1", email: "", color: "#00ff00" },
          { id: "5", name: "User 2", email: "", color: "#0000ff" },
        ]);
      }, 1000)
    );
  },
  async updateTutorProfile(tutorId: string, tutorData: Partial<TutorWithPassword>): Promise<Tutor> {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve({
          id: tutorId,
          name: tutorData.name || "Updated Tutor",
          email: tutorData.email || "",
          subjects: tutorData.subjects || [],
          formats: tutorData.formats || [],
          rating: tutorData.rating || 0,
          price: tutorData.price || 0,
          location: tutorData.location,
          bio: tutorData.bio || "",
          avatar: tutorData.avatar || "",
          availability: tutorData.availability || [],
          maxStudents: tutorData.maxStudents || 3,
        });
      }, 500)
    );
  },
  async saveTutorsStudents(tutorId: string, students: User[]): Promise<Student[]> {
    return new Promise((resolve) =>
      setTimeout(() => {
        console.log(`Saved ${students.length} students for tutor ${tutorId}`);
        resolve([
          { id: "1", name: "Alice", email: "alice@example.com", color: "#ff0000" },
          { id: "2", name: "Bob", email: "bob@example.com", color: "#ff00ff" },
          { id: "3", name: "Charlie", email: "charlie@example", color: "#ffff00" },
          { id: "4", name: "User 1", email: "", color: "#00ff00" },
          { id: "5", name: "User 2", email: "", color: "#0000ff" },
        ]);
      }, 500)
    );
  },
  async searchTutors(): Promise<Tutor[]> {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve(tutorsMock);
      }, 500)
    );
  },
  async createTutorProfile(
    _tutor: Partial<TutorWithPassword> & { language?: AppLanguage }
  ): Promise<{ success: true }> {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve({ success: true });
      }, 500)
    );
  },
  async getStudentsCount(tutorId: string): Promise<number> {
    return new Promise((resolve) =>
      setTimeout(() => {
        console.log(`Getting students count for tutor ${tutorId}`);
        resolve(5); // Mocked count of students
      }, 300)
    );
  },
  async setMaxStudents(tutorId: string, maxStudents: number): Promise<void> {
    return new Promise((resolve) =>
      setTimeout(() => {
        console.log(`Set max students for tutor ${tutorId} to ${maxStudents}`);
        resolve();
      }, 300)
    );
  },
};

const tutorApi = {
  async getTopTutors(): Promise<Tutor[]> {
    const response = await axios("/top-tutors");
    return response.data;
  },
  async getTutorById(id: string): Promise<Tutor> {
    const response = await axios(`/tutors/${id}`);
    return response.data;
  },
  async getTutorsStudents(tutorId: string): Promise<Student[]> {
    const response = await axios.get<Student[]>(`/tutors/${tutorId}/students`);
    return response.data;
  },
  async updateTutorProfile(tutorId: string, tutorData: Partial<TutorWithPassword>): Promise<Tutor> {
    const response = await axios.patch(`/tutors/${tutorId}`, tutorData);
    return response.data;
  },
  async saveTutorsStudents(tutorId: string, students: Student[]): Promise<Student[]> {
    const response = await axios.put(`/tutors/${tutorId}/students`, students);
    return response.data;
  },
  async searchTutors(query: Filter[]): Promise<Tutor[]> {
    const response = await axios.post(`/tutors/search`, query);
    return response.data;
  },
  async createTutorProfile(
    tutor: Partial<TutorWithPassword> & { language?: AppLanguage }
  ): Promise<{ success: true }> {
    const response = await axios.post("/tutors", tutor);
    return response.data;
  },
  async getStudentsCount(tutorId: string): Promise<number> {
    const response = await axios.get(`/tutors/${tutorId}/max-students`);
    return response.data;
  },
  async setMaxStudents(tutorId: string, maxStudents: number): Promise<void> {
    await axios.patch(`/tutors/${tutorId}/max-students`, { maxStudents });
  },
};

const toastMap: ToastMapType<TutorApi> = {
  searchTutors: {
    success: (result) => toast.success(_("Found {LENGTH} tutors!", { LENGTH: result.length })),
  },
  updateTutorProfile: {
    success: () => toast.success(_("Successfully updated tutor profile!")),
  },
  createTutorProfile: {
    success: () => toast.success(_("Successfully created tutor profile!")),
  },
  saveTutorsStudents: {
    success: () => toast.success(_("Successfully updated students!")),
  },
  setMaxStudents: {
    success: () => toast.success(_("Successfully updated students capacity!")),
  },
};

const api = getConfig().isMock ? tutorApiMock : withToast(tutorApi, toastMap);
export default api;
