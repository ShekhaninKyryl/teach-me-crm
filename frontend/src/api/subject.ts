import axios from 'api/axios';
import type { Subject } from 'types/subject';
import { getConfig } from '@/configs';

export interface SubjectApi {
  getSubjects(): Promise<Subject[]>;
  getSubjectById(id: string): Promise<Subject>;
}

const subjectApiMock: SubjectApi = {
  async getSubjects(): Promise<Subject[]> {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve([
          { id: 'math', label: 'Math', faIcon: 'calculator' },
          { id: 'english', label: 'English', faIcon: 'language' },
          { id: 'history', label: 'History', faIcon: 'history' },
          { id: 'biology', label: 'Biology', faIcon: 'dna' },
          { id: 'chemistry', label: 'Chemistry', faIcon: 'flask' },
          { id: 'literature', label: 'Literature', faIcon: 'book' },
          { id: 'geography', label: 'Geography', faIcon: 'globe' },
          { id: 'computer-science', label: 'Computer Science', faIcon: 'laptop-code' },
          { id: 'art', label: 'Art', faIcon: 'palette' },
          { id: 'music', label: 'Music', faIcon: 'music' },
          { id: 'physics', label: 'Physics', faIcon: 'atom' },
        ]);
      }, 1000)
    );
  },
  async getSubjectById(id: string): Promise<Subject> {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve({ id, label: 'Mock Subject', description: 'Mock subject description.' });
      }, 500)
    );
  },
};

const subjectApi: SubjectApi = {
  async getSubjects(): Promise<Subject[]> {
    const response = await axios.get<Subject[]>('/subjects');
    return response.data;
  },
  async getSubjectById(id: string): Promise<Subject> {
    const response = await axios.get<Subject>(`/subjects/${id}`);
    return response.data;
  },
};

const api = getConfig().isMock ? subjectApiMock : subjectApi;
export default api;
