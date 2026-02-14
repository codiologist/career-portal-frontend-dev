export interface CandidateReference {
  id: string;
  userId: string;
  name: string;
  designation: string;
  companyName: string;
  emailAddress: string;
  phone: string;
  relationship: string;

  createdAt: string;
  updatedAt: string;
}

// Array type
export type CandidateReferences = CandidateReference[];
