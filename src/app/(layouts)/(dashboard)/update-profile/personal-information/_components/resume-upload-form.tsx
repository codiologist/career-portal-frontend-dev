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
import { FileIcon, FolderOpen, Loader2, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaFilePdf, FaFileWord } from "react-icons/fa6";
import { toast } from "react-toastify";
import * as z from "zod";
import ProfileContentCard from "../../../_components/profile-content-card";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const ACCEPTED_EXTENSIONS = ".pdf,.doc,.docx";

const formSchema = z.object({
  name: z.enum(["RESUME"]),
  resume: z
    .instanceof(File, { message: "Please upload a resume file" })
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      "File size must be less than 2MB",
    )
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file.type),
      "File must be PDF, DOC, DOCX",
    ),
});

type FormValues = z.infer<typeof formSchema>;

type ResumeDocument = {
  id: string;
  type: string;
  path: string;
  size: number;
  mimeType: string;
  createdAt: string;
  name: string | null;
};

/** Derives a display file name from the stored path (e.g. "resume.docx") */
function fileNameFromPath(path: string): string {
  const parts = path.split("/");
  const raw = parts[parts.length - 1] ?? path;
  // Strip the timestamp prefix: "1771451832480-255392258.docx" → "255392258.docx"
  // Keep full name as fallback
  const withoutTimestamp = raw.replace(/^\d+-/, "");
  return withoutTimestamp || raw;
}

/** Formats bytes to a human-readable string */
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Returns the file extension from a path or mime type */
function getExtension(path: string): string {
  return path.split(".").pop()?.toLowerCase() ?? "";
}

export function ResumeUploadForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [uploadedResume, setUploadedResume] = useState<ResumeDocument | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pull refetchUser (or equivalent) from your AuthContext.
  // Adjust the destructured name to match what your AuthContext actually exports.
  const { user, refetchUser } = useAuth() as {
    user: TGetMyProfileResponse | null;
    refetchUser: () => Promise<void>;
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "RESUME", resume: undefined },
  });

  // Sync the saved resume from the user profile on mount / after refetch
  const savedResume = (user as TGetMyProfileResponse)?.data?.documents?.find(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (doc) => doc.type === ("RESUME" as any),
  ) as ResumeDocument | undefined;

  console.log(savedResume);

  // Use locally-tracked uploadedResume if available (optimistic), otherwise fall back to profile data
  const displayedResume = uploadedResume ?? savedResume ?? null;

  // Keep uploadedResume in sync when the profile refreshes (so we don't show stale optimistic data)
  useEffect(() => {
    if (savedResume && uploadedResume && savedResume.id === uploadedResume.id) {
      setUploadedResume(null); // profile is up to date, clear optimistic state
    }
  }, [savedResume, uploadedResume]);

  // --- Pending file handlers ---

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (file: File) => void,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setPendingFile(file);
      onChange(file);
    }
  };

  const handleRemoveFile = () => {
    setPendingFile(null);
    form.setValue("resume", undefined as unknown as File);
    form.clearErrors("resume");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // --- Submit ---

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("resume", data.resume);

      const response = await api.post("/upload/user/resume", formData);

      console.log(response?.data);

      if (response.status !== 201) throw new Error("Failed to upload resume");

      // Optimistically update the UI with the returned document
      const returnedDoc: ResumeDocument =
        response.data?.data?.document ?? // adjust path to match your API shape
        response.data?.document ??
        null;

      if (returnedDoc) {
        setUploadedResume(returnedDoc);
      }

      // Refetch user profile so the AuthContext stays in sync
      await refetchUser();

      toast.success("Resume uploaded successfully!");

      // Clear the pending file selection
      form.reset();
      setPendingFile(null);
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

  // --- File icon helper ---

  const FileTypeIcon = ({
    ext,
    size = "md",
  }: {
    ext: string;
    size?: "sm" | "md";
  }) => {
    const cls = size === "md" ? "size-14" : "size-8";
    if (ext === "pdf") return <FaFilePdf className={`${cls} text-red-600`} />;
    if (ext === "doc" || ext === "docx")
      return <FaFileWord className={`${cls} text-dark-blue-600`} />;
    return <FileIcon className={`${cls} text-muted-foreground`} />;
  };

  return (
    <ProfileContentCard className="border-border bg-card relative rounded-lg border p-5 shadow-none md:p-6">
      <h1 className="text-dark-blue-700 mb-4 text-lg font-bold xl:text-2xl">
        Resume
      </h1>

      {/* ── Saved resume card (shown when no pending file is selected) ── */}
      {displayedResume && !pendingFile && (
        <div className="bg-muted/50 mb-4 flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="border-border bg-muted flex h-24 w-24 flex-col items-center justify-center gap-1 rounded border">
              <FileTypeIcon ext={getExtension(displayedResume.path)} />
            </div>
            <div className="flex flex-col">
              <span className="max-w-[400px] truncate text-sm font-medium">
                {savedResume?.name
                  ? savedResume?.name
                  : fileNameFromPath(displayedResume.path)}
              </span>
              <span className="text-muted-foreground text-xs">
                {formatBytes(displayedResume.size)} &middot; Uploaded{" "}
                {new Date(displayedResume.createdAt).toLocaleDateString()}
              </span>
              <a
                href={`${process.env.NEXT_PUBLIC_API_URL}/${displayedResume.path}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark-blue-700 mt-0.5 text-xs underline"
              >
                View resume
              </a>
            </div>
          </div>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="resume"
            /* eslint-disable @typescript-eslint/no-unused-vars */
            render={({ field: { onChange, value, ref, ...fieldProps } }) => (
              <FormItem>
                <FormControl>
                  <div className="space-y-3">
                    {!pendingFile ? (
                      /* ── Drop zone ── */
                      <label
                        htmlFor="resume-upload"
                        className="border-muted-foreground/25 bg-muted/50 hover:bg-muted flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="text-muted-foreground mb-2 h-8 w-8" />
                          <p className="text-muted-foreground text-sm">
                            <span className="font-semibold">
                              {displayedResume
                                ? "Replace resume"
                                : "Click to upload"}
                            </span>{" "}
                            or drag and drop
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
                      /* ── Pending file preview ── */
                      <div className="bg-muted/50 flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                          <div className="border-border bg-muted flex h-24 w-24 flex-col items-center justify-center gap-2 rounded border">
                            <FileTypeIcon
                              ext={getExtension(pendingFile.name)}
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="max-w-[400px] truncate text-sm font-medium">
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
                      Upload your resume in PDF, DOC, DOCX format (max 2MB)
                    </p>

                    <div className="flex justify-between">
                      {pendingFile && (
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
                              Upload Resume
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
