"use client";

import { Button } from "@/components/ui/button";
import { ReferenceInfoFormValues } from "@/schemas/reference.schema";
import { BriefcaseBusiness, Building2, Mail, Trash2, User } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { FaMobileAlt } from "react-icons/fa";
import { PiHandshake } from "react-icons/pi";
import { TextInput } from "../../_components/form-inputs";

interface ReferenceCardProps {
  index: number;
  form: UseFormReturn<ReferenceInfoFormValues>;
  onRemove: () => void;
  canRemove: boolean;
}

export default function ReferenceCard({
  index,
  form,
  onRemove,
  canRemove,
}: ReferenceCardProps) {
  return (
    <div className="border-border bg-card relative rounded-lg border p-5 md:p-6">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-dark-blue-700 mb-1 text-lg font-bold xl:text-2xl">
          Reference - {index + 1}
        </h1>
        {canRemove && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-red-600 text-sm font-semibold text-red-600! hover:bg-red-600 focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            onClick={onRemove}
          >
            <Trash2 className="mr-1 h-4 w-4" />
            Remove
          </Button>
        )}
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Reference Name */}
        <TextInput
          form={form}
          name={`references.${index}.name`}
          label="Reference Name"
          placeholder="Enter reference name"
          required
          icon={<User className="size-5" />}
        />
        <TextInput
          form={form}
          name={`references.${index}.designation`}
          label="Designation"
          placeholder="Enter designation"
          required
          icon={<BriefcaseBusiness className="size-5" />}
        />
        <TextInput
          form={form}
          name={`references.${index}.companyName`}
          label="Company Name"
          placeholder="Enter company name"
          required
          icon={<Building2 className="size-5" />}
        />
        <TextInput
          form={form}
          name={`references.${index}.phone`}
          label="Phone"
          placeholder="Enter phone number"
          required
          icon={<FaMobileAlt className="size-5" />}
        />
        <TextInput
          form={form}
          name={`references.${index}.emailAddress`}
          label="Email Address"
          placeholder="Enter email address"
          required
          icon={<Mail className="size-5" />}
        />
        <TextInput
          form={form}
          name={`references.${index}.relationship`}
          label="Relationship"
          placeholder="Enter relationship"
          required
          icon={<PiHandshake className="size-5.5" />}
        />
      </div>
    </div>
  );
}
