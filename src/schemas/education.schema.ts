import { z } from "zod";

const MAX_FILE_SIZE = 500 * 1024; // 500KB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const HIDE_MARKS: string[] = ["Appeared", "Pass"];
const LEVEL_SSC_HSC: string[] = ["Secondary", "Higher Secondary"];
const LEVEL_PHD: string[] = ["PhD"];

const educationEntrySchema = z
  .object({
    levelOfEducationId: z.string().min(1, "Level of education is required"),
    levelName: z.string().optional(), // ← hidden field synced by the card
    degreeNameId: z.string().min(1, "Degree name is required"),
    educationBoardId: z.string().optional(),
    majorGroupId: z.string().optional(),
    subjectName: z.string().optional(),
    instituteName: z.string().min(1, "Institute name is required"),
    resultTypeId: z.string().min(1, "Result type is required"),
    totalMarksCGPA: z.string().optional(),
    yearOfPassing: z.string().min(1, "Year of passing is required"),
    certificate: z.any(),
    // ← tracks the server-side URL when no new file is uploaded
    existingCertificateUrl: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const hideMarks = HIDE_MARKS.includes(data.resultTypeId);

    // ✅ Now correctly comparing the resolved name, not the raw ID
    const isSSCorHSC = LEVEL_SSC_HSC.includes(data.levelName ?? "");

    if (isSSCorHSC) {
      if (!data.educationBoardId || data.educationBoardId.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Education board is required",
          path: ["educationBoardId"],
        });
      }
    }

    if (!isSSCorHSC) {
      if (!data.subjectName || data.subjectName.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Subject name is required",
          path: ["subjectName"],
        });
      }
    }

    if (!hideMarks) {
      if (!data.totalMarksCGPA || data.totalMarksCGPA.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            data.resultTypeId === "Grade"
              ? "CGPA is required"
              : "Total marks is required",
          path: ["totalMarksCGPA"],
        });
      }
    }

    const hasNewFile = data.certificate instanceof File;
    // ✅ FIX: treat a non-empty existingCertificateUrl as a valid certificate
    const hasExistingUrl =
      typeof data.existingCertificateUrl === "string" &&
      data.existingCertificateUrl.trim() !== "";

    if (!hasNewFile && !hasExistingUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Certificate is required",
        path: ["certificate"],
      });
    }

    // Only validate file constraints when a new file is being uploaded
    if (hasNewFile) {
      if (data.certificate.size > MAX_FILE_SIZE) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Max file size is 500KB",
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
    }
  });

export const educationInfoFormSchema = z.object({
  educations: z
    .array(educationEntrySchema)
    .min(1, "At least one education entry is required"),
});

export type EducationInfoFormValues = z.infer<typeof educationInfoFormSchema>;

export const defaultEducation: EducationInfoFormValues["educations"][number] = {
  levelOfEducationId: "",
  levelName: "", // ← include in default
  degreeNameId: "",
  educationBoardId: "",
  majorGroupId: "",
  subjectName: "",
  instituteName: "",
  resultTypeId: "",
  totalMarksCGPA: "",
  yearOfPassing: "",
  certificate: null,
  existingCertificateUrl: "",
};
