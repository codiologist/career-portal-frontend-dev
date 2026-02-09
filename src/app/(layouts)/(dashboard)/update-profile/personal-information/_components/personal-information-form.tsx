"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import api from "@/lib/axiosInstance";

import { socialLinksDropdown } from "@/_data/social_links_dropdown";
import { useAuth } from "@/context/AuthContext";
import {
  PersonalInfoValues,
  personalInformationSchema,
} from "@/schemas/personal-information.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BriefcaseBusiness,
  Edit,
  IdCard,
  Link,
  Mail,
  Plus,
  TextInitial,
  Trash2,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Resolver, useFieldArray, useForm } from "react-hook-form";
import { FaMobileAlt } from "react-icons/fa";
import { LiaUserTieSolid } from "react-icons/lia";
import { TUserOptionsStrict } from "../../../../../../types/dropdown-types";
import ProfileContentCard from "../../../_components/profile-content-card";
import {
  DatePickerInput,
  SelectInput,
  TextAreaInput,
  TextInput,
} from "../../_components/form-inputs";
import { MultiSelectInput } from "../../_components/multi-select-input";

const PersonalInformationForm = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { isAuthenticated, user } = useAuth();
  const [personalDropdownData, setPersonalDropdownData] =
    useState<TUserOptionsStrict>();
  const [showSpouseField, setShowSpouseField] = useState(false);

  console.log("All Dropdown", personalDropdownData);

  const form = useForm<PersonalInfoValues>({
    resolver: zodResolver(
      personalInformationSchema,
    ) as unknown as Resolver<PersonalInfoValues>,
    defaultValues: {
      careerTitle: "",
      careerObjective: "",
      fullName: "",
      fatherName: "",
      motherName: "",
      spouseName: "",
      dob: undefined,
      mobileNo: "",
      alternatePhone: "",
      emailAddress: "",
      gender: "",
      religionId: "",
      bloodGroupId: "",
      maritalStatus: "",
      nationality: "",
      nationalId: "",
      socialLink: [{ label: "", url: "" }],
      portfolioLink: "",
      skillIds: [], // 👈 REQUIRED
      interstIds: [],
    },
  });

  const maritalStatus = form.watch("maritalStatus");

  useEffect(() => {
    const isMarried = maritalStatus === "MARRIED";
    setShowSpouseField(isMarried);
    if (!isMarried) {
      form.setValue("spouseName", "", { shouldValidate: true });
    }
  }, [maritalStatus, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "socialLink",
  });

  const profileRef = useRef<any>(null);

  useEffect(() => {
    const dropdownData = async (): Promise<void> => {
      const res = await api.get("/user/profile/personal/dropdown");
      const getProfileData = await api.get("/user/me");

      setPersonalDropdownData(res.data.data);

      const profileRes = getProfileData?.data?.data
        ? getProfileData?.data?.data
        : null;
      profileRef.current = profileRes;
      form.setValue("fullName", profileRes?.fullName || "");
      form.setValue("emailAddress", profileRes?.email || "");
      form.setValue("mobileNo", profileRes?.phone || "");

      if (!getProfileData) return;

      form.reset({
        fullName: profileRes.fullName ?? "",
        fatherName: profileRes?.candidatePersonal?.fatherName ?? "",
        motherName: profileRes?.candidatePersonal?.motherName ?? "",
        spouseName: profileRes?.candidatePersonal?.spouseName ?? "",
        dob: profileRes?.candidatePersonal?.dob ?? undefined,
        gender: profileRes?.candidatePersonal?.gender ?? "",
        maritalStatus: profileRes?.candidatePersonal?.maritalStatus ?? "",
        nationality: profileRes?.candidatePersonal?.nationality ?? "",
        nationalId: profileRes?.candidatePersonal?.nationalId ?? "",
        emailAddress: profileRes.email ?? "",
        mobileNo: profileRes.phone ?? "",
        alternatePhone: profileRes?.candidatePersonal?.alternatePhone ?? "",
        careerTitle: profileRes?.candidatePersonal?.careerTitle ?? "",
        careerObjective: profileRes?.candidatePersonal?.careerObjective ?? "",
        portfolioLink: profileRes?.candidatePersonal?.portfolioLink ?? "",
        skillIds: profileRes?.candidatePersonal?.skills
          ? profileRes.candidatePersonal.skills.map((skill: any) =>
              typeof skill === "string" ? skill : skill.id,
            )
          : [],
        interstIds: profileRes?.candidatePersonal?.interests
          ? profileRes.candidatePersonal.interests.map((interest: any) =>
              typeof interest === "string" ? interest : interest.id,
            )
          : [],
        socialLink: profileRes?.candidatePersonal?.socialLink
          ? profileRes.candidatePersonal.socialLink.map((link: any) => ({
              label: link.label,
              url: link.url,
            }))
          : [],
      });

      console.log("Profile Data", profileRes?.candidatePersonal);
    };

    // call the async loader
    void dropdownData();
  }, [form]);

  useEffect(() => {
    const religionId = profileRef.current?.candidatePersonal?.religion?.id;
    const bloodGroupId = profileRef.current?.candidatePersonal?.bloodGroup?.id;

    if (religionId && personalDropdownData?.religion) {
      form.setValue("religionId", religionId, {
        shouldValidate: true,
        shouldDirty: false,
      });
    }
    if (bloodGroupId && personalDropdownData?.bloodGroup) {
      form.setValue("bloodGroupId", bloodGroupId, {
        shouldValidate: true,
        shouldDirty: false,
      });
    }
  }, [personalDropdownData?.religion, personalDropdownData?.bloodGroup, form]);

  async function onSubmit(data: PersonalInfoValues) {
    const payload = {
      ...data,
      dob: data.dob instanceof Date ? data.dob.toISOString() : data.dob,
    };
    try {
      const res = await api.post("/user/profile/personal", payload);
      console.log("Profile Response", res.data);
    } catch (error) {
      console.error("Error updating personal information:", error);
    }
    console.log(payload);
  }
  return (
    <div className="space-y-10">
      <div className="xl:border-dark-blue-200 xl:bg-dark-blue-200/10 rounded-4xl p-0 xl:border xl:p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-10">
              <section>
                <ProfileContentCard>
                  <h1 className="text-dark-blue-700 mb-4 text-lg font-bold xl:text-2xl">
                    Career Objective
                  </h1>
                  <div className="space-y-6">
                    <TextInput
                      form={form}
                      name="careerTitle"
                      label="Position Title"
                      placeholder="Enter your positon (i.e. Senior Software Engineer)"
                      required
                      icon={<BriefcaseBusiness />}
                    />
                    <TextAreaInput
                      form={form}
                      name="careerObjective"
                      className="h-60! text-base!"
                      label="Career Objective"
                      placeholder="Tell us about yourself"
                      required
                      icon={<TextInitial />}
                    />
                  </div>
                </ProfileContentCard>
              </section>

              <section>
                <ProfileContentCard>
                  <h1 className="text-dark-blue-700 mb-4 text-lg font-bold xl:text-2xl">
                    Personal Information
                  </h1>
                  <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                    <TextInput
                      form={form}
                      name="fullName"
                      label="Full Name"
                      placeholder="Enter your full name"
                      required
                      icon={<LiaUserTieSolid className="size-6.5" />}
                    />
                    <TextInput
                      form={form}
                      name="fatherName"
                      label="Father Name"
                      placeholder="Enter your full name"
                      required
                      icon={<User />}
                    />
                    <TextInput
                      form={form}
                      name="motherName"
                      label="Mother Name"
                      placeholder="Enter your full name"
                      required
                      icon={<User />}
                    />
                    <DatePickerInput
                      form={form}
                      name="dob"
                      label="Date of Birth (DD/MM/YYYY)"
                      placeholder="Select your date of birth"
                      required
                    />
                    <TextInput
                      form={form}
                      name="mobileNo"
                      label="Mobile Number"
                      placeholder="Enter your mobile number"
                      required
                      icon={<FaMobileAlt className="size-5.5" />}
                    />
                    <TextInput
                      form={form}
                      name="alternatePhone"
                      label="Alternate Mobile Number"
                      placeholder="Enter your alternate mobile number"
                      icon={<FaMobileAlt className="size-5.5" />}
                    />
                    <TextInput
                      form={form}
                      name="emailAddress"
                      label="Email Address"
                      placeholder="Enter your email address"
                      required
                      icon={<Mail className="size-5.5" />}
                      disabled
                    />
                    <SelectInput
                      form={form}
                      name="gender"
                      label="Gender"
                      placeholder="Select Gender"
                      options={[
                        { label: "Male", value: "MALE" },
                        { label: "Female", value: "FEMALE" },
                        { label: "Other", value: "OTHER" },
                      ]}
                      required
                    />

                    <SelectInput
                      form={form}
                      name="religionId"
                      label="Religion"
                      options={
                        Array.isArray(personalDropdownData?.religion)
                          ? personalDropdownData.religion.map((r) => ({
                              label: r.name,
                              value: r.id,
                            }))
                          : personalDropdownData?.religion
                            ? [
                                {
                                  label: personalDropdownData.religion.name,
                                  value: personalDropdownData.religion.id,
                                },
                              ]
                            : []
                      }
                      required
                    />

                    <SelectInput
                      form={form}
                      name="bloodGroupId"
                      label="Blood Group"
                      options={
                        Array.isArray(personalDropdownData?.bloodGroup)
                          ? personalDropdownData.bloodGroup.map((r) => ({
                              label: r.name,
                              value: r.id,
                            }))
                          : personalDropdownData?.bloodGroup
                            ? [
                                {
                                  label: personalDropdownData.bloodGroup.name,
                                  value: personalDropdownData.bloodGroup.id,
                                },
                              ]
                            : []
                      }
                      required
                    />
                    <SelectInput
                      form={form}
                      name="maritalStatus"
                      label="Marital Status"
                      placeholder="Select marital status"
                      options={[
                        { label: "Unmarried", value: "UNMARRIED" },
                        { label: "Married", value: "MARRIED" },
                        { label: "Other", value: "OTHER" },
                      ]}
                      required
                    />
                    {showSpouseField && (
                      <TextInput
                        form={form}
                        name="spouseName"
                        label="Spouse's Name"
                        placeholder="Enter your spouse's name"
                        required={maritalStatus === "MARRIED"}
                      />
                    )}

                    <TextInput
                      form={form}
                      name="nationality"
                      label="Nationality"
                      placeholder="Enter nationality"
                      required
                      icon={<IdCard className="size-6.5" />}
                    />
                    <TextInput
                      form={form}
                      name="nationalId"
                      label="NID No."
                      placeholder="Enter NID No."
                      required
                      icon={<IdCard className="size-6.5" />}
                    />
                  </div>
                </ProfileContentCard>
              </section>

              <section className="flex flex-col gap-6 xl:flex-row">
                <ProfileContentCard>
                  <h1 className="text-dark-blue-700 mb-2 text-lg font-bold xl:text-2xl">
                    Skills
                  </h1>

                  <MultiSelectInput
                    control={form.control}
                    name="skillIds"
                    required
                    placeholder="Select skills"
                    options={
                      Array.isArray(personalDropdownData?.skills)
                        ? personalDropdownData.skills.map((s) => ({
                            id: s.id,
                            label: s.skillName,
                          }))
                        : personalDropdownData?.skills
                          ? [
                              {
                                id: personalDropdownData.skills.id,
                                label: personalDropdownData.skills.skillName,
                              },
                            ]
                          : []
                    }
                  />
                </ProfileContentCard>

                <ProfileContentCard>
                  <h1 className="text-dark-blue-700 mb-2 text-lg font-bold xl:text-2xl">
                    Interest
                  </h1>
                  <MultiSelectInput
                    control={form.control}
                    name="interstIds"
                    required
                    placeholder="Select Interest"
                    options={
                      Array.isArray(personalDropdownData?.interests)
                        ? personalDropdownData.interests.map((s) => ({
                            id: s.id,
                            label: s.interstName,
                          }))
                        : personalDropdownData?.interests
                          ? [
                              {
                                id: personalDropdownData.interests.id,
                                label:
                                  personalDropdownData.interests.interstName,
                              },
                            ]
                          : []
                    }
                  />
                </ProfileContentCard>
              </section>

              <section>
                <ProfileContentCard>
                  <div className="space-y-6">
                    <div>
                      <h1 className="text-dark-blue-700 mb-1 text-lg font-bold xl:text-xl">
                        Portfolio Link
                      </h1>
                      <TextInput
                        form={form}
                        name="portfolioLink"
                        placeholder="Enter your portfolio URL"
                        icon={<Link className="size-4.5" />}
                      />
                    </div>
                    <div>
                      <h1 className="text-dark-blue-700 mb-1 text-lg font-bold xl:text-xl">
                        Social Links
                      </h1>

                      <div>
                        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                          {fields.map((field, index) => (
                            <div
                              key={field.id}
                              className="flex w-full flex-col gap-x-2 xl:flex-row xl:items-center"
                            >
                              <div className="flex gap-2">
                                <div className="flex-1">
                                  <SelectInput
                                    form={form}
                                    name={`socialLink.${index}.label`}
                                    options={socialLinksDropdown}
                                  />
                                </div>
                                {fields.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    className="mt-2 block xl:hidden"
                                    onClick={() => remove(index)}
                                  >
                                    <Trash2 />
                                  </Button>
                                )}
                              </div>

                              <div className="flex-1">
                                <TextInput
                                  form={form}
                                  name={`socialLink.${index}.url`}
                                  placeholder="Enter your social link"
                                  icon={<Link className="size-4.5" />}
                                />
                              </div>

                              {fields.length > 1 && (
                                <Button
                                  type="button"
                                  variant="destructive"
                                  className="mt-2 hidden xl:block"
                                  onClick={() => remove(index)}
                                >
                                  <Trash2 />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          className="mt-2"
                          onClick={() => append({ label: "", url: "" })}
                        >
                          <Plus /> Add More Link
                        </Button>
                      </div>
                    </div>
                  </div>
                </ProfileContentCard>
              </section>

              <div className="mt-6 text-right">
                <Button
                  type="submit"
                  className="rounded-sm text-base font-semibold"
                >
                  <Edit />
                  Update
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default PersonalInformationForm;
