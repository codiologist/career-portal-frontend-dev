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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type React from "react"; // Keep this if you have other React specific types
import type { ReactNode } from "react";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

// New imports for Combobox
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

// Common Text Input Component
interface TextInputProps<T extends FieldValues> {
  form: UseFormReturn<any>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: "text" | "number" | "tel" | "email";
  icon?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  maxLength?: number;
  minLength?: number;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}
export const TextInput = <T extends FieldValues>({
  form,
  name,
  label,
  placeholder = "Enter your text",
  type = "text",
  icon,
  required = false,
  disabled = false,
  onChange,
  maxLength,
  minLength,
  inputMode,
}: TextInputProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="form-inoput-item">
          <FormLabel>
            {label} {required && <span className="text-destructive">*</span>}
          </FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                className={cn(
                  "h-10 border-[#D0D5DD] bg-white disabled:bg-gray-200 disabled:text-gray-900 disabled:opacity-100 max-sm:h-11",
                  icon && "pr-12",
                )}
                type={type}
                placeholder={`${placeholder}`}
                disabled={disabled}
                {...field}
                onChange={(e) => {
                  field.onChange(e); // react-hook-form binding
                  onChange?.(e); // your custom logic if provided
                }}
                maxLength={maxLength}
                minLength={minLength}
                inputMode={inputMode} // Add this line
              />
              {icon && (
                <div className="absolute right-3 top-0 flex h-full items-center justify-center text-tertiary-primary">
                  {icon}
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

// Common Textarea Component
interface TextAreaInputProps {
  form: UseFormReturn<any>; // Use UseFormReturn<any> if T is not needed here
  name: string; // Or Path<T> if you want to make it generic
  label: string;
  placeholder?: string;
  icon?: ReactNode;
  required?: boolean;
}

export const TextAreaInput = ({
  form,
  name,
  label,
  placeholder = "Enter your text",
  icon,
  required = false,
}: TextAreaInputProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label} {required && <span className="text-destructive">*</span>}
          </FormLabel>
          <FormControl>
            <div className="relative">
              <Textarea
                className={cn(
                  "placeholder:text-primary-gray h-20 rounded-none border-[#D0D5DD] bg-white disabled:bg-gray-200 disabled:text-gray-900 disabled:opacity-100 lg:h-28",
                  icon && "pr-12",
                )}
                placeholder={placeholder}
                {...field}
              />
              {icon && (
                <div className="text-primary-gray absolute right-3 top-0 flex h-full items-center justify-center">
                  {icon}
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

// Common Select Component
export interface SelectOption {
  // Exporting for use in other files
  label: string;
  value: string | number;
}

interface SelectInputProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder?: string;
  options: SelectOption[];
  required?: boolean;
  disabled?: boolean;
}

export const SelectInput = ({
  form,
  name,
  label,
  placeholder = "Please select",
  options,
  required = false,
  disabled = false,
}: SelectInputProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="form-inoput-item select-input">
          <FormLabel>
            {label} {required && <span className="text-destructive">*</span>}
          </FormLabel>
          <Select
            value={
              field.value !== undefined && field.value !== null
                ? String(field.value)
                : ""
            }
            onValueChange={(selectedValue) => {
              const matchedOption = options.find(
                (opt) => String(opt.value) === selectedValue,
              );
              if (matchedOption) {
                form.setValue(name, matchedOption.value, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              } else {
                form.setValue(name, undefined, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }
            }}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger className="relative h-10 border-[#D0D5DD] bg-white transition-all duration-300 max-sm:h-11 [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-tertiary-primary/60 [&>svg]:opacity-100">
                <SelectValue
                  className="placeholder:!text-primary-gray"
                  placeholder={placeholder}
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="border-[#D0D5DD]">
              {options.map((option) => (
                <SelectItem
                  key={String(option.value)}
                  value={String(option.value)}
                  className="cursor-pointer"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

// Common Combobox Input Component
interface ComboBoxInputProps {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder?: string;
  options: SelectOption[];
  required?: boolean;
  disabled?: boolean;
  searchPlaceholder?: string;
  notFoundText?: string;
}

export const ComboBoxInput = ({
  form,
  name,
  label,
  placeholder = "Select an option",
  options,
  required = false,
  disabled = false,
  searchPlaceholder = "Search...",
  notFoundText = "No option found.",
}: ComboBoxInputProps) => {
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="form-inoput-item combobox-input">
          <FormLabel>
            {label} {required && <span className="text-destructive">*</span>}
          </FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild disabled={disabled}>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    "h-10 w-full justify-between border-[#D0D5DD] bg-white font-normal hover:bg-white max-sm:h-11",
                    !field.value && "text-muted-foreground",
                  )}
                >
                  {field.value
                    ? options.find(
                        (option) =>
                          String(option.value) === String(field.value),
                      )?.label
                    : placeholder}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] border-[#D0D5DD] p-0">
              <Command>
                <CommandInput placeholder={searchPlaceholder} />
                <CommandList>
                  <CommandEmpty>{notFoundText}</CommandEmpty>
                  <CommandGroup>
                    {options.map((option) => (
                      <CommandItem
                        key={String(option.value)}
                        value={option.label} // Search by label
                        onSelect={() => {
                          form.setValue(name, option.value, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            String(option.value) === String(field.value)
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {option.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
