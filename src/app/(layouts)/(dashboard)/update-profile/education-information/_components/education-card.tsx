"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEducationDropdown } from "@/hooks/useEducationDropdown";
import { cn } from "@/lib/utils";
import { yearOptions } from "@/lib/year-options";
import { EducationInfoFormValues } from "@/schemas/education.schema";
import { Trash2, Upload } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import {
  SelectInput,
  SelectOption,
  TextInput,
} from "../../_components/form-inputs";

interface EducationCardProps {
  index: number;
  form: UseFormReturn<EducationInfoFormValues>;
  onRemove: () => void;
  canRemove: boolean;
  existingCertificateUrl?: string; // kept for initial preview seed from parent
}

export default function EducationCard({
  index,
  form,
  onRemove,
  canRemove,
  existingCertificateUrl,
}: EducationCardProps) {
  const [mounted, setMounted] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [certificateError, setCertificateError] = useState<string | null>(null);
  const prevLevelId = useRef<string>("");
  const prevDegreeId = useRef<string>("");

  // ── Watched field values ────────────────────────────────────────────────────
  const watchedLevelId = form.watch(`educations.${index}.levelOfEducationId`);
  const watchedDegreeId = form.watch(`educations.${index}.degreeNameId`);
  const watchedResultTypeId = form.watch(`educations.${index}.resultTypeId`);
  // ✅ Watch existingCertificateUrl directly from form state so it stays in sync
  // with what the parent stored via form.reset(). This is the source of truth
  // for whether an old server-side certificate is still in play.
  const watchedExistingUrl = form.watch(
    `educations.${index}.existingCertificateUrl`,
  );

  // ── API-driven dropdown data via hook ───────────────────────────────────────
  const {
    levels,
    degrees,
    educationMeta,
    loadingLevel,
    loadingDegree,
    loadingMeta,
  } = useEducationDropdown(
    watchedLevelId,
    watchedDegreeId,
    `educations.${index}`,
    form,
  );

  // ── Derived display state ───────────────────────────────────────────────────
  const selectedLevel = levels.find((l) => l.id === watchedLevelId);
  const isSSCorHS = selectedLevel
    ? ["Secondary", "Higher Secondary"].includes(selectedLevel.levelName)
    : false;

  const selectedResultType = educationMeta?.resultTypes.find(
    (r) => r.id === watchedResultTypeId,
  );
  const isAppearedOrPass =
    selectedResultType?.resultType === "Pass" ||
    selectedResultType?.resultType === "Appeared";
  const hideTotalMarks = isAppearedOrPass;

  // ── Build SelectOption arrays from hook data ────────────────────────────────
  const levelOptions: SelectOption[] = levels.map((l) => ({
    label: l.levelName,
    value: l.id,
  }));

  const degreeOptions: SelectOption[] = degrees.map((d) => ({
    label: d.degreeName,
    value: d.id,
  }));

  const boardOptions: SelectOption[] = (educationMeta?.boards ?? []).map(
    (b) => ({
      label: b.boardName,
      value: b.id,
    }),
  );

  const majorGroupOptions: SelectOption[] = (
    educationMeta?.majorGroups ?? []
  ).map((g) => ({
    label: g.groupName,
    value: g.id,
  }));

  const resultTypeOptions: SelectOption[] = (
    educationMeta?.resultTypes ?? []
  ).map((r) => ({
    label: r.resultType,
    value: r.id,
  }));

  // ── Zod / local certificate error ──────────────────────────────────────────
  const zodCertificateError = form.formState.errors?.educations?.[index]
    ?.certificate?.message as string | undefined;
  const displayError = certificateError || zodCertificateError || null;

  // ── Side effects ───────────────────────────────────────────────────────────
  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ Build the initial preview from the existing URL when the card first mounts
  // or when the parent re-seeds existingCertificateUrl (e.g. after form.reset).
  // We only set the preview here — we never clear it from this effect so that
  // a newly uploaded file's preview is not accidentally overwritten.
  useEffect(() => {
    const url = watchedExistingUrl ?? existingCertificateUrl;
    if (url && !preview) {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";
      const fullUrl = url.startsWith("http") ? url : `${baseUrl}/${url}`;
      setPreview(fullUrl);
    }
  }, [watchedExistingUrl, existingCertificateUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  // ✅ Sync the resolved level name into the hidden `levelName` field so the
  // Zod schema can compare names instead of opaque IDs.
  useEffect(() => {
    const name = selectedLevel?.levelName ?? "";
    form.setValue(`educations.${index}.levelName`, name, {
      shouldValidate: false,
    });
  }, [selectedLevel?.levelName]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset dependent fields only when the user actively changes the level
  useEffect(() => {
    const prev = prevLevelId.current;
    prevLevelId.current = watchedLevelId;

    if (!prev || prev === watchedLevelId) return;

    form.setValue(`educations.${index}.degreeNameId`, "");
    form.setValue(`educations.${index}.educationBoardId`, "");
    form.setValue(`educations.${index}.majorGroupId`, "");
    form.setValue(`educations.${index}.resultTypeId`, "");
    form.setValue(`educations.${index}.totalMarksCGPA`, "");

    if (!isSSCorHS) {
      form.setValue(`educations.${index}.subjectName`, "");
      form.clearErrors(`educations.${index}.subjectName`);
      form.clearErrors(`educations.${index}.educationBoardId`);
    }
  }, [watchedLevelId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset downstream fields only when the user actively changes the degree
  useEffect(() => {
    const prev = prevDegreeId.current;
    prevDegreeId.current = watchedDegreeId;

    if (!prev || prev === watchedDegreeId) return;

    if (!isSSCorHS) {
      form.setValue(`educations.${index}.educationBoardId`, "");
    }
    form.setValue(`educations.${index}.majorGroupId`, "");
    form.setValue(`educations.${index}.resultTypeId`, "");
    form.setValue(`educations.${index}.totalMarksCGPA`, "");
  }, [watchedDegreeId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Clear totalMarksCGPA when result type hides the field
  useEffect(() => {
    if (hideTotalMarks) {
      form.setValue(`educations.${index}.totalMarksCGPA`, "", {
        shouldValidate: false,
      });
      form.clearErrors(`educations.${index}.totalMarksCGPA`);
    }
  }, [hideTotalMarks]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── File handling ──────────────────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      setCertificateError("Only .jpeg, .jpg, and .png files are accepted");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const MAX_SIZE = 500 * 1024;
    if (file.size > MAX_SIZE) {
      setCertificateError("Max file size is 500KB");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setCertificateError(null);

    // ✅ Store the new File in the form so onSubmit can append it as
    // `certificate_<index>` to FormData.
    form.setValue(`educations.${index}.certificate`, file, {
      shouldValidate: true,
      shouldDirty: true,
    });

    // ✅ When a new file is chosen we no longer need the old server path —
    // clear it so the backend knows to use the newly uploaded file instead.
    form.setValue(`educations.${index}.existingCertificateUrl`, "", {
      shouldValidate: false,
    });

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeFile = () => {
    // ✅ Clear the new file from the form
    form.setValue(`educations.${index}.certificate`, undefined, {
      shouldValidate: true,
    });

    // ✅ Also clear the existing server-side URL so the Zod schema correctly
    // surfaces a "Certificate is required" error — the user has explicitly
    // removed both the new file and the old one.
    form.setValue(`educations.${index}.existingCertificateUrl`, "", {
      shouldValidate: true,
    });

    setPreview(null);
    setCertificateError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="border-border bg-card relative rounded-lg border p-5 md:p-6">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-dark-blue-700 mb-1 text-lg font-bold xl:text-2xl">
          Education - {index + 1}
        </h1>
        {canRemove && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-red-600 text-sm font-semibold text-red-600! hover:bg-red-600 focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            onClick={onRemove}
          >
            <Trash2 className="mr-1 h-4 w-4" />
            Remove
          </Button>
        )}
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Level of Education */}
        <SelectInput
          form={form}
          name={`educations.${index}.levelOfEducationId`}
          label="Level of Education"
          placeholder={loadingLevel ? "Loading…" : "Select level"}
          options={levelOptions}
          required
          disabled={loadingLevel}
        />

        {/* Degree Name */}
        <SelectInput
          form={form}
          name={`educations.${index}.degreeNameId`}
          label="Degree Name"
          placeholder={loadingDegree ? "Loading…" : "Select degree"}
          options={degreeOptions}
          required
          disabled={!watchedLevelId || loadingDegree}
        />

        {/* Education Board — only shown for Secondary / Higher Secondary */}
        {isSSCorHS && (
          <SelectInput
            form={form}
            name={`educations.${index}.educationBoardId`}
            label="Education Board"
            placeholder={loadingMeta ? "Loading…" : "Select board"}
            options={boardOptions}
            required
            disabled={loadingMeta}
          />
        )}

        {/* Major / Group */}
        <SelectInput
          form={form}
          name={`educations.${index}.majorGroupId`}
          label="Major/Group"
          placeholder={loadingMeta ? "Loading…" : "Select major/group"}
          options={majorGroupOptions}
          required
          disabled={!watchedDegreeId || loadingMeta}
        />

        {/* Subject Name — required for non-SSC/HSC levels */}
        {!isSSCorHS && (
          <TextInput
            form={form}
            name={`educations.${index}.subjectName`}
            label="Subject Name"
            placeholder="Enter subject name"
            required
          />
        )}

        {/* Institute Name */}
        <TextInput
          form={form}
          name={`educations.${index}.instituteName`}
          label="Institute Name"
          placeholder="Enter institute name"
          required
        />

        {/* Result Type */}
        <SelectInput
          form={form}
          name={`educations.${index}.resultTypeId`}
          label="Result Type"
          placeholder={loadingMeta ? "Loading…" : "Select result type"}
          options={resultTypeOptions}
          required
          disabled={!watchedDegreeId || loadingMeta}
        />

        {/* Total Marks / CGPA — hidden for Appeared / Pass */}
        {mounted && !hideTotalMarks && (
          <TextInput
            form={form}
            name={`educations.${index}.totalMarksCGPA`}
            label={
              selectedResultType?.resultType === "Grade"
                ? "GPA/CGPA"
                : "Total Marks (%)"
            }
            placeholder={
              selectedResultType?.resultType === "Grade"
                ? "Enter GPA/CGPA"
                : "Enter Total Marks"
            }
            required
          />
        )}

        {/* Year of Passing */}
        <SelectInput
          form={form}
          name={`educations.${index}.yearOfPassing`}
          label="Year of Passing"
          placeholder="Select year"
          options={yearOptions}
          required
        />

        {/* Certificate Upload */}
        <div className="flex flex-col gap-2">
          <Label className="mb-0! gap-1 text-base font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Certificate Upload
            <span className="text-destructive">*</span>
          </Label>
          <div className="mt-0">
            <Label
              htmlFor={`certificate-${index}`}
              className={cn(
                "flex h-10 cursor-pointer items-center gap-2 rounded-sm border px-3 transition-colors max-sm:h-11",
                displayError
                  ? "border-destructive bg-destructive/5"
                  : "bg-card hover:border-foreground/40 border-[#D0D5DD]",
              )}
            >
              <Upload className="text-muted-foreground h-4 w-4" />
              <span className="text-muted-foreground text-sm">
                {/* ✅ Show a hint when an existing certificate is already on file */}
                {watchedExistingUrl && !preview?.startsWith("data:")
                  ? "Replace certificate (optional)"
                  : "JPEG, JPG, PNG (Max 500KB)"}
              </span>
              <Input
                ref={fileInputRef}
                name={`educations.${index}.certificate`}
                id={`certificate-${index}`}
                type="file"
                accept=".jpeg,.jpg,.png"
                className="hidden"
                onChange={handleFileChange}
              />
            </Label>
          </div>
          {displayError && (
            <p className="text-destructive text-[0.8rem] font-medium">
              {displayError}
            </p>
          )}
        </div>
      </div>

      {/* Certificate Preview */}
      {preview && (
        <div className="mt-4">
          <div className="relative h-auto w-40 text-center">
            <Image
              src={preview}
              alt="Certificate preview"
              width={160}
              height={160}
              className="relative mx-auto h-auto w-40 rounded border object-cover p-1"
              unoptimized
            />
            <Button
              type="button"
              onClick={removeFile}
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-600/80 p-1 hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4 text-white" />
            </Button>
          </div>
          <p className="text-dark-blue-800 mt-3 text-sm font-bold">
            {/* ✅ Show the actual filename for new uploads, or a label for existing ones */}
            {form.getValues(`educations.${index}.certificate`) instanceof File
              ? (form.getValues(`educations.${index}.certificate`) as File).name
              : "Existing Certificate"}
          </p>
        </div>
      )}
    </div>
  );
}
