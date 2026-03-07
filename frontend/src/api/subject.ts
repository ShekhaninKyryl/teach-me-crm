import axios from "api/axios";
import { getConfig } from "@/configs";
import type { Subject } from "@shared/types/subject";
import { type ToastMapType, withToast } from "api/with-toast";
import { toast } from "sonner";
import { _ } from "@/translates";

export interface SubjectApi {
  getSubjects(): Promise<Subject[]>;
  addSubject(subject: Subject): Promise<Subject>;
}

const subjectApiMock: SubjectApi = {
  async getSubjects(): Promise<Subject[]> {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve([
          { id: "math", label: "Math" },
          { id: "english", label: "English", faIcon: "language" },
          { id: "history", label: "History", faIcon: "history" },
          { id: "biology", label: "Biology", faIcon: "dna" },
          { id: "chemistry", label: "Chemistry", faIcon: "flask" },
          { id: "literature", label: "Literature", faIcon: "book" },
          { id: "geography", label: "Geography", faIcon: "globe" },
          { id: "computer-science", label: "Computer Science", faIcon: "laptop-code" },
          { id: "art", label: "Art", faIcon: "palette" },
          { id: "music", label: "Music", faIcon: "music" },
          { id: "physics", label: "Physics", faIcon: "atom" },
        ]);
      }, 1000)
    );
  },
  async addSubject(subject: Subject): Promise<Subject> {
    console.log("Subject was added: ", subject);
    return new Promise<Subject>((resolve) => setTimeout(() => resolve(subject), 500));
  },
};

const subjectApi: SubjectApi = {
  async getSubjects(): Promise<Subject[]> {
    const response = await axios.get<Subject[]>("/subjects");
    return response.data;
  },
  async addSubject(subject: Subject): Promise<Subject> {
    const response = await axios.post<Subject>("/subjects", subject);
    return response.data;
  },
};

const toastMap: ToastMapType<SubjectApi> = {
  addSubject: {
    success: () => toast.success(_("Successfully created subject!")),
  },
};

const api = getConfig().isMock ? subjectApiMock : withToast(subjectApi, toastMap);
export default api;
