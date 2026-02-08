import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const achievementEntrySchema = z
  .object({
    achievementType: z.string().min(1, "Achievement Type is required"),
    title: z.string().min(10, "Title is required"),
    organization: z.string().min(10, "Organization name is required"),
    website: z.string().optional(),
    location: z.string().min(10, "Location is required"),
    year: z.string().min(4, "Year is required"),
    description: z.string().min(10, "Description is required"),
    certificate: z.any(),
  })
  .superRefine((data, ctx) => {
    // console.log("Log From Schema", data);

    // Certificate is required and must be a File
    if (!data.certificate || !(data.certificate instanceof File)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Certificate is required",
        path: ["certificate"],
      });
    } else {
      // Validate file size
      if (data.certificate.size > MAX_FILE_SIZE) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Max file size is 5MB",
          path: ["certificate"],
        });
      }
      // Validate file type
      if (!ACCEPTED_IMAGE_TYPES.includes(data.certificate.type)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Only .jpeg, .jpg, and .png files are accepted",
          path: ["certificate"],
        });
      }
    }
  });

export const achievementInfoFormSchema = z.object({
  achievements: z
    .array(achievementEntrySchema)
    .min(1, "At least one  entry is required"),
});

export type AchievementInfoFormValues = z.infer<
  typeof achievementInfoFormSchema
>;

export const defaultAchievement = {
  achievementType: "",
  title: "",
  organization: "",
  website: "",
  location: "",
  year: "",
  description: "",
  certificate: null,
};
