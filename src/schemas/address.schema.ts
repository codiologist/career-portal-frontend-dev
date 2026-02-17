import { z } from "zod";

// ─── Present address ──────────────────────────────────────────────────────────
export const presentAddressSchema = z
  .object({
    divisionId: z.string().min(1, "Division is required"),
    districtId: z.string().min(1, "District is required"),
    upazilaCityCorpId: z.string().optional(), // visible combo Select
    upazilaId: z.string().optional(), // hidden split field
    cityCorporationId: z.string().optional(), // hidden split field
    unionMunicipalityId: z.string().optional(), // visible combo Select
    unionParishadId: z.string().optional(), // hidden split field
    municipalityId: z.string().optional(), // hidden split field
    policeStationId: z.string().min(1, "Police Station is required"),
    postOfficeId: z.string().min(1, "Post Office is required"),
    wardNo: z.string().optional(),
    addressLine: z.string().min(1, "Address is required"),
  })
  .superRefine((data, ctx) => {
    if (!data.upazilaId && !data.cityCorporationId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Either Upazila or City Corporation is required",
        path: ["upazilaId"],
      });
    }
    if (data.upazilaId && !data.unionParishadId && !data.municipalityId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Either Union or Municipality is required",
        path: ["unionParishadId"],
      });
    }
  });

// ─── Permanent address (all optional, validated conditionally below) ──────────
export const permanentAddressSchema = z.object({
  divisionId: z.string().optional(),
  districtId: z.string().optional(),
  upazilaCityCorpId: z.string().optional(),
  upazilaId: z.string().optional(),
  cityCorporationId: z.string().optional(),
  unionMunicipalityId: z.string().optional(),
  unionParishadId: z.string().optional(),
  municipalityId: z.string().optional(),
  policeStationId: z.string().optional(),
  postOfficeId: z.string().optional(),
  wardNo: z.string().optional(),
  addressLine: z.string().optional(),
});

// ─── Full form schema ─────────────────────────────────────────────────────────
export const addressFormSchema = z
  .object({
    present: presentAddressSchema,
    isSameAsPresent: z.boolean().default(false),
    permanent: permanentAddressSchema,
  })
  .superRefine((data, ctx) => {
    if (data.isSameAsPresent) return;

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
    if (!data.permanent.upazilaId && !data.permanent.cityCorporationId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Either Upazila or City Corporation is required",
        path: ["permanent", "upazilaId"],
      });
    }
    if (
      data.permanent.upazilaId &&
      !data.permanent.unionParishadId &&
      !data.permanent.municipalityId
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Either Union or Municipality is required",
        path: ["permanent", "unionParishadId"],
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
  });

export type AddressFormValues = z.infer<typeof addressFormSchema>;

// ─── Transform form → API payload ────────────────────────────────────────────
export function transformToSubmitFormat(
  data: AddressFormValues,
  presentAddressTypeId: string,
  permanentAddressTypeId: string,
) {
  const parseId = (value?: string | number | null) =>
    value ? Number(value) : undefined;

  const presentAddress = {
    divisionId: parseId(data.present.divisionId),
    districtId: parseId(data.present.districtId),
    cityCorporationId: parseId(data.present.cityCorporationId),
    upazilaId: parseId(data.present.upazilaId),
    unionParishadId: parseId(data.present.unionParishadId),
    municipalityId: parseId(data.present.municipalityId),
    policeStationId: parseId(data.present.policeStationId),
    postOfficeId: parseId(data.present.postOfficeId),
    wardNo: data.present.wardNo || "",
    addressLine: data.present.addressLine,
    isSameAsPresent: false,
    addressTypeId: presentAddressTypeId,
  };

  // If same as present, mirror all present values into permanent
  const src = data.isSameAsPresent ? data.present : data.permanent;

  const permanentAddress = {
    divisionId: parseId(src.divisionId),
    districtId: parseId(src.districtId),
    cityCorporationId: parseId(src.cityCorporationId),
    upazilaId: parseId(src.upazilaId),
    unionParishadId: parseId(src.unionParishadId),
    municipalityId: parseId(src.municipalityId),
    policeStationId: parseId(src.policeStationId),
    postOfficeId: parseId(src.postOfficeId),
    wardNo: src.wardNo || "",
    addressLine: src.addressLine || "",
    isSameAsPresent: data.isSameAsPresent,
    addressTypeId: permanentAddressTypeId,
  };

  return [presentAddress, permanentAddress];
}

// ─── Default values ───────────────────────────────────────────────────────────
const emptyAddress = {
  divisionId: "",
  districtId: "",
  upazilaCityCorpId: "",
  upazilaId: "",
  cityCorporationId: "",
  unionMunicipalityId: "",
  unionParishadId: "",
  municipalityId: "",
  policeStationId: "",
  postOfficeId: "",
  wardNo: "",
  addressLine: "",
};

export const defaultAddressFormValues: AddressFormValues = {
  present: { ...emptyAddress },
  isSameAsPresent: false,
  permanent: { ...emptyAddress },
};
