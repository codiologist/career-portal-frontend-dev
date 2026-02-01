"use client"

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import type { UseFormReturn } from "react-hook-form"

interface CheckboxInputProps {
  form: UseFormReturn<any>
  name: string
  label: string
  required?: boolean
  disabled?: boolean
}

export const CheckboxInput = ({ form, name, label, required = false, disabled = false }: CheckboxInputProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-2">
          <FormControl>
            <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={disabled} />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel className="cursor-pointer">
              {label} {required && <span className="text-destructive">*</span>}
            </FormLabel>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
