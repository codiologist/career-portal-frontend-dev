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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  // ───────────────────────── LOAD LEVELS (সবসময় একবার) ─────────────────────────
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoadingLevel(true);
      try {
        const data = await fetchEducationDropdown({});
        if (!cancelled) setLevels(data?.data || []);
      } finally {
        if (!cancelled) setLoadingLevel(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  // ───────────────────────── PREFILL FLOW ─────────────────────────
  useEffect(() => {
    if (!initialValues?.levelId || !form || !prefix) return;
    if (prefillDone.current) return;
    prefillDone.current = true;

    let cancelled = false;

    const run = async () => {
      const { levelId, degreeId } = initialValues;

      // Level setValue — levels লোড Effect 1 থেকেই হচ্ছে
      form.setValue(`${prefix}.levelId`, levelId, { shouldDirty: true });

      if (!degreeId) return;

      // Degrees এবং Meta একসাথে parallel fetch
      setLoadingDegree(true);
      setLoadingMeta(true);

      try {
        const [degreesData, metaData] = await Promise.all([
          fetchEducationDropdown({ levelId }),
          fetchEducationDropdown({ degreeId }),
        ]);

        if (cancelled) return;

        setDegrees(degreesData?.data || []);
        form.setValue(`${prefix}.degreeId`, degreeId, { shouldDirty: true });
        setEducationMeta(metaData?.data || null);
      } finally {
        if (!cancelled) {
          setLoadingDegree(false);
          setLoadingMeta(false);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [initialValues]); // eslint-disable-line react-hooks/exhaustive-deps

  // ───────────────────────── LOAD DEGREES (user interaction) ─────────────────────────
  useEffect(() => {
    if (!watchedLevelId) {
      setDegrees([]);
      return;
    }

    // Prefill flow ইতিমধ্যে handle করেছে, skip করো
    if (prefillDone.current) return;

    let cancelled = false;

    const load = async () => {
      setLoadingDegree(true);
      try {
        const data = await fetchEducationDropdown({ levelId: watchedLevelId });
        if (!cancelled) setDegrees(data?.data || []);
      } finally {
        if (!cancelled) setLoadingDegree(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [watchedLevelId]);

  // ───────────────────────── LOAD META (user interaction) ─────────────────────────
  useEffect(() => {
    if (!watchedDegreeId) {
      setEducationMeta(null);
      return;
    }

    // Prefill flow ইতিমধ্যে handle করেছে, skip করো
    if (prefillDone.current) return;

    let cancelled = false;

    const load = async () => {
      setLoadingMeta(true);
      try {
        const data = await fetchEducationDropdown({
          degreeId: watchedDegreeId,
        });
        if (!cancelled) setEducationMeta(data?.data || null);
      } finally {
        if (!cancelled) setLoadingMeta(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
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
