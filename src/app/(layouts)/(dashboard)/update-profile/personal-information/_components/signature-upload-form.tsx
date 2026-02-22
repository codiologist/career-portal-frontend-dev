"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axiosInstance";
import { TGetMyProfileResponse } from "@/types/profile-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { FolderOpen, Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as z from "zod";
import ProfileContentCard from "../../../_components/profile-content-card";

const MAX_FILE_SIZE = 800 * 1024; // 800KB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png"];
const ACCEPTED_EXTENSIONS = ".jpg,.jpeg,.png";

const formSchema = z.object({
  name: z.enum(["SIGNATURE"]),
  signature: z
    .instanceof(File, { message: "Please upload a signature file" })
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      "File size must be less than 800KB",
    )
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file.type),
      "File must be JPG or PNG",
    ),
});

type FormValues = z.infer<typeof formSchema>;

type SignatureDocument = {
  id: string;
  type: string;
  path: string;
  size: number;
  mimeType: string;
  createdAt: string;
  name: string | null;
};

/** Formats bytes to a human-readable string */
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function SignatureUploadForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingPreviewUrl, setPendingPreviewUrl] = useState<string | null>(
    null,
  );
  const [uploadedSignature, setUploadedSignature] =
    useState<SignatureDocument | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Adjust destructure to match your AuthContext exports
  const { user, refetchUser } = useAuth() as {
    user: TGetMyProfileResponse | null;
    refetchUser: () => Promise<void>;
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "SIGNATURE", signature: undefined },
  });

  // Saved signature from the user profile
  const savedSignature = (user as TGetMyProfileResponse)?.data?.documents?.find(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (doc) => doc.type === ("SIGNATURE" as any),
  ) as SignatureDocument | undefined;

  // Prefer optimistic uploadedSignature, fall back to profile data
  const displayedSignature = uploadedSignature ?? savedSignature ?? null;

  // Clear optimistic state once refetch confirms the profile is up to date
  useEffect(() => {
    if (
      savedSignature &&
      uploadedSignature &&
      savedSignature.id === uploadedSignature.id
    ) {
      setUploadedSignature(null);
    }
  }, [savedSignature, uploadedSignature]);

  // Revoke blob URL on unmount to avoid memory leaks
  useEffect(() => {
    return () => {
      if (pendingPreviewUrl) URL.revokeObjectURL(pendingPreviewUrl);
    };
  }, [pendingPreviewUrl]);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (file: File) => void,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Revoke previous blob URL before creating a new one
    if (pendingPreviewUrl) URL.revokeObjectURL(pendingPreviewUrl);

    setPendingFile(file);
    onChange(file);

    if (file.type.startsWith("image/")) {
      setPendingPreviewUrl(URL.createObjectURL(file));
    } else {
      setPendingPreviewUrl(null);
    }
  };

  const handleRemoveFile = () => {
    if (pendingPreviewUrl) {
      URL.revokeObjectURL(pendingPreviewUrl);
      setPendingPreviewUrl(null);
    }
    setPendingFile(null);
    form.setValue("signature", undefined as unknown as File);
    form.clearErrors("signature");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("signature", data.signature);

      const response = await api.post("/upload/user/signature", formData);

      if (response.status !== 201)
        throw new Error("Failed to upload signature");

      // Optimistically store the returned document to update UI immediately
      const returnedDoc: SignatureDocument =
        response.data?.data?.document ?? response.data?.document ?? null;

      if (returnedDoc) {
        setUploadedSignature(returnedDoc);
      }

      // Refetch user profile to sync AuthContext
      await refetchUser();

      toast.success("Signature uploaded successfully!");

      // Clear pending file state
      if (pendingPreviewUrl) {
        URL.revokeObjectURL(pendingPreviewUrl);
        setPendingPreviewUrl(null);
      }
      setPendingFile(null);
      form.reset();
      if (fileInputRef.current) fileInputRef.current.value = "";
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

  const savedImageUrl = displayedSignature
    ? `${process.env.NEXT_PUBLIC_API_URL}/${displayedSignature.path}`
    : null;

  return (
    <ProfileContentCard className="border-border bg-card relative rounded-lg border p-5 shadow-none md:p-6">
      <h1 className="text-dark-blue-700 mb-4 text-lg font-bold xl:text-2xl">
        Signature
      </h1>

      {/* ── Saved signature preview (shown when no pending file is selected) ── */}
      {displayedSignature && savedImageUrl && !pendingFile && (
        <div className="bg-muted/50 mb-4 flex items-start gap-4 rounded-lg border p-4">
          <div className="border-border flex h-24 w-48 items-center justify-center rounded border bg-white p-2">
            <Image
              src={savedImageUrl}
              alt="Saved signature"
              width={176}
              height={80}
              className="h-full w-full object-contain"
              unoptimized
            />
          </div>
          <div className="flex flex-col justify-center gap-1">
            <span className="text-sm font-medium">Current Signature</span>
            <span className="text-muted-foreground text-xs">
              {formatBytes(displayedSignature.size)} &middot; Uploaded{" "}
              {new Date(displayedSignature.createdAt).toLocaleDateString()}
            </span>
            <a
              href={savedImageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-dark-blue-700 mt-0.5 text-xs underline"
            >
              View full size
            </a>
          </div>
        </div>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (err) => {
            console.log("Validation Errors:", err);
          })}
          className="space-y-6"
        >
          <FormField
            control={form.control}
            name="signature"
            /* eslint-disable @typescript-eslint/no-unused-vars */
            render={({ field: { onChange, value, ref, ...fieldProps } }) => (
              <FormItem>
                <FormControl>
                  <div className="space-y-3">
                    {!pendingFile ? (
                      /* ── Drop zone ── */
                      <label
                        htmlFor="signature-upload"
                        className="border-muted-foreground/25 bg-muted/50 hover:bg-muted flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="text-muted-foreground mb-2 h-8 w-8" />
                          <p className="text-muted-foreground text-sm">
                            <span className="font-semibold">
                              {displayedSignature
                                ? "Replace signature"
                                : "Click to upload"}
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
                      /* ── Pending file preview ── */
                      <div className="bg-muted/50 flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                          {pendingPreviewUrl ? (
                            <div className="border-border flex h-24 w-48 items-center justify-center rounded border bg-white p-2">
                              <Image
                                src={pendingPreviewUrl}
                                alt={pendingFile.name}
                                width={176}
                                height={80}
                                className="h-full w-full object-contain"
                                unoptimized
                              />
                            </div>
                          ) : null}
                          <div className="flex flex-col">
                            <span className="max-w-[300px] truncate text-sm font-medium">
                              {pendingFile.name}
                            </span>
                            <span className="text-muted-foreground text-xs">
                              {formatBytes(pendingFile.size)} &middot; Ready to
                              upload
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
                      Upload your signature in JPG or PNG format (max 800KB)
                    </p>

                    <div className="flex justify-between">
                      {pendingFile && (
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
                      <div className={pendingFile ? "" : "ml-auto"}>
                        <Button
                          type="submit"
                          className="text-base font-semibold"
                          disabled={isSubmitting || !pendingFile}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-1 size-5 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="mr-1 size-5" />
                              Upload Signature
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
