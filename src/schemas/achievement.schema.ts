import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const achievementEntrySchema = z
  .object({
    achievementType: z.string().min(1, "Achievement Type is required"),
    title: z.string().min(5, "Title is required"),
    organizationName: z.string().min(2, "Organization name is required"),
    url: z.string().optional(),
    location: z.string().min(2, "Location is required"),
    year: z.string().min(4, "Year is required"),
    description: z.string().min(10, "Description is required"),
    certificate: z.any(),
    // Populated when editing an existing achievement that already has a saved document
    existingCertificateUrl: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // If there is already a saved certificate URL (editing mode) and no new file
    // has been chosen, skip file validation — the existing document is kept.
    const hasExisting = !!data.existingCertificateUrl;

    if (data.certificate instanceof File) {
      // Validate the newly selected file
      if (data.certificate.size > MAX_FILE_SIZE) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Max file size is 5MB",
          path: ["certificate"],
        });
      }
      if (!ACCEPTED_IMAGE_TYPES.includes(data.certificate.type)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Only .jpeg, .jpg, and .png files are accepted",
          path: ["certificate"],
        });
      }
    } else if (!hasExisting) {
      // No file and no existing URL — certificate is required
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Certificate is required",
        path: ["certificate"],
      });
    }
  });

export const achievementInfoFormSchema = z.object({
  achievements: z
    .array(achievementEntrySchema)
    .min(1, "At least one entry is required"),
});

export type AchievementInfoFormValues = z.infer<
  typeof achievementInfoFormSchema
>;

export const defaultAchievement = {
  achievementType: "",
  title: "",
  organizationName: "",
  url: "",
  location: "",
  year: "",
  description: "",
  certificate: undefined as File | undefined,
  existingCertificateUrl: undefined as string | undefined,
};
