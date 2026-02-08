"use client";

import { cn } from "@/lib/utils";

import React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AchievementInfoFormValues } from "@/schemas/achievement.schema";
import {
  Building2,
  Globe,
  MapPin,
  TextInitial,
  Trash2,
  Upload,
} from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
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
  { label: "Professional Certification", value: "First Division/Class" },
  { label: "Training", value: "Second Division/Class" },
];

// Generate year options from current year back to 1970
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [certificateError, setCertificateError] = useState<string | null>(null);

  // Read Zod validation errors from form state (set on submit)
  const zodCertificateError = form.formState.errors?.achievements?.[index]
    ?.certificate?.message as string | undefined;
  // Show local error (from handleFileChange) or Zod error (from form submit)
  const displayError = certificateError || zodCertificateError || null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file.type)) {
        setCertificateError("Only .jpeg, .jpg, and .png files are accepted");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      // Validate file size
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setCertificateError("Max file size is 5MB");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      // Clear previous errors and set value
      setCertificateError(null);
      form.setValue(`achievements.${index}.certificate`, file, {
        shouldValidate: true,
        shouldDirty: true,
      });
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    form.setValue(`achievements.${index}.certificate`, undefined, {
      shouldValidate: true,
    });
    setPreview(null);
    setCertificateError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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
          name={`achievements.${index}.achievementType`}
          label="Achievement Type"
          placeholder="Select achievement type"
          options={acheievementsTypeOptions}
          required
        />

        <TextInput
          form={form}
          name={`achievements.${index}.title`}
          label="Title "
          placeholder="Enter Title"
          required
        />

        <TextInput
          form={form}
          name={`achievements.${index}.organization`}
          label="Organization Name "
          placeholder="Enter organization name"
          required
          icon={<Building2 className="size-5" />}
        />

        <TextInput
          form={form}
          name={`achievements.${index}.website`}
          label="Website "
          placeholder="Enter Website"
          icon={<Globe className="size-5" />}
        />

        <TextInput
          form={form}
          name={`achievements.${index}.location`}
          label="Location "
          placeholder="Enter Location"
          required
          icon={<MapPin className="size-5" />}
        />

        {/* Year of Passing */}
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
            className="h-40! text-base!"
            label="Description of Achievements"
            placeholder="Tell us about job responsibilities"
            required
            icon={<TextInitial />}
          />
        </div>

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
                JPEG, JPG, PNG (Max 5MB)
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
          </div>
          {displayError && (
            <p className="text-destructive text-[0.8rem] font-medium">
              {displayError}
            </p>
          )}
        </div>
      </div>

      {preview && (
        <div className="mt-4">
          <div className="relative h-auto w-40 text-center">
            <div>
              <Image
                src={preview || "/placeholder.svg"}
                alt="Certificate preview"
                width={32}
                height={32}
                className="relative mx-auto h-auto w-40 rounded border object-cover p-1"
                unoptimized
              />
            </div>
            <Button
              onClick={removeFile}
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-600/80 p-1 hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4 text-white" />
            </Button>
          </div>
          <p className="text-dark-blue-800 mt-3 text-sm font-bold">
            {form.getValues(`achievements.${index}.certificate`)?.name ||
              "Certificate"}
          </p>
        </div>
      )}
    </div>
  );
}
