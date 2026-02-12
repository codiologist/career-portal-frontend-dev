"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axiosInstance";
import {
  defaultReferenceItem,
  referenceInfoFormSchema,
  ReferenceInfoFormValues,
} from "@/schemas/reference.schema";
import { CandidateReference } from "@/types/reference-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PlusCircle, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import ReferenceCard from "./reference-card";

export default function ReferenceInfoForm() {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ReferenceInfoFormValues>({
    resolver: zodResolver(referenceInfoFormSchema),
    defaultValues: {
      references: [{ ...defaultReferenceItem }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "references",
  });

  // ✅ Populate form safely
  useEffect(() => {
    if (!user) return;

    const references =
      user?.data?.candidateReferences?.length > 0
        ? user.data.candidateReferences.map(
            (reference: CandidateReference) => ({
              name: reference.name ?? "",
              emailAddress: reference.emailAddress ?? "",
              companyName: reference.companyName ?? "",
              phone: reference.phone ?? "",
              designation: reference.designation ?? "",
              relationship: reference.relationship ?? "",
            }),
          )
        : [{ ...defaultReferenceItem }];

    form.reset({ references });
  }, [user, form]);

  const onSubmit = async (data: ReferenceInfoFormValues) => {
    setIsSubmitting(true);

    try {
      await api.post("/user/profile/refarance", data.references);

      toast.success("Reference information submitted successfully!");

      // ✅ Refetch profile
      const profileRes = await api.get("/user/me");

      const referencesFromApi: CandidateReference[] =
        profileRes?.data?.data?.candidateReferences ?? [];

      const formattedReferences =
        referencesFromApi.length > 0
          ? referencesFromApi.map((reference: CandidateReference) => ({
              name: reference.name ?? "",
              emailAddress: reference.emailAddress ?? "",
              companyName: reference.designation ?? "",
              phone: reference.phone ?? "",
              designation: reference.designation ?? "",
              relationship: reference.relationship ?? "",
            }))
          : [{ ...defaultReferenceItem }];

      form.reset({
        references: formattedReferences,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="xl:border-dark-blue-200 xl:bg-dark-blue-200/10 rounded-4xl p-0 xl:border xl:p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-5">
            {fields.map((field, index) => (
              <ReferenceCard
                key={field.id}
                index={index}
                form={form}
                onRemove={() => remove(index)}
                canRemove={fields.length > 1}
              />
            ))}
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ ...defaultReferenceItem })}
              className="text-dark-blue-700! hover:bg-primary hover:text-primary border-dark-blue-600 gap-2 rounded-sm border-dashed text-base font-semibold"
            >
              <PlusCircle className="h-4 w-4" />
              Add More Reference
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
