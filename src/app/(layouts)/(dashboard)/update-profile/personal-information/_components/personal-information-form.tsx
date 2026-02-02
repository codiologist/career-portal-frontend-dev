"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  PersonalInfoValues,
  personalInformationSchema,
} from "@/schemas/personal-information.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ProfileContentCard from "../../../_components/profile-content-card";
import {
  DatePickerInput,
  TextAreaInput,
  TextInput,
} from "../../_components/form-inputs";

const PersonalInformationForm = () => {
  const form = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInformationSchema),
    defaultValues: {
      careerTitle: "",
      careerObjective: "",
      fullName: "",
      fatherName: "",
      motherName: "",
      dob: new Date(),
    },
  });

  function onSubmit(data: PersonalInfoValues) {
    console.log(data);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-14">
          <ProfileContentCard title="Career Details">
            <div className="space-y-6">
              <TextInput
                form={form}
                name="careerTitle"
                label="Position Title"
                placeholder="Enter your positon (i.e. Senior Software Engineer)"
                required
              />
              <TextAreaInput
                form={form}
                name="careerObjective"
                className="text-base!"
                label="Career Objective"
                placeholder="Tell us about yourself"
                required
              />
            </div>
          </ProfileContentCard>
          <ProfileContentCard title="Personal Information" className="mt-6">
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
              <TextInput
                form={form}
                name="fullName"
                label="Full Name"
                placeholder="Enter your full name"
                required
              />
              <TextInput
                form={form}
                name="fatherName"
                label="Father Name"
                placeholder="Enter your full name"
                required
              />
              <TextInput
                form={form}
                name="motherName"
                label="Mother Name"
                placeholder="Enter your full name"
                required
              />

              <DatePickerInput
                form={form}
                name="dob"
                label="Date of Birth (DD/MM/YYYY)"
                placeholder="Select your date of birth"
                required
              />
            </div>
          </ProfileContentCard>
        </div>
        <div className="mt-6 text-right">
          <Button type="submit" className="rounded-sm text-base font-semibold">
            Update
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PersonalInformationForm;
