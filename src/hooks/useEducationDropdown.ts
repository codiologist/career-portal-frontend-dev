"use client";

import api from "@/lib/axiosInstance";
import { useEffect, useRef, useState } from "react";
import type { UseFormReturn } from "react-hook-form";

import type {
  EducationDegree,
  EducationLevel,
  EducationMeta,
} from "@/types/education-dropdown-types";

interface InitialEducationValues {
  levelId?: string;
  degreeId?: string;
}

interface FetchParams {
  levelId?: string;
  degreeId?: string;
}

const fetchEducationDropdown = async (params: FetchParams) => {
  const query = new URLSearchParams();

  if (params.levelId) query.append("levelId", params.levelId);
  if (params.degreeId) query.append("degreeId", params.degreeId);

  const res = await api.get(
    `/user/profile/education/dropdown?${query.toString()}`,
  );

  return res.data.data;
};

export const useEducationDropdown = (
  watchedLevelId?: string,
  watchedDegreeId?: string,
  prefix?: string,
  form?: UseFormReturn<any>,
  initialValues?: InitialEducationValues,
) => {
  const [levels, setLevels] = useState<EducationLevel[]>([]);
  const [degrees, setDegrees] = useState<EducationDegree[]>([]);
  const [educationMeta, setEducationMeta] = useState<EducationMeta | null>(
    null,
  );

  const [loadingLevel, setLoadingLevel] = useState(false);
  const [loadingDegree, setLoadingDegree] = useState(false);
  const [loadingMeta, setLoadingMeta] = useState(false);

  const prefillDone = useRef(false);

  // ───────────────────────── PREFILL FLOW ─────────────────────────
  useEffect(() => {
    if (!initialValues?.levelId || !form || !prefix) return;
    if (prefillDone.current) return;
    prefillDone.current = true;

    const run = async () => {
      const { levelId, degreeId } = initialValues;

      // Step 1: Load Levels
      setLoadingLevel(true);
      try {
        const data = await fetchEducationDropdown({});
        setLevels(data?.data || []);
        form.setValue(`${prefix}.levelId`, levelId, { shouldDirty: true });
      } finally {
        setLoadingLevel(false);
      }

      if (!degreeId) return;

      // Step 2: Load Degrees
      setLoadingDegree(true);
      try {
        const data = await fetchEducationDropdown({ levelId });
        setDegrees(data?.data || []);
        form.setValue(`${prefix}.degreeId`, degreeId, { shouldDirty: true });
      } finally {
        setLoadingDegree(false);
      }

      // Step 3: Load Meta
      setLoadingMeta(true);
      try {
        const data = await fetchEducationDropdown({ degreeId });
        setEducationMeta(data?.data || null);
      } finally {
        setLoadingMeta(false);
      }
    };

    run();
  }, [initialValues]);

  // ───────────────────────── LOAD LEVELS ─────────────────────────
  useEffect(() => {
    if (initialValues?.levelId) return;

    const load = async () => {
      setLoadingLevel(true);
      try {
        const data = await fetchEducationDropdown({});
        setLevels(data?.data || []);
      } finally {
        setLoadingLevel(false);
      }
    };

    load();
  }, []);

  // ───────────────────────── LOAD DEGREES ─────────────────────────
  useEffect(() => {
    if (!watchedLevelId) {
      setDegrees([]);
      return;
    }

    const load = async () => {
      setLoadingDegree(true);
      try {
        const data = await fetchEducationDropdown({ levelId: watchedLevelId });
        setDegrees(data?.data || []);
      } finally {
        setLoadingDegree(false);
      }
    };

    load();
  }, [watchedLevelId]);

  // ───────────────────────── LOAD META ─────────────────────────
  useEffect(() => {
    if (!watchedDegreeId) {
      setEducationMeta(null);
      return;
    }

    const load = async () => {
      setLoadingMeta(true);
      try {
        const data = await fetchEducationDropdown({
          degreeId: watchedDegreeId,
        });
        setEducationMeta(data?.data || null);
      } finally {
        setLoadingMeta(false);
      }
    };

    load();
  }, [watchedDegreeId]);

  return {
    levels,
    degrees,
    educationMeta,
    loadingLevel,
    loadingDegree,
    loadingMeta,
  };
};
