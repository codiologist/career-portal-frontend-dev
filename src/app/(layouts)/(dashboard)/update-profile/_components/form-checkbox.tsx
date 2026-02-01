"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Control, FieldValues, Path } from "react-hook-form";
import { ReactNode } from "react";

interface FormCheckboxProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string | ReactNode;
  className?: string;
  disabled?: boolean;
}

export function FormCheckbox<T extends FieldValues>({
  control,
  name,
  label,
  className,
  disabled = false,
}: FormCheckboxProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex items-start gap-2", className)}>
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          </FormControl>
          {label && (
            <FormLabel className="text-sm font-normal leading-tight">
              {label}
            </FormLabel>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
