"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { ExperienceInfoFormValues } from "@/schemas/experience.schema";
import {
  Briefcase,
  Building2,
  IdCardLanyard,
  MapPin,
  TextInitial,
  Toolbox,
  Trash2,
} from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import {
  DatePickerInput,
  TextAreaInput,
  TextInput,
} from "../../_components/form-inputs";

interface SingleExperienceCardProps {
  form: UseFormReturn<ExperienceInfoFormValues>;
  index: number;
  onRemove: () => void;
  canRemove: boolean;
}

export function SingleExperienceCard({
  form,
  index,
  onRemove,
  canRemove,
}: SingleExperienceCardProps) {
  const isContinue = form.watch(`experiences.${index}.isContinue`);

  return (
    <div className="border-border bg-card relative rounded-lg border p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-dark-blue-700 mb-1 text-lg font-bold xl:text-2xl">
          Experience - {index + 1}
        </h1>
        {canRemove && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-red-600 text-sm font-semibold text-red-600! hover:bg-red-600 focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            onClick={onRemove}
            aria-label={`Remove experience ${index + 1}`}
          >
            <Trash2 className="h-5 w-5" />
            Remove
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 align-baseline xl:grid-cols-2">
        <TextInput
          form={form}
          name={`experiences.${index}.designation`}
          label="Designation"
          placeholder="e.g. Software Engineer"
          required
          icon={<Briefcase className="size-5" />}
        />

        <TextInput
          form={form}
          name={`experiences.${index}.department`}
          label="Department"
          placeholder="e.g. Engineering"
          required
          icon={<IdCardLanyard className="size-5" />}
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 align-baseline xl:grid-cols-3">
        <TextInput
          form={form}
          name={`experiences.${index}.companyName`}
          label="Company Name"
          placeholder="e.g. Google"
          required
          icon={<Building2 className="size-5" />}
        />

        <TextInput
          form={form}
          name={`experiences.${index}.companyBusinessType`}
          label="Company Business Type"
          placeholder="e.g. Technology"
          required
          icon={<Toolbox className="size-5" />}
        />

        <TextInput
          form={form}
          name={`experiences.${index}.location`}
          label="Location"
          placeholder="e.g. Dhaka, Chattogram"
          required
          icon={<MapPin className="size-5" />}
        />

        <div>
          <DatePickerInput
            form={form}
            name={`experiences.${index}.startDate`}
            label="Employment Period Start Date"
            placeholder="Select start date"
            required
          />
        </div>

        <div className={cn(!isContinue ? "block" : "hidden")}>
          {!isContinue && (
            <DatePickerInput
              form={form}
              name={`experiences.${index}.endDate`}
              label="Employment Period End Date"
              placeholder="Select end date"
              required
            />
          )}
        </div>

        <div className={cn(!isContinue ? "mt-0 xl:mt-7" : "mt-10")}>
          <FormField
            control={form.control}
            name={`experiences.${index}.isContinue`}
            render={({ field }) => (
              <FormItem
                className={`flex items-center gap-2 ${!isContinue ? "mt-2.5" : "mt-0"}`}
              >
                <FormControl>
                  <Checkbox
                    className="h-5 w-5 [&_svg]:h-4.5 [&_svg]:w-4.5"
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      if (checked) {
                        form.setValue(
                          `experiences.${index}.endDate`,
                          undefined,
                          {
                            shouldValidate: true,
                          },
                        );
                      }
                    }}
                  />
                </FormControl>
                <FormLabel className="text-dark-blue-700 !mt-0 cursor-pointer text-base font-semibold">
                  I currently work here (Continue)
                </FormLabel>
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="mt-5">
        <TextAreaInput
          form={form}
          name={`experiences.${index}.responsibilities`}
          className="h-40! text-base!"
          label="Responsibilities"
          placeholder="Tell us about job responsibilities"
          required
          icon={<TextInitial />}
        />
      </div>
    </div>
  );
}
