export type TCandidateEducation = {
  id: string;
  passingYear: number;
  instituteName: string;
  totalMarksCGPA: string;

  board: {
    id: string;
    boardName: string;
  };

  degree: {
    id: string;
    degreeName: string;
  };

  level: {
    id: string;
    levelName: string;
  };

  majorGroup: {
    id: string;
    groupName: string;
  };

  resultType: {
    id: string;
    resultType: string;
  };

  subjectName: string;

  subject: {
    subjectName?: string;
  } | null;

  documents: TEducationDocument[];
};

export type TEducationDocument = {
  id: string;
  type: string;
  name: string | null;
  folderName: string;
  path: string;
  remarks: string | null;
  documentNo: string | null;
  isDeleted: boolean;
  issueAuthority: string | null;
  educationId: string;
};

export type TEducationResponse = TCandidateEducation[];
