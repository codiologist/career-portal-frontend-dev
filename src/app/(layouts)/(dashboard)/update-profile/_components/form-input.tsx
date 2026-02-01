"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Control, FieldValues, Path } from "react-hook-form";

interface FormInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  type?: string;
  icon?: LucideIcon;
  className?: string;
  disabled?: boolean;
}

export function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  icon: Icon,
  className,
  disabled = false,
}: FormInputProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <div className="relative">
              {Icon && (
                <Icon className="text-muted-foreground absolute top-2.5 left-3 h-5 w-5" />
              )}
              <Input
                {...field}
                type={type}
                disabled={disabled}
                className={cn("rounded-sm", Icon && "pl-10")}
                placeholder={placeholder}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
