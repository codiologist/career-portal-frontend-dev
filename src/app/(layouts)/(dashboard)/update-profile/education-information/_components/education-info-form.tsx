"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axiosInstance";
import {
  defaultEducation,
  educationInfoFormSchema,
  EducationInfoFormValues,
} from "@/schemas/education.schema";
import { TUserData } from "@/types/profile-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PlusCircle, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import EducationCard from "./education-card";

export default function EducationInfoForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingCertificateUrls, setExistingCertificateUrls] = useState<
    (string | undefined)[]
  >([]);
  const { user } = useAuth();

  const form = useForm<EducationInfoFormValues>({
    resolver: zodResolver(educationInfoFormSchema),
    defaultValues: {
      educations: [{ ...defaultEducation }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "educations",
  });

  useEffect(() => {
    if (!user) return;

    const rawEducations = (user?.data as TUserData)?.candidateEducations;
    console.log("Raw Educations:", rawEducations);

    const educations =
      rawEducations?.length > 0
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          rawEducations.map((item: any) => ({
            levelOfEducationId: item.level?.id ?? "",
            levelName: item.level?.levelName ?? "",
            degreeNameId: item.degree?.id ?? "",
            educationBoardId: item.board?.id ?? "",
            majorGroupId: item.majorGroup?.id ?? "",
            subjectName: item.subjectName ?? "",
            instituteName: item.instituteName ?? "",
            resultTypeId: item.resultType?.id ?? "",
            totalMarksCGPA: item.totalMarksCGPA ?? "",
            yearOfPassing: item.passingYear ? String(item.passingYear) : "",
            certificate: undefined,
            existingCertificateUrl: item.documents?.[0]?.path ?? undefined,
          }))
        : [{ ...defaultEducation }];

    setExistingCertificateUrls(
      rawEducations?.length > 0
        ? rawEducations.map(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (item: any) => item.documents?.[0]?.path ?? undefined,
          )
        : [],
    );
    form.reset({ educations });
  }, [user, form]);

  const onSubmit = async (data: EducationInfoFormValues) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      const educationsPayload = data.educations.map((edu, index) => ({
        levelId: edu.levelOfEducationId,
        degreeId: edu.degreeNameId,
        boardId: edu.educationBoardId || null,
        majorGroupId: edu.majorGroupId,
        instituteName: edu.instituteName,
        resultTypeId: edu.resultTypeId,
        // totalMarksCGPA is excluded when the field is hidden (Appeared/Pass)
        ...(edu.totalMarksCGPA ? { totalMarksCGPA: edu.totalMarksCGPA } : {}),
        ...(edu.subjectName ? { subjectName: edu.subjectName } : {}),
        passingYear: Number(edu.yearOfPassing),
        // ✅ FIX: pass the existing server-side path so the backend can retain
        // the old document when the user hasn't uploaded a replacement.
        existingCertificateUrl: edu.existingCertificateUrl ?? null,
        // ✅ FIX: index lets the server match the flat file field back to this
        // education entry (file field name = `certificate_<certificateIndex>`).
        certificateIndex: index,
      }));

      // ✅ FIX: key each file by its position so the server knows which
      // education entry it belongs to. Entries where the user kept the old
      // certificate have no file appended; the server uses existingCertificateUrl
      // for those.
      data.educations.forEach((education, index) => {
        if (education.certificate instanceof File) {
          formData.append(`certificate`, education.certificate);
        }
      });

      formData.append("data", JSON.stringify(educationsPayload));

      const response = await api.post("/user/profile/education", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Server Response:", response);
      toast.success(
        `${user?.data?.candidateEducations.length !== 0 ? "Updated" : "Created"} education information successfully.`,
      );
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Upload failed.");
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
          {/* Education Sections */}
          <div className="space-y-5">
            {fields.map((field, index) => (
              <EducationCard
                key={field.id}
                index={index}
                form={form}
                onRemove={() => remove(index)}
                canRemove={fields.length > 1}
                existingCertificateUrl={existingCertificateUrls[index]}
              />
            ))}
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Add More Button */}
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ ...defaultEducation })}
              className="text-dark-blue-700! hover:bg-primary hover:text-primary border-dark-blue-600 gap-2 rounded-sm border-dashed text-base font-semibold"
            >
              <PlusCircle className="h-4 w-4" />
              Add More Education
            </Button>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="gap-2 rounded-sm text-base font-semibold"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {isSubmitting ? "Submitting…" : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
