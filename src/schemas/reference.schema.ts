import { z } from "zod";

const referenceEntrySchema = z.object({
  name: z.string().min(10, "Reference name is required"),
  designation: z.string().min(5, "Designation is required"),
  companyName: z.string().min(5, "Company name is required"),
  phone: z
    .string()
    .max(11, {
      message: "Phone number not more than 11 digit.",
    })
    .regex(/^(\+880\s?|0)1[3-9]\d{2}-?\d{6}$/, "Invalid phone number."),
  alternatePhone: z
    .string()
    .optional()
    .refine((val) => !val || /^(\+880\s?|0)1[3-9]\d{2}-?\d{6}$/.test(val), {
      message: "Invalid phone number.",
    }),
  emailAddress: z.string().email({
    message: "Please enter a valid email address.",
  }),
  relationship: z.string().min(3, "Relationship is required"),
});

export const referenceInfoFormSchema = z.object({
  references: z
    .array(referenceEntrySchema)
    .min(1, "At least one reference entry is required"),
});

export type ReferenceInfoFormValues = z.infer<typeof referenceInfoFormSchema>;

export const defaultReference = {
  name: "",
  designation: "",
  phone: "",
  emailAddress: "",
  relationship: "",
};
