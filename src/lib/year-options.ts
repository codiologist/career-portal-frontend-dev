import { SelectOption } from "@/app/(layouts)/(dashboard)/update-profile/_components/form-inputs";

const currentYear = new Date().getFullYear();
export const yearOptions: SelectOption[] = Array.from(
  { length: currentYear - 1970 + 1 },
  (_, i) => {
    const year = (currentYear - i).toString();
    return { label: year, value: year };
  },
);
