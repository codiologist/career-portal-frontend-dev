type AchievementType = "PROFESSIONAL_CERTIFICATION" | "TRAINING" | "WORKSHOP";

export interface CandidateAchievement {
  id: string;
  achievementType: AchievementType;
  title: string;
  organizationName: string;
  url: string;
  location: string;
  year: number;
  description: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  documents: TAchievementDocument[];
}

export type TAchievementDocument = {
  id: string;
  type: string;
  name: string | null;
  folderName: string;
  path: string;
  remarks: string | null;
  documentNo: string | null;
  isDeleted: boolean;
  issueAuthority: string | null;
};
