import type { Tutor } from 'types/tutor';
import axios from 'api/axios';
import { FORMAT_OPTIONS } from 'constants/format';
import { getConfig } from '@/configs';
import { tutors as tutorsMock } from 'api/mocks/tutors';

export interface TutorApi {
  getTutors(): Promise<Tutor[]>;
  getTutorById(id: string): Promise<Tutor>;
  searchTutors(query: string): Promise<Tutor[]>;
}

const tutorApiMock: TutorApi = {
  async getTutors(): Promise<Tutor[]> {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve([
          {
            id: '1',
            name: 'John Doe',
            email: 'j.doe@test.com',
            subjects: ['Math', 'Physics'],
            format: FORMAT_OPTIONS.Online,
            rating: 4.5,
            price: 20,
            location: 'New York',
            bio: 'Experienced tutor with a passion for teaching.',
            profilePictureUrl: 'https://example.com/profile1.jpg',
          },
          {
            id: '2',
            name: 'Jane Smith',
            email: 'j.smith@test.com',
            subjects: ['English', 'History'],
            format: FORMAT_OPTIONS.Offline,
            rating: 4.8,
            price: 25,
            location: 'Los Angeles',
            bio: 'Dedicated educator with over 10 years of experience.',
            profilePictureUrl: 'https://example.com/profile2.jpg',
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
          format: FORMAT_OPTIONS.Online,
          rating: 4.0,
          price: 30,
          location: 'Mock City',
          bio: 'Mock tutor bio',
          profilePictureUrl: 'https://example.com/mock-profile.jpg',
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
};

const tutorApi = {
  async getTutors(): Promise<Tutor[]> {
    const response = await axios('/api/tutors');
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
};

const api = getConfig().isMock ? tutorApiMock : tutorApi;
export default api;
