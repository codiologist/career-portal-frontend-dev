"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm, type Resolver } from "react-hook-form";
// import {
//   addressFormSchema,
//   type AddressFormValues,
//   transformToSubmitFormat,
// } from "@/lib/validations/address-schema";
import api from "@/lib/axiosInstance";
import {
  addressFormSchema,
  defaultAddressFormValues,
  transformToSubmitFormat,
  type AddressFormValues,
} from "@/schemas/address.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { AddressFields } from "./address-fields";

export function AddressInfoForm() {
  // const [submittedData, setSubmittedData] = useState<ReturnType<
  //   typeof transformToSubmitFormat
  // > | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(
      addressFormSchema,
    ) as unknown as Resolver<AddressFormValues>,
    defaultValues: { ...defaultAddressFormValues },
  });

  const isSameAsPresent = form.watch("isSameAsPresent");

  async function onSubmit(data: AddressFormValues) {
    const payload = transformToSubmitFormat(data);

    try {
      const response = await api.post("/user/profile/address", payload);
      toast.success("Address information submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
    }

    // setSubmittedData(payload);
    console.log("Submitted payload:", JSON.stringify(payload, null, 2));
  }

  return (
    <div className="xl:border-dark-blue-200 xl:bg-dark-blue-200/10 rounded-4xl p-0 xl:border xl:p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* ── Present Address ── */}
          <Card className="border-border bg-card shadow-sm">
            <CardContent className="pt-6">
              <h2 className="text-foreground mb-5 text-lg font-bold xl:text-2xl">
                Present Address
              </h2>
              <AddressFields form={form} prefix="present" />
            </CardContent>
          </Card>

          {/* ── Permanent Address ── */}
          <Card className="border-border bg-card shadow-sm">
            <CardContent className="pt-6">
              <h2 className="text-foreground mb-4 text-lg font-bold xl:text-2xl">
                Permanent Address
              </h2>

              {/* Checkbox: same as present */}
              <FormField
                control={form.control}
                name="isSameAsPresent"
                render={({ field }) => (
                  <FormItem className="mb-5 flex items-center gap-2">
                    <FormControl>
                      <Checkbox
                        className="h-5 w-5"
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-foreground !mt-0 cursor-pointer text-base font-semibold">
                      Permanent address is same as present address
                    </FormLabel>
                  </FormItem>
                )}
              />

              {/* Permanent Address fields — hidden when isSameAsPresent */}
              {!isSameAsPresent && (
                <AddressFields form={form} prefix="permanent" />
              )}

              {isSameAsPresent && (
                <p className="border-border bg-muted text-muted-foreground rounded-lg border px-4 py-3 text-sm">
                  Permanent address will be the same as your present address.
                </p>
              )}
            </CardContent>
          </Card>
          <div className="flex justify-end">
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
