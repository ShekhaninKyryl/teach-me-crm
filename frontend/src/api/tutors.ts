import type { Tutor } from 'types/tutor';
import axios from 'api/axios';
import { FORMAT_OPTIONS } from 'constants/format';
import { getConfig } from '@/configs';
import { tutors as tutorsMock } from 'api/mocks/tutors';

export interface TutorApi {
  getTopTutors(): Promise<Tutor[]>;
  getTutorById(id: string): Promise<Tutor>;
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
