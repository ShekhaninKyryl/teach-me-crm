import axios from 'api/axios';
import type { Subject } from 'types/subject';
import { getConfig } from 'configs';

export interface SubjectApi {
  getSubjects(): Promise<Subject[]>;
  getSubjectById(id: string): Promise<Subject>;
}

const subjectApiMock: SubjectApi = {
  async getSubjects(): Promise<Subject[]> {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve([
          { id: 'math', label: 'Math', icon: 'calculator' },
          { id: 'english', label: 'English', icon: 'language' },
          { id: 'history', label: 'History', icon: 'history' },
          { id: 'biology', label: 'Biology', icon: 'dna' },
          { id: 'chemistry', label: 'Chemistry', icon: 'flask' },
          { id: 'literature', label: 'Literature', icon: 'book' },
          { id: 'geography', label: 'Geography', icon: 'globe' },
          { id: 'computer-science', label: 'Computer Science', icon: 'laptop-code' },
          { id: 'art', label: 'Art', icon: 'palette' },
          { id: 'music', label: 'Music', icon: 'music' },
          { id: 'physics', label: 'Physics', icon: 'atom' },
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
