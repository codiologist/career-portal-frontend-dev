"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  defaultEducation,
  educationInfoFormSchema,
  EducationInfoFormValues,
} from "@/schemas/education.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PlusCircle, Send } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import EducationCard from "./education-card";

export default function EducationInfoForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const onSubmit = async (data: EducationInfoFormValues) => {
    setIsSubmitting(true);

    try {
      console.log("Education Form Data:", data);

      const formData = new FormData();

      // 1️⃣ Remove certificate from JSON payload
      const educationsPayload = data.educations.map((edu) => ({
        levelOfEducationId: edu.levelOfEducationId,
        degreeNameId: edu.degreeNameId,
        educationBoardId: edu.educationBoardId ?? null,
        majorGroupId: edu.majorGroupId,
        subjectName: edu.subjectName,
        instituteName: edu.instituteName,
        resultTypeId: edu.resultTypeId,
        yearOfPassing: edu.yearOfPassing,
      }));

      // 2️⃣ Append JSON object
      formData.append("educations", JSON.stringify(educationsPayload));

      // 3️⃣ Append certificates separately
      data.educations.forEach((edu, index) => {
        if (edu.certificate instanceof File) {
          formData.append(`certificates[${index}]`, edu.certificate);
        }
      });

      const response = await fetch("/api/update-profile", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }

      const result = await response.json();
      console.log("Server Response:", result);

      alert("Education details submitted successfully!");
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to submit. Please try again.");
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
              />
            ))}
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Add More Button */}
            <div>
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ ...defaultEducation })}
                className="text-dark-blue-700! hover:bg-primary hover:text-primary border-dark-blue-600 gap-2 rounded-sm border-dashed text-base font-semibold"
              >
                <PlusCircle className="h-4 w-4" />
                Add More Education
              </Button>
            </div>

            {/* Submit Button */}
            <div>
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
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
