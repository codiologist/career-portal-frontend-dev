export type TProfileProgress = {
  breakdown: TProfileBreakdown;
  eligibleForApply: TEligibleForApply;
  totalScore: number;
};

export type TProfileBreakdown = {
  addresses: number;
  avatar: number;
  candidateAchievements: number;
  candidateEducations: number;
  candidateExperiences: number;
  candidatePersonal: number;
  candidateReferences: number;
  resume: number;
  signature: number;
};

export type TEligibleForApply = {
  isPossibleJobApply: boolean;
  missingFields: string[];
};
