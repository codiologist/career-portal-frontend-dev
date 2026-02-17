"use client";

import api from "@/lib/axiosInstance";
import type {
  CityCorporation,
  District,
  Division,
  Municipality,
  PoliceStation,
  PostOffice,
  Union,
  Upazila,
} from "@/types/address-types";
import { useEffect, useRef, useState } from "react";
import type { UseFormReturn } from "react-hook-form";

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

interface FetchParams {
  divisionId?: string;
  districtId?: string;
  upazilaId?: string;
}

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

export const useAddressDropdown = (
  // From form.watch() — drives manual user interaction cascades
  watchedDivisionId?: string,
  watchedDistrictId?: string,
  watchedUpazilaId?: string,
  // For pre-fill
  prefix?: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form?: UseFormReturn<any>,
  initialValues?: AddressInitialValues,
) => {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [upazilas, setUpazilas] = useState<(Upazila & { type: string })[]>([]);
  const [policeStations, setPoliceStations] = useState<PoliceStation[]>([]);
  const [postOffices, setPostOffices] = useState<PostOffice[]>([]);
  const [unionsMunicipalities, setUnionsMunicipalities] = useState<
    (Union & { type: string })[]
  >([]);

  const [loadingDivision, setLoadingDivision] = useState(false);
  const [loadingDistrict, setLoadingDistrict] = useState(false);
  const [loadingUpazila, setLoadingUpazila] = useState(false);
  const [loadingPoliceStation, setLoadingPoliceStation] = useState(false);
  const [loadingPostOffice, setLoadingPostOffice] = useState(false);
  const [loadingUnionMunicipality, setLoadingUnionMunicipality] =
    useState(false);

  // Track whether we've already done the pre-fill sequence so we don't repeat it
  const prefillDone = useRef(false);

  // ─── PRE-FILL SEQUENCE ───────────────────────────────────────────────────────
  // Runs once when initialValues arrives. Fetches each tier sequentially,
  // sets the form field AFTER the list is loaded, then fetches the next tier.
  // This is the only safe way — all in one async chain, no prop/watch timing issues.
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

      // ── Step 1: Load divisions, set divisionId ──────────────────────────────
      setLoadingDivision(true);
      try {
        const data = await fetchDropdown({});
        const sorted = [...(data?.data || [])].sort((a, b) =>
          a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
        );
        setDivisions(sorted);
        form.setValue(`${prefix}.divisionId`, divisionId!, {
          shouldDirty: true,
        });
      } finally {
        setLoadingDivision(false);
      }

      if (!districtId) return;

      // ── Step 2: Load districts for this division, set districtId ───────────
      setLoadingDistrict(true);
      try {
        const data = await fetchDropdown({ divisionId });
        const sorted = [...(data?.data || [])].sort((a, b) =>
          a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
        );
        setDistricts(sorted);
        form.setValue(`${prefix}.districtId`, districtId, {
          shouldDirty: true,
        });
      } finally {
        setLoadingDistrict(false);
      }

      // ── Step 3: Load upazilas + police stations for this district ──────────
      const upazilaCityCorpId = upazilaId || cityCorporationId || "";

      setLoadingUpazila(true);
      setLoadingPoliceStation(true);
      try {
        const data = await fetchDropdown({ divisionId, districtId });

        const sortedUpazilas = [...(data?.upazilas || [])]
          .sort((a, b) =>
            a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
          )
          .map((u: Upazila) => ({ ...u, type: "UPAZILA" as const }));

        const cityCorporations = Array.isArray(data?.cityCorporations)
          ? data.cityCorporations.map((c: CityCorporation) => ({
              ...c,
              type: "CITY_CORPORATION" as const,
            }))
          : [];

        const mergedUpazilas = [...sortedUpazilas, ...cityCorporations];

        const sortedPolice = [...(data?.policeStations || [])].sort((a, b) =>
          a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
        );

        setUpazilas(mergedUpazilas);
        setPoliceStations(sortedPolice);

        // Set the visible combo field
        if (upazilaCityCorpId) {
          form.setValue(`${prefix}.upazilaCityCorpId`, upazilaCityCorpId, {
            shouldDirty: true,
          });

          // Resolve split field from the freshly-loaded list
          const found = mergedUpazilas.find(
            (u) => String(u.id) === String(upazilaCityCorpId),
          );
          if (found?.type === "UPAZILA") {
            form.setValue(`${prefix}.upazilaId`, upazilaCityCorpId, {
              shouldDirty: true,
            });
            form.setValue(`${prefix}.cityCorporationId`, "");
          } else if (found?.type === "CITY_CORPORATION") {
            form.setValue(`${prefix}.cityCorporationId`, upazilaCityCorpId, {
              shouldDirty: true,
            });
            form.setValue(`${prefix}.upazilaId`, "");
          }
        }

        if (policeStationId) {
          form.setValue(`${prefix}.policeStationId`, policeStationId, {
            shouldDirty: true,
          });
        }
      } finally {
        setLoadingUpazila(false);
        setLoadingPoliceStation(false);
      }

      // ── Step 3b: Load post offices for this district ────────────────────────
      setLoadingPostOffice(true);
      try {
        const data = await fetchDropdown({ districtId });
        const sorted = [...(data?.postOffices || [])].sort((a, b) =>
          a.postOffice.localeCompare(b.postOffice, undefined, {
            sensitivity: "base",
          }),
        );
        setPostOffices(sorted);

        if (postOfficeId) {
          form.setValue(`${prefix}.postOfficeId`, postOfficeId, {
            shouldDirty: true,
          });
        }
      } finally {
        setLoadingPostOffice(false);
      }

      // ── Step 4: Load unions/municipalities (only if real upazilaId) ─────────
      const realUpazilaId = upazilaId || "";
      if (!realUpazilaId) return;

      const unionMunicipalityId = unionParishadId || municipalityId || "";

      setLoadingUnionMunicipality(true);
      try {
        const data = await fetchDropdown({
          divisionId,
          districtId,
          upazilaId: realUpazilaId,
        });

        const unions = Array.isArray(data?.unionParishads)
          ? data.unionParishads.map((u: Union) => ({
              ...u,
              type: "UNION" as const,
            }))
          : [];

        const municipalities = Array.isArray(data?.municipalities)
          ? data.municipalities.map((m: Municipality) => ({
              ...m,
              type: "MUNICIPALITY" as const,
            }))
          : [];

        const merged = [...unions, ...municipalities];
        setUnionsMunicipalities(merged);

        if (unionMunicipalityId) {
          form.setValue(`${prefix}.unionMunicipalityId`, unionMunicipalityId, {
            shouldDirty: true,
          });

          const found = merged.find(
            (u) => String(u.id) === String(unionMunicipalityId),
          );
          if (found?.type === "UNION") {
            form.setValue(`${prefix}.unionParishadId`, unionMunicipalityId, {
              shouldDirty: true,
            });
            form.setValue(`${prefix}.municipalityId`, "");
          } else if (found?.type === "MUNICIPALITY") {
            form.setValue(`${prefix}.municipalityId`, unionMunicipalityId, {
              shouldDirty: true,
            });
            form.setValue(`${prefix}.unionParishadId`, "");
          }
        }
      } finally {
        setLoadingUnionMunicipality(false);
      }
    };

    run();
    // Only re-run if initialValues reference changes (i.e. new user data loaded)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  // ─── MANUAL INTERACTION: Load divisions once on mount (for empty form) ───────
  // When there are no initialValues, we still need divisions for the user to pick
  useEffect(() => {
    if (initialValues?.divisionId) return; // pre-fill sequence handles this case
    const load = async () => {
      setLoadingDivision(true);
      try {
        const data = await fetchDropdown({});
        const sorted = [...(data?.data || [])].sort((a, b) =>
          a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
        );
        setDivisions(sorted);
      } finally {
        setLoadingDivision(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── MANUAL INTERACTION: Load districts when user picks a division ───────────
  useEffect(() => {
    if (!watchedDivisionId) {
      setDistricts([]);
      return;
    }
    if (initialValues?.divisionId && !prefillDone.current) return; // pre-fill handles it

    const load = async () => {
      setLoadingDistrict(true);
      try {
        const data = await fetchDropdown({ divisionId: watchedDivisionId });
        const sorted = [...(data?.data || [])].sort((a, b) =>
          a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
        );
        setDistricts(sorted);
      } finally {
        setLoadingDistrict(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedDivisionId]);

  // ─── MANUAL INTERACTION: Load upazilas + police when user picks a district ───
  useEffect(() => {
    if (!watchedDivisionId || !watchedDistrictId) {
      setUpazilas([]);
      setPoliceStations([]);
      return;
    }
    if (initialValues?.districtId && !prefillDone.current) return;

    const load = async () => {
      setLoadingUpazila(true);
      setLoadingPoliceStation(true);
      try {
        const data = await fetchDropdown({
          divisionId: watchedDivisionId,
          districtId: watchedDistrictId,
        });

        const sortedUpazilas = [...(data?.upazilas || [])]
          .sort((a, b) =>
            a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
          )
          .map((u: Upazila) => ({ ...u, type: "UPAZILA" as const }));

        const cityCorporations = Array.isArray(data?.cityCorporations)
          ? data.cityCorporations.map((c: CityCorporation) => ({
              ...c,
              type: "CITY_CORPORATION" as const,
            }))
          : [];

        const sortedPolice = [...(data?.policeStations || [])].sort((a, b) =>
          a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
        );

        setUpazilas([...sortedUpazilas, ...cityCorporations]);
        setPoliceStations(sortedPolice);
      } finally {
        setLoadingUpazila(false);
        setLoadingPoliceStation(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedDistrictId]);

  // ─── MANUAL INTERACTION: Load post offices when user picks a district ─────────
  useEffect(() => {
    if (!watchedDistrictId) {
      setPostOffices([]);
      return;
    }
    if (initialValues?.districtId && !prefillDone.current) return;

    const load = async () => {
      setLoadingPostOffice(true);
      try {
        const data = await fetchDropdown({ districtId: watchedDistrictId });
        const sorted = [...(data?.postOffices || [])].sort((a, b) =>
          a.postOffice.localeCompare(b.postOffice, undefined, {
            sensitivity: "base",
          }),
        );
        setPostOffices(sorted);
      } finally {
        setLoadingPostOffice(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedDistrictId]);

  // ─── MANUAL INTERACTION: Load unions when user picks an upazila ──────────────
  useEffect(() => {
    if (!watchedDivisionId || !watchedDistrictId || !watchedUpazilaId) {
      setUnionsMunicipalities([]);
      return;
    }
    if (initialValues?.upazilaId && !prefillDone.current) return;

    const load = async () => {
      setLoadingUnionMunicipality(true);
      try {
        const data = await fetchDropdown({
          divisionId: watchedDivisionId,
          districtId: watchedDistrictId,
          upazilaId: watchedUpazilaId,
        });

        const unions = Array.isArray(data?.unionParishads)
          ? data.unionParishads.map((u: Union) => ({
              ...u,
              type: "UNION" as const,
            }))
          : [];

        const municipalities = Array.isArray(data?.municipalities)
          ? data.municipalities.map((m: Municipality) => ({
              ...m,
              type: "MUNICIPALITY" as const,
            }))
          : [];

        setUnionsMunicipalities([...unions, ...municipalities]);
      } finally {
        setLoadingUnionMunicipality(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedUpazilaId]);

  return {
    divisions,
    districts,
    upazilas,
    policeStations,
    postOffices,
    unionsMunicipalities,
    loadingDivision,
    loadingDistrict,
    loadingUpazila,
    loadingPoliceStation,
    loadingPostOffice,
    loadingUnionMunicipality,
  };
};
