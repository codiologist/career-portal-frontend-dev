/* =========================================================
   LOCATION MASTER TYPES
========================================================= */

export interface Division {
  id: number;
  name: string;
}

export interface District {
  id: number;
  name: string;
  divisionId: number;
}

export interface Upazila {
  id: number;
  name: string;
  districtId: number;
  type: "UPAZILA" | "CITY_CORPORATION";
}

export interface CityCorporation {
  id: number;
  name: string;
  districtId: number;
}

export interface PoliceStation {
  id: number;
  name: string;
  bnName?: string;
  districtId: number;
}

export interface Union {
  id: number;
  name: string;
  upazilaId: number;
}

export interface Municipality {
  id: number;
  name: string;
  upazilaId: number;
}

export interface PostOffice {
  id: number;
  postOffice: string;
  postCode: string;
  districtId: number;
}

/* =========================================================
   COLLECTION TYPES
========================================================= */

export type Divisions = Division[];
export type Districts = District[];
export type Upazilas = Upazila[];
export type CityCorporations = CityCorporation[];
export type Unions = Union[];
export type Municipalities = Municipality[];
export type PoliceStations = PoliceStation[];
export type PostOffices = PostOffice[];

/* =========================================================
   COMMON RESPONSE TYPES
========================================================= */

export type TLocationName = {
  name: string;
};

export type TPostOfficeInfo = {
  postOffice: string;
  postCode: string;
};

/* =========================================================
   ADDRESS API RESPONSE TYPE
========================================================= */

export type TUserAddress = {
  id: string;
  divisionId: number;
  districtId: number;
  upazilaId: number | null;
  cityCorporationId: number | null;
  municipalityId: number | null;
  unionParishadId: number | null;
  policeStationId: number;
  postOfficeId: number;
  wardNo: string | null;
  addressLine: string;
  isSameAsPresent: boolean;
  userId: string;
  addressTypeId: string;

  division: TLocationName | null;
  district: TLocationName | null;
  upazila: TLocationName | null;
  cityCorporation: TLocationName | null;
  municipality: TLocationName | null;
  unionParishad: TLocationName | null;
  policeStation: TLocationName | null;
  postOffice: TPostOfficeInfo | null;
};

// ─── Merged List Types ────────────────────────────────────────────────────────
// Upazila interface এ type: "UPAZILA" | "CITY_CORPORATION" আগে থেকেই আছে।
// CityCorporation এ নেই — তাই merged list এর জন্য type যোগ করি।
export type MergedUpazila =
  | Upazila
  | (CityCorporation & { type: "CITY_CORPORATION" });

// Union ও Municipality তে type নেই — তাই intersection দরকার।
export type MergedUnionMunicipality =
  | (Union & { type: "UNION" })
  | (Municipality & { type: "MUNICIPALITY" });

// ─── Public Interface ─────────────────────────────────────────────────────────
export interface AddressInitialValues {
  divisionId?: string;
  districtId?: string;
  upazilaId?: string;
  cityCorporationId?: string;
  unionParishadId?: string;
  municipalityId?: string;
  policeStationId?: string;
  postOfficeId?: string;
  wardNo?: string;
  addressLine?: string;
}

export interface FetchParams {
  divisionId?: string;
  districtId?: string;
  upazilaId?: string;
}

// ─── State Shape ─────────────────────────────────────────────────────────────

export interface DropdownState {
  divisions: Division[];
  districts: District[];
  upazilas: MergedUpazila[];
  policeStations: PoliceStation[];
  postOffices: PostOffice[];
  unionsMunicipalities: MergedUnionMunicipality[];
  loading: {
    division: boolean;
    district: boolean;
    upazila: boolean;
    policeStation: boolean;
    postOffice: boolean;
    unionMunicipality: boolean;
  };
}

/* =========================================================
   API SUBMIT PAYLOAD (NUMBER BASED)
========================================================= */

export type TAddressPayload = {
  divisionId: number;
  districtId: number;
  upazilaId?: number | null;
  cityCorporationId?: number | null;
  unionParishadId?: number | null;
  municipalityId?: number | null;
  policeStationId: number;
  postOfficeId: number;
  wardNo?: string | null;
  addressLine: string;
};

/* =========================================================
   UI DROPDOWN OPTION TYPE
========================================================= */

export type TOption = {
  label: string;
  value: string;
};
