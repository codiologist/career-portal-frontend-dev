/* ---------- Document Types ---------- */

export enum TDocumentType {
  RESUME = "RESUME",
  AVATAR = "AVATAR",
  SIGNATURE = "SIGNATURE",
  CERTIFICATE = "CERTIFICATE",
}

/* ---------- Raw User Document ---------- */

export interface TUserDocument {
  id: string;
  userId: string;

  type: TDocumentType;
  mimeType: string;

  name: string | null;
  path: string;
  size: number;

  candidateEducationId: string | null;
  candidateExperienceId: string | null;

  createdAt: string;
}
