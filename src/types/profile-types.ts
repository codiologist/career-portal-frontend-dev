/* ---------- Root API Response ---------- */

import { TUserDocument } from "./document-types";
import { CandidateExperiences } from "./experience-types";
import { CandidateReferences } from "./reference-types";

export interface TGetMyProfileResponse {
  status: boolean;
  message: string;
  data: TUserData;
}

/* ---------- User Object ---------- */

export interface TUserData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: "USER" | "ADMIN" | "RECRUITER";
  createdAt: string;

  candidatePersonal: TUserProfile;

  // raw uploaded documents
  documents: TUserDocument[];
  candidateExperiences: CandidateExperiences;
  candidateReferences: CandidateReferences; // ✅ FIXED
}

/* ---------- Profile Object ---------- */

export interface TUserProfile {
  id: string;
  userId: string;

  fullName: string;
  fatherName: string;
  motherName: string;
  spouseName?: string;

  gender: "MALE" | "FEMALE" | "OTHER";
  maritalStatus: "MARRIED" | "UNMARRIED" | "DIVORCED" | "WIDOWED";

  dob: string;
  nationality: string;

  religionId: string;
  religion: TLookupItem;

  bloodGroupId: string;
  bloodGroup: TLookupItem;

  nationalId: string;

  mobileNo: string;
  alternatePhone?: string;

  careerTitle: string;
  careerObjective: string;

  portfolioLink?: string;

  // derived from documents
  photo: TFileAsset | null;
  resume: TFileAsset | null;
  signature: TFileAsset | null;

  interests: TInterest[];
  skills: TSkill[];
  socialLink: TSocialLink[];

  createdAt: string;
  updatedAt: string;
}

/* ---------- Supporting Types ---------- */

export interface TLookupItem {
  id: string;
  name: string;
}

export interface TInterest {
  id: string;
  interstName: string;
}

export interface TSkill {
  id: string;
  skillName: string;
}

export interface TSocialLink {
  id: string;
  label: string;
  url: string;
}

/* ---------- File Assets (Frontend-safe) ---------- */

export interface TFileAsset {
  id: string;
  url: string;
  fileName: string;
}
