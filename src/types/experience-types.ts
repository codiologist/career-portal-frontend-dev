export interface CandidateExperience {
  id: string;
  userId: string;

  companyName: string;
  companyBusinessType: string;
  department: string;
  designation: string;
  location: string;

  responsibilities: string; // HTML string from Tiptap

  startDate: string; // ISO string
  endDate: string | null;

  isContinue: boolean;

  createdAt: string;
  updatedAt: string;
}

// Array type
export type CandidateExperiences = CandidateExperience[];
