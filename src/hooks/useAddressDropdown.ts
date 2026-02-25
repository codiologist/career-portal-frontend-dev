"use client";

import api from "@/lib/axiosInstance";
import type {
  AddressInitialValues,
  CityCorporation,
  District,
  Division,
  DropdownState,
  FetchParams,
  MergedUnionMunicipality,
  MergedUpazila,
  Municipality,
  PoliceStation,
  PostOffice,
  Union,
  Upazila,
} from "@/types/address-types";
import { useEffect, useReducer, useRef } from "react";
import type { UseFormReturn } from "react-hook-form";

type Action =
  | { type: "SET_DIVISIONS"; payload: Division[] }
  | { type: "SET_DISTRICTS"; payload: District[] }
  | { type: "SET_UPAZILAS"; payload: MergedUpazila[] }
  | { type: "SET_POLICE_STATIONS"; payload: PoliceStation[] }
  | { type: "SET_POST_OFFICES"; payload: PostOffice[] }
  | { type: "SET_UNIONS_MUNICIPALITIES"; payload: MergedUnionMunicipality[] }
  | { type: "SET_LOADING"; key: keyof DropdownState["loading"]; value: boolean }
  | {
      type: "SET_DISTRICT_DATA";
      upazilas: MergedUpazila[];
      policeStations: PoliceStation[];
      postOffices: PostOffice[]; // একই API call এ আসে, আলাদা action লাগে না
    };

const initialState: DropdownState = {
  divisions: [],
  districts: [],
  upazilas: [],
  policeStations: [],
  postOffices: [],
  unionsMunicipalities: [],
  loading: {
    division: false,
    district: false,
    upazila: false,
    policeStation: false,
    postOffice: false,
    unionMunicipality: false,
  },
};

