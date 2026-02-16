"use client";

import api from "@/lib/axiosInstance";
import {
  CityCorporation,
  District,
  Division,
  Municipality,
  PoliceStation,
  PostOffice,
  Union,
  Upazila,
} from "@/types/address-types";
import { useEffect, useState } from "react";

interface Params {
  divisionId?: string;
  districtId?: string;
  upazilaId?: string;
}

const fetchDropdown = async (params: Params) => {
  const query = new URLSearchParams();

  if (params.divisionId) query.append("divisionId", params.divisionId);
  if (params.districtId) query.append("districtId", params.districtId);
  if (params.upazilaId) query.append("upazilaId", params.upazilaId);

  const res = await api.get(
    `/user/profile/address/dropdown?${query.toString()}`,
  );

  console.log(res.data.data);
  return res.data.data;
};

export const useAddressDropdown = (
  divisionId?: string,
  districtId?: string,
  upazilaId?: string,
) => {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [upazilas, setUpazilas] = useState<Upazila[]>([]);
  const [policeStations, setPoliceStations] = useState<PoliceStation[]>([]);
  const [postOffices, setPostOffices] = useState<PostOffice[]>([]);
  const [unionsMunicipalities, setUnionsMunicipalities] = useState<Union[]>([]);

  const [loadingDivision, setLoadingDivision] = useState(false);
  const [loadingDistrict, setLoadingDistrict] = useState(false);
  const [loadingUpazila, setLoadingUpazila] = useState(false);
  const [loadingPoliceStation, setLoadingPoliceStation] = useState(false);
  const [loadingPostOffice, setLoadingPostOffice] = useState(false);
  const [loadingUnionMunicipality, setLoadingUnionMunicipality] =
    useState(false);

  // Load Divisions
  useEffect(() => {
    const load = async () => {
      setLoadingDivision(true);
      const data = await fetchDropdown({});

      const sortedData = [...(data?.data || [])].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
      );

      setDivisions(sortedData);
      setLoadingDivision(false);
    };

    load();
  }, []);

  // Load Districts
  useEffect(() => {
    if (!divisionId) return;

    const load = async () => {
      setLoadingDistrict(true);
      const data = await fetchDropdown({ divisionId });

      const sortedData = [...(data?.data || [])].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
      );

      setDistricts(sortedData || []);
      setLoadingDistrict(false);
    };
    load();
  }, [divisionId]);

  // Load Upazilas
  useEffect(() => {
    if (!divisionId || !districtId) return;

    const load = async () => {
      setLoadingUpazila(true);
      const data = await fetchDropdown({ divisionId, districtId });

      const sortedUpazilas = [...(data?.upazilas || [])]
        .sort((a, b) =>
          a.name.localeCompare(b.name, undefined, { sensitivity: "base" }),
        )
        .map((u: Upazila) => ({
          ...u,
          type: "UPAZILA",
        }));

      const cityCorporation = Array.isArray(data?.cityCorporations)
        ? data.cityCorporations.map((c: CityCorporation) => ({
            ...c,
            type: "CITY_CORPORATION",
          }))
        : [];

      const mergedUpazilasCityCorp = [...sortedUpazilas, ...cityCorporation];

      const sortedPoliceStations = [...(data?.policeStations || [])].sort(
        (a, b) =>
          a.name.localeCompare(b.name, undefined, {
            sensitivity: "base",
          }),
      );

      setUpazilas(mergedUpazilasCityCorp || []);
      setPoliceStations(sortedPoliceStations || []);
      setLoadingUpazila(false);
      setLoadingPoliceStation(false);
    };
    load();
  }, [districtId]);

  // Load Post Offices
  useEffect(() => {
    if (!districtId) return;

    const load = async () => {
      setLoadingPostOffice(true);
      const data = await fetchDropdown({
        districtId,
      });

      const sortedPostOffices = [...(data?.postOffices || [])].sort((a, b) =>
        a.postOffice.localeCompare(b.postOffice, undefined, {
          sensitivity: "base",
        }),
      );

      setPostOffices(sortedPostOffices || []);
      setLoadingPostOffice(false);
    };
    load();
  }, [districtId]);

  // Load Union Parishad / Munici
  useEffect(() => {
    if (!divisionId || !districtId || !upazilaId) return;

    const load = async () => {
      setLoadingUnionMunicipality(true);

      const data = await fetchDropdown({
        divisionId,
        districtId,
        upazilaId,
      });

      const unions = Array.isArray(data?.unionParishads)
        ? data.unionParishads.map((u: Union) => ({
            ...u,
            type: "UNION",
          }))
        : [];

      const municipalities = Array.isArray(data?.municipalities)
        ? data.municipalities.map((m: Municipality) => ({
            ...m,
            type: "MUNICIPALITY",
          }))
        : [];

      const merged = [...unions, ...municipalities];

      setUnionsMunicipalities(merged || []);

      setLoadingUnionMunicipality(false);
    };

    load();
  }, [upazilaId]);

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
