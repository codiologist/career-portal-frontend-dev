"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import api from "@/lib/axiosInstance";
import {
  defaultExperienceItem,
  experienceInfoFormSchema,
  ExperienceInfoFormValues,
} from "@/schemas/experience.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PlusCircle, Send } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { SingleExperienceCard } from "./single-experience-card";

export function ExperienceInfoForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ExperienceInfoFormValues>({
    resolver: zodResolver(experienceInfoFormSchema),
    defaultValues: {
      experiences: [{ ...defaultExperienceItem }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "experiences",
  });

  async function onSubmit(data: ExperienceInfoFormValues) {
    setIsSubmitting(true);
    const payload = {
      experiences: data.experiences.map((exp) => ({
        ...exp,
        startDate: exp.startDate.toISOString(),
        endDate: exp.endDate ? exp.endDate.toISOString() : null,
      })),
    };

    // Console log the data
    console.log("Experience Form Submitted Data:", payload);

    try {
      const response = await api.post(
        "/user/profile/experience",
        payload.experiences,
      );

      // if (!response.t) {
      //   throw new Error(`HTTP error! status: ${response.status}`);
      // }

      console.log("Exp Form Res", response);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="xl:border-dark-blue-200 xl:bg-dark-blue-200/10 rounded-4xl p-0 xl:border xl:p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-6">
            {fields.map((field, index) => (
              <SingleExperienceCard
                key={field.id}
                form={form}
                index={index}
                onRemove={() => remove(index)}
                canRemove={fields.length > 1}
              />
            ))}
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ ...defaultExperienceItem })}
              className="text-dark-blue-700! hover:bg-primary hover:text-primary border-dark-blue-600 gap-2 rounded-sm border-dashed text-base font-semibold"
            >
              <PlusCircle className="h-4 w-4" />
              Add More Experience
            </Button>

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
        </form>
      </Form>
    </div>
  );
}
