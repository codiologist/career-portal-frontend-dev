import { z } from "zod";

export const personalInformationSchema = z.object({
  careerTitle: z
    .string()
    .min(10, "Position title must be at least 10 characters"),
  careerObjective: z
    .string()
    .min(150, "Career objective must be at least 150 characters"),
  fullName: z.string().min(5, "First name must be at least 5 characters"),
  fatherName: z.string().min(5, "Father name must be at least 5 characters"),
  motherName: z.string().min(5, "Mother name must be at least 5 characters"),
  dob: z.preprocess(
    (val) => (typeof val === "string" ? new Date(val) : val),
    z.date().refine(
      (date) => {
        if (!(date instanceof Date) || isNaN(date.getTime())) return false;
        const today = new Date();
        let age = today.getFullYear() - date.getFullYear();
        const monthDiff = today.getMonth() - date.getMonth();
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < date.getDate())
        ) {
          age--;
        }
        return age >= 18;
      },
      { message: "You must be at least 18 years old." },
    ),
  ),
});

export type PersonalInfoValues = z.infer<typeof personalInformationSchema>;
