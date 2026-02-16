import { AddressFormValues, Upazila } from "@/types/address-types";
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

type Props = {
  form: UseFormReturn<AddressFormValues>;
  upazilas: Upazila[];
};

export const useAddressLogic = ({ form, upazilas }: Props) => {
  const divisionId = form.watch("divisionId");
  const districtId = form.watch("districtId");
  const upazilaCityCorpId = form.watch("upazilaCityCorpId");
  const isCityCorporation = form.watch("isCityCorporation");

  /**
   * 👉 Division change = reset everything below
   */
  useEffect(() => {
    form.setValue("districtId", "");
    form.setValue("upazilaCityCorpId", "");
    form.setValue("upazilaId", "");
    form.setValue("unionId", "");
    form.setValue("municipalityId", "");
    form.setValue("isCityCorporation", false);
  }, [divisionId]);

  /**
   * 👉 District change = reset below
   */
  useEffect(() => {
    form.setValue("upazilaCityCorpId", "");
    form.setValue("upazilaId", "");
    form.setValue("unionId", "");
    form.setValue("municipalityId", "");
    form.setValue("isCityCorporation", false);
  }, [districtId]);

  /**
   * 👉 Auto detect Upazila vs City Corp
   */
  useEffect(() => {
    if (!upazilaCityCorpId) return;

    const selected = upazilas.find(
      (u) => String(u.id) === String(upazilaCityCorpId),
    );

    if (!selected) return;

    if (selected.type === "UPAZILA") {
      form.setValue("upazilaId", String(selected.id));
      form.setValue("isCityCorporation", false);
    }

    if (selected.type === "CITY_CORPORATION") {
      form.setValue("upazilaId", "");
      form.setValue("isCityCorporation", true);
    }

    form.setValue("unionId", "");
    form.setValue("municipalityId", "");
  }, [upazilaCityCorpId]);

  /**
   * 👉 Toggle City Corp manually
   */
  useEffect(() => {
    if (isCityCorporation) {
      form.setValue("unionId", "");
      form.setValue("municipalityId", "");
    }
  }, [isCityCorporation]);
};
