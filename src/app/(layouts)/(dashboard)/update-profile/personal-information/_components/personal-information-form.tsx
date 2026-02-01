"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  PersonalInformationInput,
  personalInformationSchema,
} from "@/schemas/personal-information.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calendar,
  Globe,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { FormCheckbox } from "../../_components/form-checkbox";
import { FormInput } from "../../_components/form-input";
import Link from "next/link";

const PersonalInformationForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PersonalInformationInput>({
    resolver: zodResolver(personalInformationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      gender: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      receiveUpdates: false,
      agreeToTerms: false,
    },
  });

  const onSubmit = async (data: PersonalInformationInput) => {
    try {
      setIsLoading(true);
      console.log("Personal Information:", data);
      // TODO: Add API call to update personal information
      toast.success("Personal information updated successfully!");
    } catch {
      toast.error("Failed to update personal information. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Personal Information</h2>
        <p className="text-muted-foreground mt-1">
          Update your personal details and preferences
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormInput
              control={form.control}
              name="firstName"
              label="First Name"
              placeholder="Enter your first name"
              icon={User}
            />
            <FormInput
              control={form.control}
              name="lastName"
              label="Last Name"
              placeholder="Enter your last name"
              icon={User}
            />
          </div>

          {/* Contact Fields */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormInput
              control={form.control}
              name="email"
              label="Email Address"
              placeholder="email@example.com"
              type="email"
              icon={Mail}
            />
            <FormInput
              control={form.control}
              name="phone"
              label="Phone Number"
              placeholder="Enter your phone number"
              icon={Phone}
            />
          </div>

          {/* Date of Birth and Gender */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormInput
              control={form.control}
              name="dateOfBirth"
              label="Date of Birth"
              placeholder="YYYY-MM-DD"
              type="date"
              icon={Calendar}
            />
            <FormInput
              control={form.control}
              name="gender"
              label="Gender"
              placeholder="Enter your gender"
              icon={User}
            />
          </div>

          {/* Address */}
          <FormInput
            control={form.control}
            name="address"
            label="Address"
            placeholder="Enter your street address"
            icon={MapPin}
          />

          {/* City, State, Zip */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <FormInput
              control={form.control}
              name="city"
              label="City"
              placeholder="Enter city"
            />
            <FormInput
              control={form.control}
              name="state"
              label="State"
              placeholder="Enter state"
            />
            <FormInput
              control={form.control}
              name="zipCode"
              label="Zip Code"
              placeholder="Enter zip code"
            />
          </div>

          {/* Country */}
          <FormInput
            control={form.control}
            name="country"
            label="Country"
            placeholder="Enter your country"
            icon={Globe}
          />

          {/* Checkboxes */}
          <div className="space-y-4 pt-4">
            <FormCheckbox
              control={form.control}
              name="receiveUpdates"
              label="I want to receive updates about new job opportunities and career tips"
            />
            <FormCheckbox
              control={form.control}
              name="agreeToTerms"
              label={
                <>
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </>
              }
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isLoading} className="min-w-[150px]">
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PersonalInformationForm;
