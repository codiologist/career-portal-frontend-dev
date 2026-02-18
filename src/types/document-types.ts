/* ---------- Document Types ---------- */

import { TSubmitedDocumentType } from "./global-contants";

export enum TDocumentType {
  RESUME = "RESUME",
  AVATAR = "AVATAR",
  SIGNATURE = "SIGNATURE",
  CERTIFICATE = "CERTIFICATE",
  OTHER = "OTHER",
}

/* ---------- Raw User Document ---------- */

export interface TUserDocument {
  id: string;

  type: TSubmitedDocumentType;
  name: TDocumentType;

  documentNo: string;
  issueAuthority: string;
  issueDate: string; // ISO date from backend

  remarks: string | null;

  mimeType: string;
  path: string;
  size: number;

  candidateEducationId: string | null;
  candidateExperienceId: string | null;

  userId: string;

  createdAt: string; // ISO
}
