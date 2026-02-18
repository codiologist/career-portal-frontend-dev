import { z } from "zod";

const MAX_FILE_SIZE = 500 * 1024; // 500KB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const HIDE_MARKS: string[] = ["Appeared", "Pass"];

const educationEntrySchema = z
  .object({
    levelOfEducation: z.string().min(1, "Level of education is required"),
    degreeName: z.string().min(1, "Degree name is required"),
    board: z.string().optional(),
    majorGroup: z.string().min(1, "Major/Group is required"),
    instituteName: z.string().min(1, "Institute name is required"),
    resultType: z.string().min(1, "Result type is required"),
    totalMarksCGPA: z.string().optional(),
    yearOfPassing: z.string().min(1, "Year of passing is required"),
    certificate: z.any(),
  })
  .superRefine((data, ctx) => {
    // console.log("Log From Schema", data);
    // Board is required when degree is SSC or HSC
    if (data.degreeName === "SSC" || data.degreeName === "HSC") {
      if (!data.board || data.board.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Board is required for SSC/HSC",
          path: ["board"],
        });
      }
    }
    const hideMarks = HIDE_MARKS.includes(data.resultType);
    if (!hideMarks) {
      if (!data.totalMarksCGPA || data.totalMarksCGPA.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            data.resultType === "Grade"
              ? "CGPA is required"
              : "Total marks is required",
          path: ["totalMarksCGPA"],
        });
      }
    }
    if (data.resultType === "Appeared" || data.resultType === "Pass") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Total marks is not allowed for Appeared/Pass",
        path: ["totalMarksCGPA"],
      });
    }

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
          message: "Max file size is 500KB",
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

export const educationInfoFormSchema = z.object({
  educations: z
    .array(educationEntrySchema)
    .min(1, "At least one education entry is required"),
});

export type EducationInfoFormValues = z.infer<typeof educationInfoFormSchema>;

export const defaultEducation = {
  levelOfEducation: "",
  degreeName: "",
  board: "",
  majorGroup: "",
  instituteName: "",
  resultType: "",
  totalMarksCGPA: "",
  yearOfPassing: "",
  certificate: null,
};
