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
import {
  type AddressInitialValues,
  useAddressDropdown,
} from "@/hooks/useAddressDropdown";
import { Loader2 } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getLabel = (list: any[], id: string | number, key = "name") =>
  list.find((i) => String(i.id) === String(id))?.[key];

interface AddressFieldsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  prefix: string;
  initialValues?: AddressInitialValues;
}

export function AddressFields({
  form,
  prefix,
  initialValues,
}: AddressFieldsProps) {
  // Watch all relevant fields for UI state
  const divisionId = form.watch(`${prefix}.divisionId`) ?? "";
  const districtId = form.watch(`${prefix}.districtId`) ?? "";
  const upazilaCityCorpId = form.watch(`${prefix}.upazilaCityCorpId`) ?? "";
  const unionMunicipalityId = form.watch(`${prefix}.unionMunicipalityId`) ?? "";
  const upazilaId = form.watch(`${prefix}.upazilaId`) ?? "";
  const cityCorporationId = form.watch(`${prefix}.cityCorporationId`) ?? "";

  // Show union/municipality field when upazilaId is set (not city corporation).
  // This correctly handles both manual selection and pre-fill via the hook.
  const showUnionMuncField = !!upazilaId && !cityCorporationId;

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
  } = useAddressDropdown(
    divisionId,
    districtId,
    upazilaId,
    prefix,
    form,
    initialValues,
  );

  // Manual selection handler for upazila/city-corp combo
  const handleUpazilaCityCorpChange = (val: string) => {
    form.setValue(`${prefix}.upazilaCityCorpId`, val, { shouldDirty: true });
    form.setValue(`${prefix}.upazilaId`, "");
    form.setValue(`${prefix}.cityCorporationId`, "");
    form.setValue(`${prefix}.unionMunicipalityId`, "");
    form.setValue(`${prefix}.unionParishadId`, "");
    form.setValue(`${prefix}.municipalityId`, "");
    form.setValue(`${prefix}.policeStationId`, "");
    form.setValue(`${prefix}.postOfficeId`, "");

    const found = upazilas.find((u) => String(u.id) === String(val));
    if (found?.type === "UPAZILA") {
      form.setValue(`${prefix}.upazilaId`, val, { shouldDirty: true });
    } else if (found?.type === "CITY_CORPORATION") {
      form.setValue(`${prefix}.cityCorporationId`, val, { shouldDirty: true });
    }
  };

  // Manual selection handler for union/municipality combo
  const handleUnionMunicipalityChange = (val: string) => {
    form.setValue(`${prefix}.unionMunicipalityId`, val, { shouldDirty: true });
    form.setValue(`${prefix}.unionParishadId`, "");
    form.setValue(`${prefix}.municipalityId`, "");

    const found = unionsMunicipalities.find(
      (u) => String(u.id) === String(val),
    );
    if (found?.type === "UNION") {
      form.setValue(`${prefix}.unionParishadId`, val, { shouldDirty: true });
    } else if (found?.type === "MUNICIPALITY") {
      form.setValue(`${prefix}.municipalityId`, val, { shouldDirty: true });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errors = form.formState.errors as any;
  const upazilaCityCorpError =
    errors?.[prefix]?.upazilaId?.message ||
    errors?.[prefix]?.cityCorporationId?.message;
  const unionMunicipalityError =
    errors?.[prefix]?.unionParishadId?.message ||
    errors?.[prefix]?.municipalityId?.message;

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
                  form.setValue(`${prefix}.upazilaId`, "");
                  form.setValue(`${prefix}.cityCorporationId`, "");
                  form.setValue(`${prefix}.unionMunicipalityId`, "");
                  form.setValue(`${prefix}.unionParishadId`, "");
                  form.setValue(`${prefix}.municipalityId`, "");
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
                  form.setValue(`${prefix}.upazilaId`, "");
                  form.setValue(`${prefix}.cityCorporationId`, "");
                  form.setValue(`${prefix}.unionMunicipalityId`, "");
                  form.setValue(`${prefix}.unionParishadId`, "");
                  form.setValue(`${prefix}.municipalityId`, "");
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

        {/* Upazila / City Corporation */}
        <div>
          <FormField
            control={form.control}
            name={`${prefix}.upazilaCityCorpId`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground gap-1 text-base">
                  Upazila/City Corporation{" "}
                  <span className="text-destructive">*</span>
                </FormLabel>
                <Select
                  disabled={!districtId}
                  value={String(field.value || "")}
                  onValueChange={handleUpazilaCityCorpChange}
                >
                  <FormControl>
                    <SelectTrigger className={triggerClass}>
                      {loadingUpazila ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <SelectValue
                          placeholder={
                            getLabel(upazilas, field.value) ||
                            "Select Upazila/City Corporation"
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

        {/* Union / Municipality */}
        {showUnionMuncField && (
          <div>
            <FormField
              control={form.control}
              name={`${prefix}.unionMunicipalityId`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground gap-1 text-base">
                    Union/Municipality{" "}
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select
                    disabled={!upazilaId}
                    value={String(field.value || "")}
                    onValueChange={handleUnionMunicipalityChange}
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
              {...form.register(`${prefix}.unionParishadId`)}
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
