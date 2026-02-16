import { z } from "zod";

// Address type IDs (constants for Present and Permanent)
export const PRESENT_ADDRESS_TYPE_ID = "18731f89-91ca-4469-9c5a-674d307a5616";
export const PERMANENT_ADDRESS_TYPE_ID = "2c2cdb7f-92a3-4c8c-a7bf-2d8ba56a31f2";

// Single address entry schema with conditional validation
export const presentAddressSchema = z
  .object({
    divisionId: z.string().min(1, "Division is required"),
    districtId: z.string().min(1, "District is required"),
    cityCorporationId: z.string().optional(),
    upazilaId: z.string().optional(),
    unionId: z.string().optional(),
    municipalityId: z.string().optional(),
    policeStationId: z.string().min(1, "Police Station is required"),
    postOfficeId: z.string().min(1, "Post Office is required"),
    wardNo: z.string().optional(),
    addressLine: z.string().min(1, "Address is required"),
  })
  .superRefine((data, ctx) => {
    // Rule 1: Either upazilaId OR cityCorporationId must be provided
    if (!data.upazilaId && !data.cityCorporationId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Either Upazila or City Corporation is required",
        path: ["upazilaId"],
      });
    }

    // Rule 2: If upazilaId is selected, unionId OR municipalityId is required
    // If cityCorporationId is selected, no union/municipality validation needed
    if (data.upazilaId && !data.unionId && !data.municipalityId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Either Union or Municipality is required",
        path: ["unionId"],
      });
    }
  });

// Permanent address schema with the same conditional logic
export const permanentAddressSchema = z.object({
  divisionId: z.string().optional(),
  districtId: z.string().optional(),
  cityCorporationId: z.string().optional(),
  upazilaId: z.string().optional(),
  unionId: z.string().optional(),
  municipalityId: z.string().optional(),
  policeStationId: z.string().optional(),
  postOfficeId: z.string().optional(),
  wardNo: z.string().optional(),
  addressLine: z.string().optional(),
});

// Full address form schema with present + permanent + isSameAsPresent flag
export const addressFormSchema = z
  .object({
    present: presentAddressSchema,
    isSameAsPresent: z.boolean().default(false),
    permanent: permanentAddressSchema,
  })
  .superRefine((data, ctx) => {
    // If permanent is NOT same as present, validate permanent fields as required
    if (!data.isSameAsPresent) {
      if (!data.permanent.divisionId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Division is required",
          path: ["permanent", "divisionId"],
        });
      }
      if (!data.permanent.districtId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "District is required",
          path: ["permanent", "districtId"],
        });
      }

      // Rule 1: Either upazilaId OR cityCorporationId must be provided
      if (!data.permanent.upazilaId && !data.permanent.cityCorporationId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Either Upazila or City Corporation is required",
          path: ["permanent", "upazilaId"],
        });
      }

      // Rule 2: If upazilaId is selected, unionId OR municipalityId is required
      // If cityCorporationId is selected, no union/municipality validation needed
      if (
        data.permanent.upazilaId &&
        !data.permanent.unionId &&
        !data.permanent.municipalityId
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Either Union or Municipality is required",
          path: ["permanent", "unionId"],
        });
      }

      if (!data.permanent.policeStationId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Police Station is required",
          path: ["permanent", "policeStationId"],
        });
      }
      if (!data.permanent.postOfficeId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Post Office is required",
          path: ["permanent", "postOfficeId"],
        });
      }
      if (!data.permanent.addressLine) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Address is required",
          path: ["permanent", "addressLine"],
        });
      }
    }
  });

export type AddressFormValues = z.infer<typeof addressFormSchema>;

// Helper to transform form values to the API submission format
export function transformToSubmitFormat(data: AddressFormValues) {
  const presentAddress = {
    divisionId: data.present.divisionId,
    districtId: data.present.districtId,
    cityCorporationId: data.present.cityCorporationId || "",
    upazilaId: data.present.upazilaId || "",
    unionId: data.present.unionId || "",
    municipalityId: data.present.municipalityId || "",
    policeStationId: data.present.policeStationId,
    postOfficeId: data.present.postOfficeId,
    wardNo: data.present.wardNo || "",
    addressLine: data.present.addressLine,
    isSameAsPresent: false,
    addressTypeId: PRESENT_ADDRESS_TYPE_ID,
  };

  const permanentAddress = {
    divisionId: data.isSameAsPresent
      ? data.present.divisionId
      : data.permanent.divisionId || "",
    districtId: data.isSameAsPresent
      ? data.present.districtId
      : data.permanent.districtId || "",
    cityCorporationId: data.isSameAsPresent
      ? data.present.cityCorporationId || ""
      : data.permanent.cityCorporationId || "",
    upazilaId: data.isSameAsPresent
      ? data.present.upazilaId || ""
      : data.permanent.upazilaId || "",
    unionId: data.isSameAsPresent
      ? data.present.unionId || ""
      : data.permanent.unionId || "",
    municipalityId: data.isSameAsPresent
      ? data.present.municipalityId || ""
      : data.permanent.municipalityId || "",
    policeStationId: data.isSameAsPresent
      ? data.present.policeStationId
      : data.permanent.policeStationId || "",
    postOfficeId: data.isSameAsPresent
      ? data.present.postOfficeId
      : data.permanent.postOfficeId || "",
    wardNo: data.isSameAsPresent
      ? data.present.wardNo || ""
      : data.permanent.wardNo || "",
    addressLine: data.isSameAsPresent
      ? data.present.addressLine
      : data.permanent.addressLine || "",
    isSameAsPresent: data.isSameAsPresent,
    addressTypeId: PERMANENT_ADDRESS_TYPE_ID,
  };

  return [presentAddress, permanentAddress];
}

export const defaultAddressFormValues: AddressFormValues = {
  present: {
    divisionId: "",
    districtId: "",
    cityCorporationId: "",
    upazilaId: "",
    unionId: "",
    municipalityId: "",
    policeStationId: "",
    postOfficeId: "",
    wardNo: "",
    addressLine: "",
  },
  isSameAsPresent: false,
  permanent: {
    divisionId: "",
    districtId: "",
    cityCorporationId: "",
    upazilaId: "",
    unionId: "",
    municipalityId: "",
    policeStationId: "",
    postOfficeId: "",
    wardNo: "",
    addressLine: "",
  },
};
