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
import { useAuth } from "@/context/AuthContext";
import type { AddressInitialValues } from "@/hooks/useAddressDropdown";
import api from "@/lib/axiosInstance";
import {
  addressFormSchema,
  defaultAddressFormValues,
  transformToSubmitFormat,
  type AddressFormValues,
} from "@/schemas/address.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { toast } from "react-toastify";
import { AddressFields } from "./address-fields";

export function AddressInfoForm() {
  const { user } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [presentAddressType, setPresentAddressType] = useState<string>();
  const [permanentAddressType, setPermanentAddressType] = useState<string>();

  // Parsed initial values from the saved address — passed into AddressFields
  // so useAddressDropdown can set each field right after its list loads.
  // This avoids the race condition of calling setValue before the list exists.
  const [presentInitial, setPresentInitial] = useState<
    AddressInitialValues | undefined
  >();
  const [permanentInitial, setPermanentInitial] = useState<
    AddressInitialValues | undefined
  >();

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(
      addressFormSchema,
    ) as unknown as Resolver<AddressFormValues>,
    defaultValues: { ...defaultAddressFormValues },
  });

  const isSameAsPresent = form.watch("isSameAsPresent");

  // Load address type IDs once on mount
  useEffect(() => {
    const load = async () => {
      const res = await api.get("/user/profile/address-type/dropdown");
      setPresentAddressType(res.data.data[0].id);
      setPermanentAddressType(res.data.data[1].id);
    };
    load();
  }, []);

  // When user data arrives, parse the saved addresses into initialValues.
  // We only set the plain text fields (wardNo, addressLine) on the form here.
  // All Select fields are handled inside useAddressDropdown via initialValues —
  // it sets each one right after the corresponding dropdown list finishes loading.
  useEffect(() => {
    if (!user?.data?.addresses?.length) return;

    const addresses = user.data.addresses;

    // Convert any value to string; null/undefined → ""
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const str = (v: any): string =>
      v === null || v === undefined ? "" : String(v);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const toInitialValues = (addr: any): AddressInitialValues => ({
      divisionId: str(addr?.divisionId),
      districtId: str(addr?.districtId),
      upazilaId: str(addr?.upazilaId),
      cityCorporationId: str(addr?.cityCorporationId),
      unionParishadId: str(addr?.unionParishadId),
      municipalityId: str(addr?.municipalityId),
      policeStationId: str(addr?.policeStationId),
      postOfficeId: str(addr?.postOfficeId),
      wardNo: str(addr?.wardNo),
      addressLine: addr?.addressLine ?? "",
    });

    const presentValues = toInitialValues(addresses[0] ?? null);
    const permanentValues = toInitialValues(addresses[1] ?? null);
    console.log(presentValues);
    console.log(permanentValues);

    // Store as state — these are passed as props to AddressFields which passes
    // them into the hook. The hook then sets each Select field after its list loads.
    setPresentInitial(presentValues);
    setPermanentInitial(permanentValues);

    // Set plain text fields immediately — they have no dependency on fetched lists
    form.setValue("present.divisionId", presentValues.divisionId || "");
    form.setValue("present.districtId", presentValues.districtId || "");
    form.setValue("present.wardNo", presentValues.wardNo || "");
    form.setValue("present.addressLine", presentValues.addressLine || "");

    form.setValue("permanent.divisionId", permanentValues.divisionId || "");
    form.setValue("permanent.districtId", permanentValues.districtId || "");

    form.setValue("permanent.wardNo", permanentValues.wardNo || "");
    form.setValue("permanent.addressLine", permanentValues.addressLine || "");
  }, [user, form]);

  async function onSubmit(data: AddressFormValues) {
    setIsSubmitting(true);
    const payload = transformToSubmitFormat(
      data,
      presentAddressType!,
      permanentAddressType!,
    );
    try {
      await api.post("/user/profile/address", payload);
      toast.success(
        `${user?.data?.addresses ? "Updated" : "Created"} Address information submitted successfully!.`,
      );
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit address information.");
    } finally {
      setIsSubmitting(false);
    }
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
              <AddressFields
                form={form}
                prefix="present"
                initialValues={presentInitial}
              />
            </CardContent>
          </Card>

          {/* ── Permanent Address ── */}
          <Card className="border-border bg-card shadow-sm">
            <CardContent className="pt-6">
              <h2 className="text-foreground mb-4 text-lg font-bold xl:text-2xl">
                Permanent Address
              </h2>

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

              {!isSameAsPresent && (
                <AddressFields
                  form={form}
                  prefix="permanent"
                  initialValues={permanentInitial}
                />
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
