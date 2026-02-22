"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  achievementInfoFormSchema,
  AchievementInfoFormValues,
  defaultAchievement,
} from "@/schemas/achievement.schema";

import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axiosInstance";
import { TUserData } from "@/types/profile-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PlusCircle, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import AchievementTrainingCard from "./achievement-training-card";

export default function AchievementTrainingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const form = useForm<AchievementInfoFormValues>({
    resolver: zodResolver(achievementInfoFormSchema),
    defaultValues: {
      achievements: [{ ...defaultAchievement }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "achievements",
  });

  useEffect(() => {
    if (!user) return;

    const rawAchievements = (user?.data as TUserData)?.candidateAchievements;

    const achievements =
      rawAchievements?.length > 0
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          rawAchievements.map((item: any) => ({
            achievementType: item.achievementType ?? "",
            title: item.title ?? "",
            organizationName: item.organizationName ?? "",
            url: item.url ?? "",
            location: item.location ?? "",
            // API returns year as a number; the form expects a string
            year: item.year != null ? String(item.year) : "",
            description: item.description ?? "",
            // No File object for existing records; keep certificate undefined
            certificate: undefined,
            // Store the path of the first associated document so the card can
            // show a preview and the schema skips the "file required" check
            existingCertificateUrl: item.documents?.[0]?.path ?? undefined,
          }))
        : [{ ...defaultAchievement }];

    form.reset({ achievements });
  }, [user, form]);

  const onSubmit = async (data: AchievementInfoFormValues) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      const achievementsPayload = data.achievements.map((achievement) => ({
        achievementType: achievement.achievementType,
        title: achievement.title,
        organizationName: achievement.organizationName,
        url: achievement.url ?? null,
        location: achievement.location,
        year: Number(achievement.year),
        description: achievement.description,
        // Let the backend know whether an existing document should be kept
        existingCertificateUrl: achievement.existingCertificateUrl ?? null,
      }));

      // Append newly selected certificate files using the same "files" key.
      // Entries that kept their existing document will not append anything here.
      data.achievements.forEach((achievement) => {
        if (achievement.certificate instanceof File) {
          formData.append("achievement", achievement.certificate);
        }
      });

      formData.append("data", JSON.stringify(achievementsPayload));

      await api.post("/user/profile/achievement", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(
        `${user?.data?.candidateAchievements.length !== 0 ? "Updated" : "Created"} achievement information successfully.`,
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
          {/* Achievement Sections */}
          <div className="space-y-5">
            {fields.map((field, index) => (
              <AchievementTrainingCard
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
                onClick={() => append({ ...defaultAchievement })}
                className="text-dark-blue-700! hover:bg-primary hover:text-primary border-dark-blue-600 gap-2 rounded-sm border-dashed text-base font-semibold"
              >
                <PlusCircle className="h-4 w-4" />
                Add More Achievement
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