function reducer(state: DropdownState, action: Action): DropdownState {
  switch (action.type) {
    case "SET_DIVISIONS":
      return { ...state, divisions: action.payload };
    case "SET_DISTRICTS":
      return { ...state, districts: action.payload };
    case "SET_UPAZILAS":
      return { ...state, upazilas: action.payload };
    case "SET_POLICE_STATIONS":
      return { ...state, policeStations: action.payload };
    case "SET_POST_OFFICES":
      return { ...state, postOffices: action.payload };
    case "SET_UNIONS_MUNICIPALITIES":
      return { ...state, unionsMunicipalities: action.payload };
    case "SET_LOADING":
      return {
        ...state,
        loading: { ...state.loading, [action.key]: action.value },
      };
    case "SET_DISTRICT_DATA":
      return {
        ...state,
        upazilas: action.upazilas,
        policeStations: action.policeStations,
        postOffices: action.postOffices,
      };
    default:
      return state;
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fetchDropdown = async (params: FetchParams) => {
  const query = new URLSearchParams();
  if (params.divisionId) query.append("divisionId", params.divisionId);
  if (params.districtId) query.append("districtId", params.districtId);
  if (params.upazilaId) query.append("upazilaId", params.upazilaId);
  const res = await api.get(
    `/user/profile/address/dropdown?${query.toString()}`,
  );
  return res.data.data;
};

const sortBy = <T>(arr: T[], key: keyof T): T[] =>
  [...arr].sort((a, b) =>
    String(a[key]).localeCompare(String(b[key]), undefined, {
      sensitivity: "base",
    }),
  );

/**
 * District select হলে backend একটাই call এ সব দেয়:
 *   upazilas + cityCorporations + policeStations + postOffices
 * তাই এখানে একটাই fetchDropdown call।
 */
const fetchDistrictData = async (
  divisionId: string,
  districtId: string,
): Promise<{
  mergedUpazilas: MergedUpazila[];
  sortedPolice: PoliceStation[];
  sortedPostOffices: PostOffice[];
}> => {
  const data = await fetchDropdown({ divisionId, districtId });

  // fetchDropdown returns any — explicit cast করলে sortBy generic সঠিকভাবে infer হয়
  const rawUpazilas: Upazila[] = data?.upazilas ?? [];
  const rawCityCorporations: CityCorporation[] = Array.isArray(
    data?.cityCorporations,
  )
    ? data.cityCorporations
    : [];
  const rawPoliceStations: PoliceStation[] = data?.policeStations ?? [];
  const rawPostOffices: PostOffice[] = data?.postOffices ?? [];

  const mergedUpazilas: MergedUpazila[] = [
    ...sortBy(rawUpazilas, "name").map((u) => ({
      ...u,
      type: "UPAZILA" as const,
    })),
    ...rawCityCorporations.map((c) => ({
      ...c,
      type: "CITY_CORPORATION" as const,
    })),
  ];

  const sortedPolice: PoliceStation[] = sortBy(rawPoliceStations, "name");
  const sortedPostOffices: PostOffice[] = sortBy(rawPostOffices, "postOffice");

  return { mergedUpazilas, sortedPolice, sortedPostOffices };
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useAddressDropdown = (
  watchedDivisionId?: string,
  watchedDistrictId?: string,
  watchedUpazilaId?: string,
  prefix?: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form?: UseFormReturn<any>,
  initialValues?: AddressInitialValues,
) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const prefillDone = useRef(false);

  const setField = (field: string, value: string) => {
    form?.setValue(`${prefix}.${field}`, value, { shouldDirty: true });
  };

  // ─── PRE-FILL SEQUENCE ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!initialValues?.divisionId || !form || !prefix) return;
    if (prefillDone.current) return;
    prefillDone.current = true;

    const run = async () => {
      const {
        divisionId,
        districtId,
        upazilaId,
        cityCorporationId,
        unionParishadId,
        municipalityId,
        policeStationId,
        postOfficeId,
      } = initialValues;

      // Step 1: Divisions
      dispatch({ type: "SET_LOADING", key: "division", value: true });
      try {
        const data = await fetchDropdown({});
        dispatch({
          type: "SET_DIVISIONS",
          payload: sortBy(data?.data ?? [], "name"),
        });
        setField("divisionId", divisionId!);
      } finally {
        dispatch({ type: "SET_LOADING", key: "division", value: false });
      }

      if (!districtId) return;

      // Step 2: Districts
      dispatch({ type: "SET_LOADING", key: "district", value: true });
      try {
        const data = await fetchDropdown({ divisionId });
        dispatch({
          type: "SET_DISTRICTS",
          payload: sortBy(data?.data ?? [], "name"),
        });
        setField("districtId", districtId);
      } finally {
        dispatch({ type: "SET_LOADING", key: "district", value: false });
      }

      // Step 3: Upazilas + Police + PostOffices — একটাই API call
      dispatch({ type: "SET_LOADING", key: "upazila", value: true });
      dispatch({ type: "SET_LOADING", key: "policeStation", value: true });
      dispatch({ type: "SET_LOADING", key: "postOffice", value: true });
      try {
        const { mergedUpazilas, sortedPolice, sortedPostOffices } =
          await fetchDistrictData(divisionId!, districtId);

        dispatch({
          type: "SET_DISTRICT_DATA",
          upazilas: mergedUpazilas,
          policeStations: sortedPolice,
          postOffices: sortedPostOffices,
        });

        const upazilaCityCorpId = upazilaId || cityCorporationId || "";
        if (upazilaCityCorpId) {
          setField("upazilaCityCorpId", upazilaCityCorpId);
          const found = mergedUpazilas.find(
            (u) => String(u.id) === String(upazilaCityCorpId),
          );
          if (found?.type === "UPAZILA") {
            setField("upazilaId", upazilaCityCorpId);
            setField("cityCorporationId", "");
          } else if (found?.type === "CITY_CORPORATION") {
            setField("cityCorporationId", upazilaCityCorpId);
            setField("upazilaId", "");
          }
        }
        if (policeStationId) setField("policeStationId", policeStationId);
        if (postOfficeId) setField("postOfficeId", postOfficeId);
      } finally {
        dispatch({ type: "SET_LOADING", key: "upazila", value: false });
        dispatch({ type: "SET_LOADING", key: "policeStation", value: false });
        dispatch({ type: "SET_LOADING", key: "postOffice", value: false });
      }

      // Step 4: Unions + Municipalities (শুধু real upazilaId থাকলে)
      if (!upazilaId) return;
      const unionMunicipalityId = unionParishadId || municipalityId || "";

      dispatch({ type: "SET_LOADING", key: "unionMunicipality", value: true });
      try {
        const data = await fetchDropdown({ divisionId, districtId, upazilaId });

        const rawUnions: Union[] = Array.isArray(data?.unionParishads)
          ? data.unionParishads
          : [];
        const rawMunicipalities: Municipality[] = Array.isArray(
          data?.municipalities,
        )
          ? data.municipalities
          : [];
        const merged: MergedUnionMunicipality[] = [
          ...rawUnions.map((u) => ({ ...u, type: "UNION" as const })),
          ...rawMunicipalities.map((m) => ({
            ...m,
            type: "MUNICIPALITY" as const,
          })),
        ];
        dispatch({ type: "SET_UNIONS_MUNICIPALITIES", payload: merged });

        if (unionMunicipalityId) {
          setField("unionMunicipalityId", unionMunicipalityId);
          const found = merged.find(
            (u) => String(u.id) === String(unionMunicipalityId),
          );
          if (found?.type === "UNION") {
            setField("unionParishadId", unionMunicipalityId);
            setField("municipalityId", "");
          } else if (found?.type === "MUNICIPALITY") {
            setField("municipalityId", unionMunicipalityId);
            setField("unionParishadId", "");
          }
        }
      } finally {
        dispatch({
          type: "SET_LOADING",
          key: "unionMunicipality",
          value: false,
        });
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  // ─── MANUAL: Division change → districts ─────────────────────────────────
  useEffect(() => {
    if (initialValues?.divisionId && !prefillDone.current) return;

    if (!watchedDivisionId) {
      dispatch({ type: "SET_DISTRICTS", payload: [] });
      dispatch({ type: "SET_UPAZILAS", payload: [] });
      dispatch({ type: "SET_POLICE_STATIONS", payload: [] });
      dispatch({ type: "SET_POST_OFFICES", payload: [] });
      dispatch({ type: "SET_UNIONS_MUNICIPALITIES", payload: [] });
      return;
    }

    const load = async () => {
      dispatch({ type: "SET_LOADING", key: "district", value: true });
      try {
        const data = await fetchDropdown({ divisionId: watchedDivisionId });
        dispatch({
          type: "SET_DISTRICTS",
          payload: sortBy(data?.data ?? [], "name"),
        });
      } finally {
        dispatch({ type: "SET_LOADING", key: "district", value: false });
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedDivisionId]);

  // ─── MANUAL: District change → upazilas + police + postOffices ───────────
  useEffect(() => {
    if (initialValues?.divisionId && !prefillDone.current) return;

    if (!watchedDivisionId || !watchedDistrictId) {
      dispatch({ type: "SET_UPAZILAS", payload: [] });
      dispatch({ type: "SET_POLICE_STATIONS", payload: [] });
      dispatch({ type: "SET_POST_OFFICES", payload: [] });
      dispatch({ type: "SET_UNIONS_MUNICIPALITIES", payload: [] });
      return;
    }

    const load = async () => {
      dispatch({ type: "SET_LOADING", key: "upazila", value: true });
      dispatch({ type: "SET_LOADING", key: "policeStation", value: true });
      dispatch({ type: "SET_LOADING", key: "postOffice", value: true });
      try {
        const { mergedUpazilas, sortedPolice, sortedPostOffices } =
          await fetchDistrictData(watchedDivisionId, watchedDistrictId);
        dispatch({
          type: "SET_DISTRICT_DATA",
          upazilas: mergedUpazilas,
          policeStations: sortedPolice,
          postOffices: sortedPostOffices,
        });
      } finally {
        dispatch({ type: "SET_LOADING", key: "upazila", value: false });
        dispatch({ type: "SET_LOADING", key: "policeStation", value: false });
        dispatch({ type: "SET_LOADING", key: "postOffice", value: false });
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedDistrictId]);

  // ─── MANUAL: Upazila change → unions + municipalities ────────────────────
  useEffect(() => {
    if (initialValues?.upazilaId && !prefillDone.current) return;

    if (!watchedDivisionId || !watchedDistrictId || !watchedUpazilaId) {
      dispatch({ type: "SET_UNIONS_MUNICIPALITIES", payload: [] });
      return;
    }

    const load = async () => {
      dispatch({ type: "SET_LOADING", key: "unionMunicipality", value: true });
      try {
        const data = await fetchDropdown({
          divisionId: watchedDivisionId,
          districtId: watchedDistrictId,
          upazilaId: watchedUpazilaId,
        });

        const rawUnions: Union[] = Array.isArray(data?.unionParishads)
          ? data.unionParishads
          : [];
        const rawMunicipalities: Municipality[] = Array.isArray(
          data?.municipalities,
        )
          ? data.municipalities
          : [];
        const merged: MergedUnionMunicipality[] = [
          ...rawUnions.map((u) => ({ ...u, type: "UNION" as const })),
          ...rawMunicipalities.map((m) => ({
            ...m,
            type: "MUNICIPALITY" as const,
          })),
        ];
        dispatch({ type: "SET_UNIONS_MUNICIPALITIES", payload: merged });
      } finally {
        dispatch({
          type: "SET_LOADING",
          key: "unionMunicipality",
          value: false,
        });
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedUpazilaId]);

  // ─── Initial divisions load (empty form, no initialValues) ───────────────
  useEffect(() => {
    if (initialValues?.divisionId) return;

    const load = async () => {
      dispatch({ type: "SET_LOADING", key: "division", value: true });
      try {
        const data = await fetchDropdown({});
        dispatch({
          type: "SET_DIVISIONS",
          payload: sortBy(data?.data ?? [], "name"),
        });
      } finally {
        dispatch({ type: "SET_LOADING", key: "division", value: false });
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    divisions: state.divisions,
    districts: state.districts,
    upazilas: state.upazilas,
    policeStations: state.policeStations,
    postOffices: state.postOffices,
    unionsMunicipalities: state.unionsMunicipalities,
    loadingDivision: state.loading.division,
    loadingDistrict: state.loading.district,
    loadingUpazila: state.loading.upazila,
    loadingPoliceStation: state.loading.policeStation,
    loadingPostOffice: state.loading.postOffice,
    loadingUnionMunicipality: state.loading.unionMunicipality,
  };
};
