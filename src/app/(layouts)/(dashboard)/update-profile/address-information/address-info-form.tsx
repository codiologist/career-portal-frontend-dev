"use client";
import { Form } from "@/components/ui/form";
// import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ProfileContentCard from "../../_components/profile-content-card";

import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAddressDropdown } from "@/hooks/useAddressDropdown";
import { Loader2 } from "lucide-react";
import { TextInput } from "../_components/form-inputs";

// 🔹 helper to show name from id
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getLabel = (list: any[], id: string | number, key = "name") =>
  list.find((i) => String(i.id) === String(id))?.[key];

export const AddressInfoForm = () => {
  const form = useForm({
    // resolver: zodResolver(addressSchema) as any,
    defaultValues: {
      divisionId: "",
      districtId: "",
      upazilaCityCorpId: "",
      unionMunicipalityId: "",
      policeStationId: "",
      postOfficeId: "",
      isSameAsPresent: false,
    },
  });

  const divisionId = form.watch("divisionId");
  const districtId = form.watch("districtId");
  const upazilaCityCorpId = form.watch("upazilaCityCorpId");
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {};

  return (
    <div>
      <div className="xl:border-dark-blue-200 xl:bg-dark-blue-200/10 rounded-4xl p-0 xl:border xl:p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
              <ProfileContentCard>
                <h1 className="text-dark-blue-700 mb-4 text-lg font-bold xl:text-2xl">
                  Present Address
                </h1>
                <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-3">
                  {/* Division */}
                  <FormField
                    control={form.control}
                    name="divisionId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="gap-1 text-base">
                          Division <span className="text-destructive">*</span>
                        </FormLabel>
                        <Select
                          value={String(field.value || "")}
                          onValueChange={(val) => {
                            field.onChange(val);
                            form.setValue("districtId", "");
                            form.setValue("upazilaCityCorpId", "");
                            form.setValue("policeStationId", "");
                            form.setValue("postOfficeId", "");
                          }}
                        >
                          <FormControl className="w-full">
                            <SelectTrigger className="[&>svg]:stroke-dark-blue-700 relative h-10! w-full border-[#D0D5DD] bg-white transition-all duration-300 max-sm:h-11 [&>svg]:h-6 [&>svg]:w-6 [&>svg]:opacity-100">
                              {loadingDivision ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <SelectValue
                                  placeholder={
                                    getLabel(divisions, field.value) ||
                                    "Select Division"
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
                    name="districtId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="gap-1 text-base">
                          District <span className="text-destructive">*</span>
                        </FormLabel>
                        <Select
                          disabled={!divisionId}
                          value={String(field.value || "")}
                          onValueChange={(val) => {
                            field.onChange(val);
                            form.setValue("upazilaCityCorpId", "");
                            form.setValue("policeStationId", "");
                            form.setValue("postOfficeId", "");
                          }}
                        >
                          <FormControl className="w-full">
                            <SelectTrigger className="[&>svg]:stroke-dark-blue-700 relative h-10! w-full border-[#D0D5DD] bg-white transition-all duration-300 max-sm:h-11 [&>svg]:h-6 [&>svg]:w-6 [&>svg]:opacity-100">
                              {loadingDistrict ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <SelectValue
                                  placeholder={
                                    getLabel(districts, field.value) ||
                                    "Select District"
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
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="upazilaCityCorpId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="gap-1 text-base">
                          Upazila/City Corporation
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <Select
                          disabled={!districtId}
                          value={String(field.value || "")}
                          onValueChange={(val) => {
                            field.onChange(val);
                            form.setValue("policeStationId", "");
                            form.setValue("postOfficeId", "");
                          }}
                        >
                          <FormControl>
                            <SelectTrigger className="[&>svg]:stroke-dark-blue-700 relative h-10! w-full border-[#D0D5DD] bg-white transition-all duration-300 max-sm:h-11 [&>svg]:h-6 [&>svg]:w-6 [&>svg]:opacity-100">
                              {loadingUpazila ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <SelectValue
                                  placeholder={
                                    getLabel(upazilas, field.value) ||
                                    "Select Upazila"
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
                      </FormItem>
                    )}
                  />

                  {/* Union */}
                  <FormField
                    control={form.control}
                    name="unionMunicipalityId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="gap-1 text-base">
                          Union/Municipality{" "}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <Select
                          disabled={!districtId}
                          value={String(field.value || "")}
                          onValueChange={(val) => {
                            field.onChange(val);
                            form.setValue("policeStationId", "");
                            form.setValue("postOfficeId", "");
                          }}
                        >
                          <FormControl>
                            <SelectTrigger className="[&>svg]:stroke-dark-blue-700 relative h-10! w-full border-[#D0D5DD] bg-white transition-all duration-300 max-sm:h-11 [&>svg]:h-6 [&>svg]:w-6 [&>svg]:opacity-100">
                              {loadingUnionMunicipality ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <SelectValue
                                  placeholder={
                                    getLabel(
                                      unionsMunicipalities,
                                      field.value,
                                    ) || "Select Upazila"
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
                      </FormItem>
                    )}
                  />

                  {/* Police Station */}
                  <FormField
                    control={form.control}
                    name="policeStationId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="gap-1 text-base">
                          Police Station{" "}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <Select
                          disabled={!districtId}
                          value={String(field.value || "")}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className="[&>svg]:stroke-dark-blue-700 relative h-10! w-full border-[#D0D5DD] bg-white transition-all duration-300 max-sm:h-11 [&>svg]:h-6 [&>svg]:w-6 [&>svg]:opacity-100">
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
                      </FormItem>
                    )}
                  />

                  {/* Post Office */}
                  <FormField
                    control={form.control}
                    name="postOfficeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="gap-1 text-base">
                          Post Office{" "}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <Select
                          disabled={!districtId}
                          value={String(field.value || "")}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger className="[&>svg]:stroke-dark-blue-700 relative h-10! w-full border-[#D0D5DD] bg-white transition-all duration-300 max-sm:h-11 [&>svg]:h-6 [&>svg]:w-6 [&>svg]:opacity-100">
                              {loadingPostOffice ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <SelectValue
                                  placeholder={
                                    getLabel(
                                      postOffices,
                                      field.value,
                                      "postOffice",
                                    ) || "Select Post Office"
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
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mt-4 grid grid-cols-1 items-start gap-x-0 gap-y-4 xl:grid-cols-3 xl:gap-x-4">
                  <div className="col-span-1">
                    <TextInput
                      label="Ward No."
                      form={form}
                      name="wardNo"
                      placeholder="Enter Ward No."
                    />
                  </div>

                  <div className="col-span-2">
                    <TextInput
                      label="Address"
                      form={form}
                      name="addressLine"
                      placeholder="Enter address details like house no, road no, etc."
                      required
                    />
                  </div>
                </div>
              </ProfileContentCard>
              <ProfileContentCard>
                <h1 className="text-dark-blue-700 mb-4 text-lg font-bold xl:text-2xl">
                  Permanent Address
                </h1>
                <FormField
                  control={form.control}
                  name="isSameAsPresent"
                  render={({ field }) => (
                    <FormItem className={`mt-3 flex items-center gap-2`}>
                      <FormControl>
                        <Checkbox
                          className="h-5 w-5 [&_svg]:h-4.5 [&_svg]:w-4.5"
                          checked={!!field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>

                      <FormLabel className="text-dark-blue-700 !mt-0 cursor-pointer text-base font-semibold">
                        Is same as present address?
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </ProfileContentCard>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
