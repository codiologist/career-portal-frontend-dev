"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AchievementInfoFormValues } from "@/schemas/achievement.schema";

import {
  Award,
  Building2,
  Globe,
  MapPin,
  TextInitial,
  Trash2,
  Upload,
} from "lucide-react";

import Image from "next/image";
import type { UseFormReturn } from "react-hook-form";

import {
  SelectInput,
  SelectOption,
  TextAreaInput,
  TextInput,
} from "../../_components/form-inputs";

interface AchievementCardProps {
  index: number;
  form: UseFormReturn<AchievementInfoFormValues>;
  onRemove: () => void;
  canRemove: boolean;
}

const acheievementsTypeOptions: SelectOption[] = [
  { label: "Professional Certification", value: "PROFESSIONAL_CERTIFICATION" },
  { label: "Training", value: "TRAINING" },
];

const currentYear = new Date().getFullYear();
const yearOptions: SelectOption[] = Array.from(
  { length: currentYear - 1970 + 1 },
  (_, i) => {
    const year = (currentYear - i).toString();
    return { label: year, value: year };
  },
);

export default function AchievementTrainingCard({
  index,
  form,
  onRemove,
  canRemove,
}: AchievementCardProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [certificateError, setCertificateError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Register the file field so react-hook-form tracks it
  useEffect(() => {
    form.register(`achievements.${index}.certificate`);
  }, [form, index]);

  // When the form is populated from the API (editing mode), show the saved
  // certificate as the initial preview so the user knows a file already exists.
  useEffect(() => {
    const existingUrl = form.getValues(
      `achievements.${index}.existingCertificateUrl`,
    );
    if (existingUrl && !preview) {
      // Compose the full URL; if the path is already absolute, use it as-is.
      const fullUrl = existingUrl.startsWith("http")
        ? existingUrl
        : `${process.env.NEXT_PUBLIC_API_URL}/${existingUrl}`;
      setPreview(fullUrl);
      console.log(fullUrl);
    }
    // Only run once when the field value is first available
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.getValues(`achievements.${index}.existingCertificateUrl`)]);

  const zodCertificateError = form.formState.errors?.achievements?.[index]
    ?.certificate?.message as string | undefined;

  const displayError = certificateError || zodCertificateError || null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    const maxSize = 5 * 1024 * 1024;

    if (!validTypes.includes(file.type)) {
      setCertificateError("Only .jpeg, .jpg, and .png files are accepted");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > maxSize) {
      setCertificateError("Max file size is 5MB");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setCertificateError(null);

    form.setValue(`achievements.${index}.certificate`, file, {
      shouldValidate: true,
      shouldDirty: true,
    });

    // Clear the existing URL so the schema knows a new file replaces it
    form.setValue(`achievements.${index}.existingCertificateUrl`, undefined);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeFile = () => {
    form.setValue(`achievements.${index}.certificate`, undefined, {
      shouldValidate: true,
      shouldDirty: true,
    });

    // Also clear the saved URL so the schema re-enforces the required check
    form.setValue(`achievements.${index}.existingCertificateUrl`, undefined, {
      shouldValidate: true,
    });

    form.clearErrors(`achievements.${index}.certificate`);

    setPreview(null);
    setCertificateError(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Derive the display name for the preview footer
  const newFile = form.getValues(`achievements.${index}.certificate`);
  const existingUrl = form.getValues(
    `achievements.${index}.existingCertificateUrl`,
  );
  const previewLabel =
    newFile instanceof File
      ? newFile.name
      : existingUrl
        ? existingUrl.split("/").pop()
        : "Certificate";

  return (
    <div className="border-border bg-card relative rounded-lg border p-5 md:p-6">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-dark-blue-700 mb-1 text-lg font-bold xl:text-2xl">
          Achievement - {index + 1}
        </h1>
        {canRemove && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-red-600 text-sm font-semibold text-red-600 hover:bg-red-600 hover:text-white"
            onClick={onRemove}
          >
            <Trash2 className="mr-1 h-4 w-4" />
            Remove
          </Button>
        )}
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 lg:grid-cols-3">
        <SelectInput
          form={form}
          name={`achievements.${index}.achievementType`}
          label="Achievement Type"
          placeholder="Select achievement type"
          options={acheievementsTypeOptions}
          required
        />

        <TextInput
          form={form}
          name={`achievements.${index}.title`}
          label="Title"
          placeholder="e.g. Node.js Certification"
          required
          icon={<Award className="size-5" />}
        />

        <TextInput
          form={form}
          name={`achievements.${index}.organizationName`}
          label="Organization Name"
          placeholder="Coursera"
          required
          icon={<Building2 className="size-5" />}
        />

        <TextInput
          form={form}
          name={`achievements.${index}.url`}
          label="Website"
          placeholder="https://example.com"
          icon={<Globe className="size-5" />}
        />

        <TextInput
          form={form}
          name={`achievements.${index}.location`}
          label="Location"
          placeholder="Online"
          required
          icon={<MapPin className="size-5" />}
        />

        <SelectInput
          form={form}
          name={`achievements.${index}.year`}
          label="Year"
          placeholder="Select year"
          options={yearOptions}
          required
        />

        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <TextAreaInput
            form={form}
            name={`achievements.${index}.description`}
            className="h-40"
            label="Description"
            placeholder="Short details"
            required
            icon={<TextInitial />}
          />
        </div>

        {/* Upload */}
        <div className="flex flex-col gap-2">
          <Label className="text-base font-medium">
            Certificate Upload{" "}
            {/* Mark as required only when no existing certificate is saved */}
            {!existingUrl && <span className="text-destructive">*</span>}
          </Label>

          <Label
            htmlFor={`certificate-${index}`}
            className={cn(
              "flex h-10 cursor-pointer items-center gap-2 rounded-sm border px-3",
              displayError
                ? "border-destructive bg-destructive/5"
                : "hover:border-foreground/40 border-[#D0D5DD]",
            )}
          >
            <Upload className="h-4 w-4" />
            <span className="text-sm">
              {existingUrl && !(newFile instanceof File)
                ? "Replace certificate (JPEG, JPG, PNG)"
                : "JPEG, JPG, PNG (Max 5MB)"}
            </span>
            <Input
              ref={fileInputRef}
              id={`certificate-${index}`}
              type="file"
              accept=".jpeg,.jpg,.png"
              className="hidden"
              onChange={handleFileChange}
            />
          </Label>

          {displayError && (
            <p className="text-destructive text-sm">{displayError}</p>
          )}
        </div>
      </div>

      {/* Preview — shown for both newly uploaded files and existing documents */}
      {preview && (
        <div className="mt-4">
          <div className="relative w-40">
            <Image
              src={preview}
              alt="Certificate preview"
              width={160}
              height={120}
              className="rounded border object-cover"
              unoptimized
            />
            <Button
              type="button"
              onClick={removeFile}
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-600 p-1"
            >
              <Trash2 className="h-4 w-4 text-white" />
            </Button>
          </div>

          <p className="mt-2 text-sm font-semibold">{previewLabel}</p>
        </div>
      )}
    </div>
  );
}
