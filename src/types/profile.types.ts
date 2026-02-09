// Root API response
export interface TGetMyProfileResponse {
  status: boolean;
  message: string;
  data: TUserData;
}

// User object
export interface TUserData {
  id: string;
  fullName: string;
  email: string;
  role: "USER" | "ADMIN" | "RECRUITER"; // extend if you have more roles
  createdAt: string; // ISO date string
  candidatePersonal: TUserProfile;
}

// Profile object
export interface TUserProfile {
  id: string;
  userId: string;

  fullName: string;
  fatherName: string;
  motherName: string;
  spouseName?: string;

  gender: "MALE" | "FEMALE" | "OTHER";
  maritalStatus: "MARRIED" | "UNMARRIED" | "DIVORCED" | "WIDOWED";

  dob: string; // ISO date string
  nationality: string;
  religionId: string;
  religion: LookupItem;

  bloodGroupId: string;
  bloodGroup: LookupItem;

  nationalId: string;

  mobileNo: string;
  alternatePhone?: string;

  careerTitle: string;
  careerObjective: string;

  portfolioLink?: string;

  photo: FileAsset | null;
  resume: FileAsset | null;
  signature: FileAsset | null;

  interests: Interest[];
  skills: Skill[];
  socialLink: SocialLink[];

  createdAt: string;
  updatedAt: string;
}

/* ---------- Supporting Types ---------- */

export interface LookupItem {
  id: string;
  name: string;
}

export interface Interest {
  id: string;
  name: string;
}

export interface Skill {
  id: string;
  name: string;
  level?: string;
}

export interface SocialLink {
  id: string;
  label: string;
  url: string;
}

export interface FileAsset {
  id: string;
  url: string;
  fileName: string;
}
