import { z } from "zod";

const experienceItemSchema = z
  .object({
    designation: z.string().min(1, "Designation is required"),
    companyName: z.string().min(1, "Company name is required"),
    companyBusinessType: z.string().min(1, "Company business type is required"),
    location: z.string().min(1, "Location is required"),
    department: z.string().min(1, "Department is required"),
    startDate: z.date({ error: "Start date is required" }),
    endDate: z.date({ error: "End date is required" }).optional(),
    isContinue: z.boolean(),
    responsibilities: z
      .string()
      .min(150, "Responsiblities must be at least 150 characters"),
  })
  .superRefine((data, ctx) => {
    if (!data.isContinue && !data.endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date is required",
        path: ["endDate"],
      });
    }
    if (
      !data.isContinue &&
      data.endDate &&
      data.startDate &&
      data.endDate < data.startDate
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date must be after start date",
        path: ["endDate"],
      });
    }
  });

export const experienceInfoFormSchema = z.object({
  experiences: z
    .array(experienceItemSchema)
    .min(1, "At least one experience is required"),
});

export type ExperienceInfoFormValues = z.infer<typeof experienceInfoFormSchema>;

export const defaultExperienceItem = {
  designation: "",
  companyName: "",
  companyBusinessType: "",
  location: "",
  department: "",
  startDate: undefined as unknown as Date,
  endDate: undefined as unknown as Date,
  isContinue: false,
  responsibilities: "",
};
