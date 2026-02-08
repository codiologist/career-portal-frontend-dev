"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EducationInfoFormValues } from "@/schemas/education.schema";
import { Trash2, Upload } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
// import { education_data } from "@_data/education_data";
import { education_data } from "@/_data/education_data";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { yearOptions } from "@/lib/year-options";
import Image from "next/image";
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
}

const resultTypeOptions: SelectOption[] = [
  { label: "First Division/Class", value: "First Division/Class" },
  { label: "Second Division/Class", value: "Second Division/Class" },
  { label: "Third Division/Class", value: "Third Division/Class" },
  { label: "Grade", value: "Grade" },
  { label: "Appeared", value: "Appeared" },
  { label: "Pass", value: "Pass" },
];

const subjectOptions: SelectOption[] = [
  { label: "Science", value: "Science" },
  { label: "Commerce", value: "Commerce" },
  { label: "Arts/Humanities", value: "Arts/Humanities" },
  { label: "General", value: "General" },
  { label: "Vocational", value: "Vocational" },
  { label: "Other", value: "Other" },
];

export default function EducationCard({
  index,
  form,
  onRemove,
  canRemove,
}: EducationCardProps) {
  const [mounted, setMounted] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [certificateError, setCertificateError] = useState<string | null>(null);

  // Read Zod validation errors from form state (set on submit)
  const zodCertificateError = form.formState.errors?.educations?.[index]
    ?.certificate?.message as string | undefined;
  // Show local error (from handleFileChange) or Zod error (from form submit)
  const displayError = certificateError || zodCertificateError || null;

  const watchLevel = form.watch(`educations.${index}.levelOfEducation`);
  const watchDegree = form.watch(`educations.${index}.degreeName`);
  const watchResultType = form.watch(`educations.${index}.resultType`);
  const isAppearedOrPass =
    watchResultType === "Pass" || watchResultType === "Appeared";

  const hideTotalMarks = isAppearedOrPass;

  // Get education level options
  const levelOptions: SelectOption[] = education_data.map((item) => ({
    label: item.name,
    value: item.name,
  }));

  // Get degree options based on selected level
  const selectedLevel = education_data.find((item) => item.name === watchLevel);
  const degreeOptions: SelectOption[] =
    selectedLevel?.degree_name?.map((d) => ({
      label: d.name,
      value: d.name,
    })) || [];

  // Get board options (from Secondary data which has boards)
  const boardData = education_data.find((item) => item.education_board);
  const boardOptions: SelectOption[] =
    boardData?.education_board?.map((b) => ({
      label: b.name,
      value: b.name,
    })) || [];

  // Show board when degree is SSC or HSC
  const showBoard = watchDegree === "SSC" || watchDegree === "HSC";

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset dependent fields when level changes
  useEffect(() => {
    form.setValue(`educations.${index}.degreeName`, "");
    form.setValue(`educations.${index}.board`, "");
  }, [watchLevel, form, index]);

  // Reset board when degree changes
  useEffect(() => {
    if (!showBoard) {
      form.setValue(`educations.${index}.board`, "");
    }
  }, [watchDegree, showBoard, form, index]);

  // Hide total marks when result type is "Appeared" or "Pass"
  useEffect(() => {
    if (hideTotalMarks) {
      form.setValue(`educations.${index}.totalMarksCGPA`, "", {
        shouldValidate: false,
      });
      form.clearErrors(`educations.${index}.totalMarksCGPA`);
    }
  }, [hideTotalMarks, form, index]);

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
      form.setValue(`educations.${index}.certificate`, file, {
        shouldValidate: true,
        shouldDirty: true,
      });
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeFile = () => {
    form.setValue(`educations.${index}.certificate`, undefined, {
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
          name={`educations.${index}.levelOfEducation`}
          label="Level of Education"
          placeholder="Select level"
          options={levelOptions}
          required
        />
        {/* Degree Name */}
        <SelectInput
          form={form}
          name={`educations.${index}.degreeName`}
          label="Degree Name"
          placeholder="Select degree"
          options={degreeOptions}
          required
          disabled={!watchLevel}
        />
        {/* Board (conditional) */}
        {showBoard && (
          <SelectInput
            form={form}
            name={`educations.${index}.board`}
            label="Board"
            placeholder="Select board"
            options={boardOptions}
            required
          />
        )}
        {/* Subject/Major/Group */}
        <SelectInput
          form={form}
          name={`educations.${index}.subjectMajorGroup`}
          label="Subject/Major/Group"
          placeholder="Select subject"
          options={subjectOptions}
          required
        />
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
          name={`educations.${index}.resultType`}
          label="Result Type"
          placeholder="Select result type"
          options={resultTypeOptions}
          required
        />

        {mounted && !hideTotalMarks && (
          <TextInput
            form={form}
            name={`educations.${index}.totalMarksCGPA`}
            label={watchResultType === "Grade" ? "CGPA" : "Total Marks / CGPA"}
            placeholder={
              watchResultType === "Grade" ? "Enter CGPA" : "Enter Total Marks"
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
            {form.getValues(`educations.${index}.certificate`)?.name ||
              "Certificate"}
          </p>
        </div>
      )}
    </div>
  );
}
