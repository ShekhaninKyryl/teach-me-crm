import axios from 'api/axios';
import { FORMAT_OPTIONS } from 'constants/format';
import { getConfig } from '@/configs';
import { tutors as tutorsMock } from 'api/mocks/tutors';
import type { User } from 'types/user';
import type { Tutor } from 'types/tutor';

export interface TutorApi {
  getTopTutors(): Promise<Tutor[]>;
  getTutorById(id: string): Promise<Tutor>;
  getTutorsStudents(tutorId: string): Promise<User[]>;
  updateTutorProfile(tutorId: string, tutorData: Partial<Tutor>): Promise<Tutor>;
  saveTutorsStudents(tutorId: string, students: User[]): Promise<void>;
  searchTutors(query: string): Promise<Tutor[]>;
  createTutorProfile(tutor: Partial<Tutor>): Promise<Tutor>;
}

const tutorApiMock: TutorApi = {
  async getTopTutors(): Promise<Tutor[]> {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve([
          {
            id: '1',
            name: 'John Doe',
            email: 'j.doe@test.com',
            subjects: ['Math', 'Physics'],
            format: [FORMAT_OPTIONS.Online],
            rating: 4.5,
            price: 20,
            location: 'New York',
            bio: 'Experienced tutor with a passion for teaching.',
            avatar: 'https://i.pravatar.cc/150?img=47',
            availability: [],
          },
          {
            id: '2',
            name: 'Jane Smith',
            email: 'j.smith@test.com',
            subjects: ['English', 'History'],
            format: [FORMAT_OPTIONS.Offline],
            rating: 4.8,
            price: 25,
            location: 'Los Angeles',
            bio: 'Dedicated educator with over 10 years of experience.',
            avatar: 'https://i.pravatar.cc/150?img=49',
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
          name: 'Mock Tutor',
          email: 'm.tutor@test.com',
          subjects: ['Math'],
          format: [FORMAT_OPTIONS.Online],
          rating: 4.0,
          price: 30,
          location: 'Mock City',
          bio: 'Mock tutor bio',
          avatar: 'https://example.com/mock-profile.jpg',
          availability: [],
        });
      }, 500)
    );
  },
  async getTutorsStudents(tutorId: string): Promise<User[]> {
    console.log('Getting students for tutor:', tutorId);
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve([
          { id: '1', name: 'Alice', email: 'alice@example.com', color: '#ff0000' },
          { id: '2', name: 'Bob', email: 'bob@example.com', color: '#ff00ff' },
          { id: '3', name: 'Charlie', email: 'charlie@example', color: '#ffff00' },
          { id: '4', name: 'User 1', email: '', color: '#00ff00' },
          { id: '5', name: 'User 2', email: '', color: '#0000ff' },
        ]);
      }, 1000)
    );
  },
  async updateTutorProfile(tutorId: string, tutorData: Partial<Tutor>): Promise<Tutor> {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve({
          id: tutorId,
          name: tutorData.name || 'Updated Tutor',
          email: tutorData.email || '',
          subjects: tutorData.subjects || [],
          format: tutorData.format || [],
          rating: tutorData.rating || 0,
          price: tutorData.price || 0,
          location: tutorData.location,
          bio: tutorData.bio || '',
          avatar: tutorData.avatar || '',
          availability: tutorData.availability || [],
          maxStudents: tutorData.maxStudents || 3,
        });
      }, 500)
    );
  },
  async saveTutorsStudents(tutorId: string, students: User[]): Promise<void> {
    return new Promise((resolve) =>
      setTimeout(() => {
        console.log(`Saved ${students.length} students for tutor ${tutorId}`);
        resolve();
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
  async createTutorProfile(tutor: Partial<Tutor>): Promise<Tutor> {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve({
          id: 'new-id',
          name: tutor.name || 'New Tutor',
          email: tutor.email || '',
          subjects: tutor.subjects || [],
          format: tutor.format || [],
          rating: tutor.rating || 0,
          price: tutor.price || 0,
          location: tutor.location,
          bio: tutor.bio || '',
          avatar: tutor.avatar || '',
          availability: [],
        });
      }, 500)
    );
  },
};

const tutorApi = {
  async getTopTutors(): Promise<Tutor[]> {
    const response = await axios('/api/top-tutors');
    return response.data;
  },
  async getTutorById(id: string): Promise<Tutor> {
    const response = await axios(`/api/tutors/${id}`);
    return response.data;
  },
  async getTutorsStudents(tutorId: string): Promise<User[]> {
    const response = await axios.get<User[]>(`/tutors/${tutorId}/students`);
    return response.data;
  },
  async updateTutorProfile(tutorId: string, tutorData: Partial<Tutor>): Promise<Tutor> {
    const response = await axios.put(`/api/tutors/${tutorId}`, tutorData);
    return response.data;
  },
  async saveTutorsStudents(tutorId: string, students: User[]): Promise<void> {
    await axios.post(`/tutors/${tutorId}/students`, { students });
  },
  async searchTutors(query: string): Promise<Tutor[]> {
    const response = await axios(`/api/tutors/search`, {
      params: { query },
    });
    return response.data;
  },
  async createTutorProfile(tutor: Partial<Tutor>): Promise<Tutor> {
    const response = await axios.post('/api/tutors', tutor);
    return response.data;
  },
};

const api = getConfig().isMock ? tutorApiMock : tutorApi;
export default api;
