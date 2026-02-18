import { TUserDocument } from "./document-types";

type AchievementType = "PROFESSIONAL_CERTIFICATION" | "TRAINING";

export interface CandidateAchievement {
  id: string;
  type: AchievementType;
  title: string;
  organizationName: string;
  url: string;
  location: string;
  year: number;
  description: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  documents: TUserDocument[];
}
