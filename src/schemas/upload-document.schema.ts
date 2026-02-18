import { z } from "zod";

export const DocumentNameEnum = z.enum([
  "NID",
  "PASSPORT",
  "BIRTH_CERTIFICATE",
  "DRIVING_LICENSE",
  "TIN_CERTIFICATE",
  "STUDENT_ID",
  "MARRIAGE_CERTIFICATE",
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const documentFormSchema = z.object({
  name: DocumentNameEnum,

  documentNo: z
    .string()
    .min(1, "Document number is required")
    .regex(/^[a-zA-Z0-9-]+$/, "Document number must be alphanumeric"),

  issueDate: z.preprocess(
    (val) => {
      if (!val) return undefined;
      if (val instanceof Date) return val;
      if (typeof val === "string") return new Date(val);
      if (typeof val === "number") return new Date(val);
      return val;
    },
    z.date().refine((date) => !isNaN(date.getTime()), {
      message: "Invalid date",
    }),
  ),

  issueAuthority: z.string().min(2, "Issue authority is required"),

  remarks: z.string().optional(),

  documentFile: z
    .instanceof(File, { message: "Document upload is required" })
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      "File size must be less than 5MB",
    )
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only JPEG, JPG, and PNG files are accepted",
    ),
});

export type TDocumentFormValues = z.infer<typeof documentFormSchema>;
