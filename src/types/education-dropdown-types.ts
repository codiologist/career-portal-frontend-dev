export interface EducationLevel {
  id: string;
  levelName: string;
}

export interface EducationDegree {
  id: string;
  degreeName: string;
  levelId: string;
}

export interface EducationBoard {
  id: string;
  boardName: string;
}

export interface EducationGroup {
  id: string;
  groupName: string;
}

export interface EducationResultType {
  id: string;
  resultType: string;
}

export interface EducationSubject {
  id: string;
  subjectName: string;
}

export interface EducationMeta {
  boards: EducationBoard[];
  majorGroups: EducationGroup[];
  resultTypes: EducationResultType[];
  subjects: EducationSubject[];
}
