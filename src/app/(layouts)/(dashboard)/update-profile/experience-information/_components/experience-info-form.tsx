"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axiosInstance";
import {
  defaultExperienceItem,
  ExperienceApiItem,
  experienceInfoFormSchema,
  ExperienceInfoFormValues,
} from "@/schemas/experience.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PlusCircle, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { SingleExperienceCard } from "./single-experience-card";

export function ExperienceInfoForm() {
  const { user } = useAuth();
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

  useEffect(() => {
    if (!user) return;

    const experiences =
      user?.data?.candidateExperiences?.length > 0
        ? (
            user.data.candidateExperiences as unknown as ExperienceApiItem[]
          ).map((exp: ExperienceApiItem) => ({
            ...exp,
            startDate: exp.startDate ? new Date(exp.startDate) : undefined,
            endDate: exp.endDate ? new Date(exp.endDate) : undefined,
          }))
        : [{ ...defaultExperienceItem }];

    form.reset({ experiences });
  }, [user, form]);

  async function onSubmit(data: ExperienceInfoFormValues) {
    setIsSubmitting(true);
    const payload = {
      experiences: data.experiences.map((experience) => ({
        ...experience,
        startDate: experience.startDate.toISOString(),
        endDate: experience.endDate ? experience.endDate.toISOString() : null,
      })),
    };

    try {
      const response = await api.post(
        "/user/profile/experience",
        payload.experiences,
      );
      toast.success("Experience information submitted successfully!");

      // ✅ Refetch profile
      const profileRes = await api.get("/user/me");
      const experiencesFromApi =
        profileRes?.data?.data?.candidateExperiences ?? [];

      const formattedExperiences = (
        experiencesFromApi as ExperienceApiItem[]
      ).map((exp: ExperienceApiItem) => ({
        ...exp,
        startDate: exp.startDate ? new Date(exp.startDate) : undefined,
        endDate: exp.endDate ? new Date(exp.endDate) : undefined,
      }));
      console.log(profileRes);
      // ✅ Reset entire form
      form.reset({
        experiences:
          formattedExperiences.length > 0
            ? formattedExperiences
            : [{ ...defaultExperienceItem }],
      });

      return response;
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  // async function onSubmit(data: ExperienceInfoFormValues) {
  //   setIsSubmitting(true);

  //   const payload = {
  //     experiences: data.experiences.map((exp) => ({
  //       ...exp,
  //       startDate: experience.startDate.toISOString(),
  //       endDate: experience.endDate ? experience.endDate.toISOString() : null,
  //     })),
  //   };

  //   try {
  //     await api.post("/user/profile/experience", payload.experiences);

  //     // ✅ Refetch profile
  //     const profileRes = await api.get("/user/me");

  //     const experiencesFromApi = profileRes.data?.experiences ?? [];

  //     // ✅ Convert API response to form format
  //     const formattedExperiences = experiencesFromApi.map((exp: any) => ({
  //       ...exp,
  //       startDate: experience.startDate ? new Date(experience.startDate) : null,
  //       endDate: experience.endDate ? new Date(experience.endDate) : null,
  //     }));

  //     // ✅ Reset entire form
  //     form.reset({
  //       experiences:
  //         formattedExperiences.length > 0
  //           ? formattedExperiences
  //           : [{ ...defaultExperienceItem }],
  //     });
  //   } catch (error) {
  //     console.error("Error submitting form:", error);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // }

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
