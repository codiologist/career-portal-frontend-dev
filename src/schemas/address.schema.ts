import { z } from "zod";

export const residentialInfoSchema = z
  .object({
    // Present Address
    addressLine: z.string().min(2, {
      message: "Address must be at least 2 characters.",
    }),
    presentDivision: z.string().min(1, {
      message: "Please select a division.",
    }),
    presentDistrict: z.string().min(1, {
      message: "Please select a district.",
    }),
    presentThana: z.string().min(1, {
      message: "Please select a thana.",
    }),
    presentPostalCode: z.string().optional(),
    presentLengthOfStay: z.string().min(1, {
      message: "Length of stay is required.",
    }),
    presentOwnershipStatus: z.string().min(1, {
      message: "Please select an ownership status.",
    }),

    // Permanent Address
    isPermanentSameAsPresent: z.boolean().default(false),
    permanentAddress: z.string().optional(),
    permanentDivision: z.string().optional(),
    permanentDistrict: z.string().optional(),
    permanentThana: z.string().optional(),
    permanentPostalCode: z.string().optional(),
    permanentLengthOfStay: z.string().optional(),
    permanentOwnershipStatus: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.isPermanentSameAsPresent) {
      if (!data.permanentAddress || data.permanentAddress.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Permanent address is required.",
          path: ["permanentAddress"],
        });
      }
      if (!data.permanentDivision || data.permanentDivision.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Permanent division is required.",
          path: ["permanentDivision"],
        });
      }
      if (!data.permanentDistrict || data.permanentDistrict.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Permanent district is required.",
          path: ["permanentDistrict"],
        });
      }
      if (!data.permanentThana || data.permanentThana.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Permanent thana is required.",
          path: ["permanentThana"],
        });
      }
      // if (!data.permanentPostalCode || data.permanentPostalCode.trim() === "") {
      //   ctx.addIssue({
      //     code: z.ZodIssueCode.custom,
      //     message: "Permanent postal code is required.",
      //     path: ["permanentPostalCode"],
      //   });
      // }
      if (
        !data.permanentLengthOfStay ||
        data.permanentLengthOfStay.trim() === ""
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Permanent length of stay is required.",
          path: ["permanentLengthOfStay"],
        });
      }
      if (
        !data.permanentOwnershipStatus ||
        data.permanentOwnershipStatus.trim() === ""
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Permanent ownership status is required.",
          path: ["permanentOwnershipStatus"],
        });
      }
    }
  });

export type ResidentialInfoValues = z.infer<typeof residentialInfoSchema>;
