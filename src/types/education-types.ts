export type TCandidateEducation = {
  id: string;
  passingYear: number;
  instituteName: string;
  totalMarksCGPA: string;

  board: {
    boardName: string;
  };

  degree: {
    degreeName: string;
  };

  level: {
    levelName: string;
  };

  majorGroup: {
    groupName: string;
  };

  resultType: {
    resultType: string;
  };

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
};

export type TEducationResponse = TCandidateEducation[];
