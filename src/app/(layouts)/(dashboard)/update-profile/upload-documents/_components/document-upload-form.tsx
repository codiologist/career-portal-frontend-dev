"use client";

import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Trash2, Upload } from "lucide-react";

import { Label } from "@/components/ui/label";
import api from "@/lib/axiosInstance";
import { cn } from "@/lib/utils";
import {
  documentFormSchema,
  DocumentNameEnum,
  TDocumentFormValues,
} from "@/schemas/upload-document.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm, type Resolver } from "react-hook-form";
import { toast } from "react-toastify";
import ProfileContentCard from "../../../_components/profile-content-card";
import { DatePickerInput, TextInput } from "../../_components/form-inputs";
import DocumentTable from "./document-table";

const DocumentUploadForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [resetKey, setResetKey] = useState(0);

  const form = useForm<TDocumentFormValues>({
    resolver: zodResolver(
      documentFormSchema,
    ) as unknown as Resolver<TDocumentFormValues>,
    defaultValues: {
      name: undefined,
      documentNo: "",
      issueDate: new Date(),
      issueAuthority: "",
      remarks: "",
      documentFile: undefined,
    },
  });

  const removeFile = (onChange: (file: File | undefined) => void) => {
    onChange(undefined);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: TDocumentFormValues) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      const payload = {
        type: "OTHER",
        ...data,
        // Format date to YYYY-MM-DD for API
        issueDate: data.issueDate.toISOString(),
      };
      const { documentFile, ...dataWithoutFile } = payload;

      console.log(documentFile, dataWithoutFile);

      formData.append("other", documentFile);
      formData.append("data", JSON.stringify(dataWithoutFile));

      const response = await api.post("/upload/user/other", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response.data);
      toast.success("Document uploaded successfully!");

      form.reset();
      setPreview(null);
      setResetKey((prev) => prev + 1); // ✅ forces Select to remount

      window.location.reload(); // Temporary: reload to fetch new document list. Ideally, we should update the local state instead of reloading.
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="xl:border-dark-blue-200 xl:bg-dark-blue-200/10 rounded-2xl p-0 xl:border xl:p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (err) => {
            console.log("Validation Errors:", err);
          })}
          className="space-y-6"
        >
          <ProfileContentCard className="border-border bg-card relative rounded-lg border p-5 shadow-none md:p-6">
            <h1 className="text-dark-blue-700 mb-4 text-lg font-bold xl:text-2xl">
              Upload Your Documents
            </h1>

            <div>
              {/* Row 1: Document Type, Document Number, Issue Date */}
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                {/* Document Type */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="form-input-item select-input">
                      <FormLabel className="gap-1 text-base">
                        Document Type
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select
                        key={resetKey}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="[&>svg]:stroke-dark-blue-700 relative h-10! w-full border-[#D0D5DD] bg-white transition-all duration-300 max-sm:h-11 [&>svg]:h-6 [&>svg]:w-6 [&>svg]:opacity-100">
                            <SelectValue
                              className="placeholder:text-primary-gray!"
                              placeholder="Select Document Type"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="border-[#D0D5DD]">
                          {DocumentNameEnum.options.map((doc) => (
                            <SelectItem
                              key={doc}
                              className="cursor-pointer"
                              value={doc}
                            >
                              {doc.replace(/_/g, " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <TextInput
                  form={form}
                  name="documentNo"
                  label="Document Number"
                  placeholder="Document Number"
                  required
                />

                <DatePickerInput
                  form={form}
                  name="issueDate"
                  label="Date of Issue (DD/MM/YYYY)"
                  placeholder="Select your date of issue"
                  required
                />
              </div>

              {/* Row 2: Issue Authority, Remarks */}
              <div className="mt-4 grid grid-cols-1 gap-x-0 gap-y-4 xl:grid-cols-3 xl:gap-x-4 xl:gap-y-4">
                <div className="col-span-1">
                  <TextInput
                    form={form}
                    name="issueAuthority"
                    label="Document Issuing Authority"
                    placeholder="Authority Name"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <TextInput
                    form={form}
                    name="remarks"
                    label="Remarks (Any)"
                    placeholder="Remarks"
                  />
                </div>
              </div>

              {/* File Upload — properly connected to react-hook-form via field.onChange */}
              <FormField
                control={form.control}
                name="documentFile"
                render={({
                  /* eslint-disable @typescript-eslint/no-unused-vars */
                  field: { onChange, value, ref, ...fieldProps },
                }) => (
                  <FormItem className="mt-4 flex flex-col gap-2">
                    <FormLabel className="mb-0! gap-1 text-base font-medium">
                      Upload Document
                      <span className="text-destructive">*</span>
                    </FormLabel>

                    <FormControl>
                      <Label
                        htmlFor="upload-document"
                        className={cn(
                          "flex h-10 cursor-pointer items-center gap-2 rounded-sm border px-3 transition-colors max-sm:h-11",
                          form.formState.errors.documentFile
                            ? "border-destructive bg-destructive/5"
                            : "bg-card hover:border-foreground/40 border-[#D0D5DD]",
                        )}
                      >
                        <Upload className="text-muted-foreground h-4 w-4" />
                        <span className="text-muted-foreground text-sm">
                          JPEG, JPG, PNG (Max 5MB)
                        </span>
                        <input
                          {...fieldProps}
                          ref={fileInputRef}
                          id="upload-document"
                          type="file"
                          accept=".jpeg,.jpg,.png"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            // ✅ Call field.onChange so react-hook-form registers the value
                            onChange(file);
                            // Generate preview
                            const reader = new FileReader();
                            reader.onloadend = () =>
                              setPreview(reader.result as string);
                            reader.readAsDataURL(file);
                          }}
                        />
                      </Label>
                    </FormControl>

                    {/* Renders Zod error message for documentFile */}
                    <FormMessage />

                    {/* Preview */}
                    {preview && (
                      <div className="mt-2">
                        <div className="relative h-auto w-40 text-center">
                          <Image
                            src={preview}
                            alt="Document preview"
                            width={160}
                            height={160}
                            className="relative mx-auto h-auto w-40 rounded border object-cover p-1"
                            unoptimized
                          />
                          <Button
                            type="button"
                            onClick={() => removeFile(onChange)}
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-600/80 p-1 hover:bg-red-700"
                          >
                            <Trash2 className="h-4 w-4 text-white" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </FormItem>
                )}
              />

              {/* Submit */}
              <div className="mt-6 flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="gap-2 rounded-sm text-base font-semibold"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  {isSubmitting ? "Uploading..." : "Upload"}
                </Button>
              </div>
            </div>
          </ProfileContentCard>
        </form>
      </Form>

      <div>
        <DocumentTable />
      </div>
    </div>
  );
};

export default DocumentUploadForm;
