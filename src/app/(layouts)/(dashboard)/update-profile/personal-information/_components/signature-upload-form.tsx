"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import api from "@/lib/axiosInstance";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileIcon, FolderOpen, Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaFilePdf, FaFileWord } from "react-icons/fa6";
import { toast } from "react-toastify";
import * as z from "zod";
import ProfileContentCard from "../../../_components/profile-content-card";

const MAX_FILE_SIZE = 800 * 1024; // 800KB
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
];

const ACCEPTED_EXTENSIONS = ".jpg,.jpeg,.png";

const formSchema = z.object({
  signature: z
    .instanceof(File, { message: "Please upload a signature file" })
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      "File size must be less than 500KB",
    )
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file.type),
      "File must be JPG, or PNG",
    ),
});

type FormValues = z.infer<typeof formSchema>;

export function SignatureUploadForm() {
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

      console.log(previewUrl);
    }
  };

  const handleRemoveFile = () => {
    setFileName(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    form.setValue("signature", undefined as unknown as File);
    form.clearErrors("signature");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    // Log the submitted data
    console.log("Submitted data:", {
      name: data.signature.name,
      fileSize: data.signature.size,
      fileType: data.signature.type,
      file: data.signature,
    });

    try {
      const formData = new FormData();
      formData.append("signature", data.signature);

      // Replace this URL with your actual backend API endpoint
      const response = await api.post("/upload/user/signature", formData);

      if (response.status !== 200) {
        throw new Error("Failed to upload signature");
      }

      toast.success("Signature uploaded successfully!");

      // Reset form after successful submission
      form.reset();
      setFileName(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "An error occurred while uploading",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProfileContentCard className="border-border bg-card relative rounded-lg border p-5 shadow-none md:p-6">
      <h1 className="text-dark-blue-700 mb-4 text-lg font-bold xl:text-2xl">
        Signature
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="signature"
            /* eslint-disable @typescript-eslint/no-unused-vars */
            render={({ field: { onChange, value, ref, ...fieldProps } }) => (
              <FormItem>
                <FormControl>
                  <div className="space-y-3">
                    {!fileName ? (
                      <label
                        htmlFor="signature-upload"
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
                        </div>
                        <input
                          id="signature-upload"
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
                          {/* {getFileIcon()} */}

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
                          <div className="flex flex-col">
                            <span className="max-w-[400px] truncate text-sm font-medium">
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
                      Upload your signature in JPG, or PNG format (max 500KB)
                    </p>

                    <div className="flex justify-between">
                      {fileName && (
                        <label
                          htmlFor="signature-change"
                          className="bg-dark-blue-700 hover:text-primary/80 inline-flex cursor-pointer items-center rounded-sm px-4 py-2 text-base font-medium text-white transition-colors"
                        >
                          <FolderOpen className="mr-2 size-5" />
                          Change file
                          <input
                            id="signature-change"
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
                              Uplaod Signature
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
