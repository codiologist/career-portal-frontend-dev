export interface Division {
  id: number;
  name: string;
}

export interface District {
  id: number;
  name: string;
  divisionId: number;
}

export type Upazila = {
  id: number;
  name: string;
  districtId: number;
};

export type CityCorporation = {
  id: number;
  name: string;
  districtId: number;
};

export type PoliceStation = {
  id: number;
  name: string;
  bnName?: string;
  districtId: number;
};

export type Union = {
  id: number;
  name: string;
  upazilaId: number;
};

export type Municipality = {
  id: number;
  name: string;
  upazilaId: number;
};

export type PostOffice = {
  id: number;
  postOffice: string;
  postCode: string;
  districtId: number;
};

export type Divisions = Division[];
export type Districts = District[];
export type Upazilas = Upazila[];
export type CityCorporations = CityCorporation[];
export type Unions = Union[];
export type Municipalities = Municipality[];
export type PoliceStations = PoliceStation[];
export type PostOffices = PostOffice[];
