"use client";

import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, FolderOpen, Image, Loader2, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { TbFileTypeDocx } from "react-icons/tb";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { FaRegFilePdf } from "react-icons/fa6";
import ProfileContentCard from "../../../_components/profile-content-card";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
];

const ACCEPTED_EXTENSIONS = ".pdf,.doc,.docx,.jpg,.jpeg,.png";

const formSchema = z.object({
  resume: z
    .instanceof(File, { message: "Please upload a resume file" })
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      "File size must be less than 5MB",
    )
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file.type),
      "File must be PDF, DOC, DOCX, JPG, or PNG",
    ),
});

type FormValues = z.infer<typeof formSchema>;

export function ResumeUploadForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (file: File) => void,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onChange(file);
    }
  };

  const handleRemoveFile = () => {
    setFileName(null);
    form.setValue("resume", undefined as unknown as File);
    form.clearErrors("resume");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    // Log the submitted data
    console.log("Submitted data:", {
      fileName: data.resume.name,
      fileSize: data.resume.size,
      fileType: data.resume.type,
      file: data.resume,
    });

    try {
      const formData = new FormData();
      formData.append("resume", data.resume);

      // Replace this URL with your actual backend API endpoint
      const response = await fetch("YOUR_BACKEND_API_URL/upload-resume", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload resume");
      }

      toast.success("Resume uploaded successfully!", {
        description: "We'll review your application and get back to you soon.",
      });

      // Reset form after successful submission
      form.reset();
      setFileName(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload resume", {
        description: "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFileIcon = () => {
    if (!fileName) return null;
    const extension = fileName.split(".").pop()?.toLowerCase();

    if (extension === "pdf") {
      return <FaRegFilePdf className="size-8 text-red-500" />;
    } else if (extension === "doc" || extension === "docx") {
      return <TbFileTypeDocx className="size-8 text-blue-500" />;
    } else if (extension === "jpg" || extension === "jpg") {
      return <Image className="size-8 text-green-500" />;
    } else if (extension === "png" || extension === "png") {
      return <Image className="size-8 text-green-500" />;
    } else {
      return <FileText className="h-5 w-5 text-green-500" />;
    }
  };

  return (
    <ProfileContentCard>
      <h1 className="text-dark-blue-700 mb-4 text-lg font-bold xl:text-2xl">
        Upload Resume
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="resume"
            render={({ field: { onChange, value, ref, ...fieldProps } }) => (
              <FormItem>
                <FormControl>
                  <div className="space-y-3">
                    {!fileName ? (
                      <label
                        htmlFor="resume-upload"
                        className="border-muted-foreground/25 bg-muted/50 hover:bg-muted flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="text-muted-foreground mb-2 h-8 w-8" />
                          <p className="text-muted-foreground text-sm">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-muted-foreground mt-1 text-xs">
                            PDF, DOC, DOCX, JPG, PNG (max 5MB)
                          </p>
                        </div>
                        <input
                          id="resume-upload"
                          type="file"
                          className="hidden"
                          accept={ACCEPTED_EXTENSIONS}
                          ref={fileInputRef}
                          onChange={(e) => handleFileChange(e, onChange)}
                          name={fieldProps.name}
                          onBlur={fieldProps.onBlur}
                          disabled={fieldProps.disabled}
                        />
                      </label>
                    ) : (
                      <div className="bg-muted/50 flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                          {getFileIcon()}
                          <div className="flex flex-col">
                            <span className="max-w-[200px] truncate text-sm font-medium">
                              {fileName}
                            </span>
                            <span className="text-muted-foreground text-xs">
                              Ready to upload
                            </span>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={handleRemoveFile}
                          className="text-muted-foreground hover:text-destructive h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove file</span>
                        </Button>
                      </div>
                    )}

                    <p className="text-muted-foreground text-sm">
                      Upload your resume in PDF, DOC, DOCX, JPG, or PNG format
                      (max 5MB)
                    </p>

                    <div className="flex justify-between">
                      {fileName && (
                        <label
                          htmlFor="resume-change"
                          className="bg-dark-blue-700 hover:text-primary/80 inline-flex cursor-pointer items-center rounded-sm px-4 py-2 text-base font-medium text-white transition-colors"
                        >
                          <FolderOpen className="mr-2 size-5" />
                          Change file
                          <input
                            id="resume-change"
                            type="file"
                            className="hidden"
                            accept={ACCEPTED_EXTENSIONS}
                            onChange={(e) => handleFileChange(e, onChange)}
                          />
                        </label>
                      )}
                      <div>
                        <Button
                          type="submit"
                          className="text-base font-semibold"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-1 size-5 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="mr-1 size-5" />
                              Uplaod
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </ProfileContentCard>
  );
}
