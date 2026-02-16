"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAddressDropdown } from "@/hooks/useAddressDropdown";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { UseFormReturn } from "react-hook-form";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getLabel = (list: any[], id: string | number, key = "name") =>
  list.find((i) => String(i.id) === String(id))?.[key];

interface AddressFieldsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  prefix: string; // e.g. "present" or "permanent"
}

export function AddressFields({ form, prefix }: AddressFieldsProps) {
  const [showUnionMuncField, setShowUnionMuncField] = useState(true);

  const divisionId = form.watch(`${prefix}.divisionId`);
  const districtId = form.watch(`${prefix}.districtId`);
  const upazilaCityCorpId = form.watch(`${prefix}.upazilaCityCorpId`) ?? "";

  const unionMunicipalityId = form.watch(`${prefix}.unionMunicipalityId`) ?? "";

  const {
    divisions,
    districts,
    upazilas,
    policeStations,
    unionsMunicipalities,
    postOffices,
    loadingDivision,
    loadingDistrict,
    loadingPoliceStation,
    loadingUpazila,
    loadingUnionMunicipality,
    loadingPostOffice,
  } = useAddressDropdown(divisionId, districtId, upazilaCityCorpId);

  useEffect(() => {
    if (!upazilaCityCorpId) return;

    const findUpazilaOrCity = upazilas.find(
      (u) => String(u.id) === String(upazilaCityCorpId),
    ) as { id: string | number; type?: string } | undefined;

    if (!findUpazilaOrCity?.type) return;

    if (findUpazilaOrCity.type === "UPAZILA") {
      form.setValue(`${prefix}.upazilaId`, String(findUpazilaOrCity.id), {
        shouldDirty: true,
        shouldValidate: true,
      });
      form.setValue(`${prefix}.cityCorporationId`, "", {
        shouldValidate: true,
      });
      setShowUnionMuncField(true); // Show union/municipality for Upazila (required)
    } else if (findUpazilaOrCity.type === "CITY_CORPORATION") {
      form.setValue(
        `${prefix}.cityCorporationId`,
        String(findUpazilaOrCity.id),
        { shouldDirty: true, shouldValidate: true },
      );
      form.setValue(`${prefix}.upazilaId`, "", {
        shouldValidate: true,
      });
      setShowUnionMuncField(false); // Hide union/municipality for City Corporation (not required)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [upazilaCityCorpId]);

  useEffect(() => {
    if (!unionMunicipalityId) return;

    const findUnionMunicipality = unionsMunicipalities.find(
      (u) => String(u.id) === String(unionMunicipalityId),
    ) as { id: string | number; type?: string } | undefined;

    if (!findUnionMunicipality?.type) return;

    if (findUnionMunicipality.type === "UNION") {
      form.setValue(`${prefix}.unionId`, String(findUnionMunicipality.id), {
        shouldDirty: true,
        shouldValidate: true,
      });
      form.setValue(`${prefix}.municipalityId`, "", {
        shouldValidate: true,
      });
    } else if (findUnionMunicipality.type === "MUNICIPALITY") {
      form.setValue(
        `${prefix}.municipalityId`,
        String(findUnionMunicipality.id),
        { shouldDirty: true, shouldValidate: true },
      );
      form.setValue(`${prefix}.unionId`, "", {
        shouldValidate: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unionMunicipalityId]);

  // Get error messages from the hidden fields
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errors = form.formState.errors as any;
  const upazilaError = errors?.[prefix]?.upazilaId?.message;
  const cityCorporationError = errors?.[prefix]?.cityCorporationId?.message;
  const unionError = errors?.[prefix]?.unionId?.message;
  const municipalityError = errors?.[prefix]?.municipalityId?.message;

  // Determine which error to show for Upazila/City Corporation field
  const upazilaCityCorpError = upazilaError || cityCorporationError;

  // Determine which error to show for Union/Municipality field
  const unionMunicipalityError = unionError || municipalityError;

  const triggerClass =
    "relative h-10 w-full border-[#D0D5DD] bg-white text-foreground transition-all duration-300 max-sm:h-11";

  return (
    <>
      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-3">
        {/* Division */}
        <FormField
          control={form.control}
          name={`${prefix}.divisionId`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground gap-1 text-base">
                Division <span className="text-destructive">*</span>
              </FormLabel>
              <Select
                value={String(field.value || "")}
                onValueChange={(val) => {
                  field.onChange(val);
                  form.setValue(`${prefix}.districtId`, "");
                  form.setValue(`${prefix}.upazilaCityCorpId`, "");
                  form.setValue(`${prefix}.policeStationId`, "");
                  form.setValue(`${prefix}.postOfficeId`, "");
                }}
              >
                <FormControl className="w-full">
                  <SelectTrigger className={triggerClass}>
                    {loadingDivision ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <SelectValue
                        placeholder={
                          getLabel(divisions, field.value) || "Select Division"
                        }
                      />
                    )}
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="border-[#D0D5DD]">
                  {divisions.map((d) => (
                    <SelectItem key={d.id} value={String(d.id)}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* District */}
        <FormField
          control={form.control}
          name={`${prefix}.districtId`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground gap-1 text-base">
                District <span className="text-destructive">*</span>
              </FormLabel>
              <Select
                disabled={!divisionId}
                value={String(field.value || "")}
                onValueChange={(val) => {
                  field.onChange(val);
                  form.setValue(`${prefix}.upazilaCityCorpId`, "");
                  form.setValue(`${prefix}.policeStationId`, "");
                  form.setValue(`${prefix}.postOfficeId`, "");
                }}
              >
                <FormControl className="w-full">
                  <SelectTrigger className={triggerClass}>
                    {loadingDistrict ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <SelectValue
                        placeholder={
                          getLabel(districts, field.value) || "Select District"
                        }
                      />
                    )}
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="border-[#D0D5DD]">
                  {districts.map((d) => (
                    <SelectItem key={d.id} value={String(d.id)}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Upazila/City Corporation */}
        <div>
          <FormField
            control={form.control}
            name={`${prefix}.upazilaCityCorpId`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground gap-1 text-base">
                  Upazila/City Corporation
                  <span className="text-destructive"> *</span>
                </FormLabel>
                <Select
                  disabled={!districtId}
                  value={String(field.value || "")}
                  onValueChange={(val) => {
                    field.onChange(val);
                    form.setValue(`${prefix}.policeStationId`, "");
                    form.setValue(`${prefix}.postOfficeId`, "");
                    form.setValue(`${prefix}.upazilaId`, "");
                  }}
                >
                  <FormControl>
                    <SelectTrigger className={triggerClass}>
                      {loadingUpazila ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <SelectValue
                          placeholder={
                            getLabel(upazilas, field.value) || "Select Upazila"
                          }
                        />
                      )}
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="border-[#D0D5DD]">
                    {upazilas.map((d) => (
                      <SelectItem key={d.id} value={String(d.id)}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* Show error from hidden fields */}
                {upazilaCityCorpError && (
                  <p className="text-destructive text-sm font-medium">
                    {upazilaCityCorpError}
                  </p>
                )}
              </FormItem>
            )}
          />
          <Input
            className="hidden"
            type="text"
            {...form.register(`${prefix}.upazilaId`)}
          />
          <Input
            className="hidden"
            type="text"
            {...form.register(`${prefix}.cityCorporationId`)}
          />
        </div>

        {/* Union/Municipality */}
        {showUnionMuncField && (
          <div>
            <FormField
              control={form.control}
              name={`${prefix}.unionMunicipalityId`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground gap-1 text-base">
                    Union/Municipality
                    <span className="text-destructive"> *</span>
                  </FormLabel>
                  <Select
                    disabled={!districtId}
                    value={String(field.value || "")}
                    onValueChange={(val) => {
                      field.onChange(val);
                      form.setValue(`${prefix}.policeStationId`, "");
                      form.setValue(`${prefix}.postOfficeId`, "");
                    }}
                  >
                    <FormControl>
                      <SelectTrigger className={triggerClass}>
                        {loadingUnionMunicipality ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <SelectValue
                            placeholder={
                              getLabel(unionsMunicipalities, field.value) ||
                              "Select Union/Municipality"
                            }
                          />
                        )}
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="border-[#D0D5DD]">
                      {unionsMunicipalities.map((d) => (
                        <SelectItem key={d.id} value={String(d.id)}>
                          {d.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {/* Show error from hidden fields */}
                  {unionMunicipalityError && (
                    <p className="text-destructive text-sm font-medium">
                      {unionMunicipalityError}
                    </p>
                  )}
                </FormItem>
              )}
            />
            <Input
              className="hidden"
              type="text"
              {...form.register(`${prefix}.unionId`)}
            />
            <Input
              className="hidden"
              type="text"
              {...form.register(`${prefix}.municipalityId`)}
            />
          </div>
        )}

        {/* Police Station */}
        <FormField
          control={form.control}
          name={`${prefix}.policeStationId`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground gap-1 text-base">
                Police Station <span className="text-destructive">*</span>
              </FormLabel>
              <Select
                disabled={!districtId}
                value={String(field.value || "")}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger className={triggerClass}>
                    {loadingPoliceStation ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <SelectValue
                        placeholder={
                          getLabel(policeStations, field.value) ||
                          "Select Police Station"
                        }
                      />
                    )}
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="border-[#D0D5DD]">
                  {policeStations.map((d) => (
                    <SelectItem key={d.id} value={String(d.id)}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Post Office */}
        <FormField
          control={form.control}
          name={`${prefix}.postOfficeId`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground gap-1 text-base">
                Post Office <span className="text-destructive">*</span>
              </FormLabel>
              <Select
                disabled={!districtId}
                value={String(field.value || "")}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger className={triggerClass}>
                    {loadingPostOffice ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <SelectValue
                        placeholder={
                          getLabel(postOffices, field.value, "postOffice") ||
                          "Select Post Office"
                        }
                      />
                    )}
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="border-[#D0D5DD]">
                  {postOffices.map((d) => (
                    <SelectItem key={d.id} value={String(d.id)}>
                      {d.postOffice} <span>({d.postCode})</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Ward No + Address Line */}
      <div className="mt-4 grid grid-cols-1 items-start gap-x-0 gap-y-4 xl:grid-cols-3 xl:gap-x-4">
        <div className="col-span-1">
          <FormField
            control={form.control}
            name={`${prefix}.wardNo`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground text-base">
                  Ward No.
                </FormLabel>
                <FormControl>
                  <Input
                    className="text-foreground h-10 border-[#D0D5DD] bg-white max-sm:h-11"
                    placeholder="Enter Ward No."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="col-span-1 xl:col-span-2">
          <FormField
            control={form.control}
            name={`${prefix}.addressLine`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground gap-1 text-base">
                  Address <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    className="text-foreground h-10 border-[#D0D5DD] bg-white max-sm:h-11"
                    placeholder="Enter address details like house no, road no, etc."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </>
  );
}
