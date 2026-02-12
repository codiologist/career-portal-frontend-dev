"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FileIcon, Loader2, Trash2, Upload } from "lucide-react";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import { FaFilePdf, FaFileWord } from "react-icons/fa6";

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
    .instanceof(File, { message: "Please upload a file" })
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

export function FileUploadForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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

      // Generate preview for image files
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleRemoveFile = () => {
    setFileName(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    form.setValue("resume", undefined as unknown as File);
    form.clearErrors("resume");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

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
        throw new Error("Failed to upload file");
      }

      toast.success("File uploaded successfully!");

      form.reset();
      setFileName(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file", {
        description: "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="resume"
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            render={({ field: { onChange, value, ref, ...fieldProps } }) => (
              <FormItem>
                <FormLabel className="text-foreground text-sm font-semibold">
                  File Upload <span className="text-red-600">*</span>
                </FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    {/* Upload trigger bar */}
                    <label
                      htmlFor="file-upload"
                      className="border-border bg-background hover:bg-muted/40 flex w-full cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors"
                    >
                      <Upload className="text-muted-foreground h-4 w-4 shrink-0" />
                      <span className="text-muted-foreground text-sm">
                        PDF, DOC, DOCX, JPEG, JPG, PNG (Max 5MB)
                      </span>
                      <input
                        id="file-upload"
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

                    {/* File preview */}
                    {fileName && (
                      <div className="flex flex-col items-start gap-1">
                        <div className="relative inline-block">
                          {/* Thumbnail preview */}
                          {previewUrl ? (
                            <Image
                              src={previewUrl || "/placeholder.svg"}
                              alt={fileName}
                              width={32}
                              height={32}
                              className="relative mx-auto h-auto w-40 rounded border object-cover p-1"
                              unoptimized
                            />
                          ) : (
                            <div className="border-border bg-muted flex h-24 w-24 flex-col items-center justify-center gap-2 rounded border">
                              {fileName.toLowerCase().endsWith(".pdf") ? (
                                <FaFilePdf className="size-14 text-red-600" />
                              ) : fileName.toLowerCase().endsWith(".doc") ||
                                fileName.toLowerCase().endsWith(".docx") ? (
                                <FaFileWord className="text-dark-blue-600 h-10 w-10" />
                              ) : (
                                <FileIcon className="text-muted-foreground h-10 w-10" />
                              )}
                              {/* <span className="text-muted-foreground text-xs font-semibold uppercase">
                                {fileName.split(".").pop()}
                              </span> */}
                            </div>
                          )}

                          {/* Delete button */}
                          <Button
                            type="button"
                            onClick={handleRemoveFile}
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-600/80 p-1 hover:bg-red-700"
                            aria-label="Remove file"
                          >
                            <Trash2 className="h-4 w-4 text-white" />
                          </Button>
                        </div>

                        {/* Filename */}
                        <span className="mt-1 text-sm font-medium text-blue-700">
                          {fileName}
                        </span>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
        </form>
      </Form>
    </div>
  );
}
