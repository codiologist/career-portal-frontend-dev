import { TUserAddress } from "@/types/address-types";
import { Mail, Phone, PhoneCallIcon } from "lucide-react";
import { BsSignpost2 } from "react-icons/bs";
import ProfileContentCard from "../../_components/profile-content-card";

interface ContactInfoCardProps {
  regPhone?: string;
  phone?: string;
  alternatePhone?: string;
  email?: string;
  presentAddress?: string;
  permanentAddress?: string;
  addresses: TUserAddress[] | undefined;
}

const ContactInfoCard = ({
  regPhone,
  phone,
  alternatePhone,
  email,
  addresses,
}: ContactInfoCardProps) => {
  return (
    <section className="mt-14">
      <ProfileContentCard title="Contact Information">
        <ul className="space-y-4">
          <li className="flex gap-2">
            <div className="text-dark-blue-700 rounded-[5px] bg-blue-100/50 p-3">
              <PhoneCallIcon size={26} />
            </div>
            <div>
              <p className="text-dark-blue-700 mb-0 font-semibold">Phone</p>
              {!phone ? (
                <p className="font-bold">{regPhone}</p>
              ) : (
                <p className="font-bold">{phone}</p>
              )}
            </div>
          </li>

          <li className="flex gap-2">
            <div className="text-dark-blue-700 rounded-[5px] bg-blue-100/50 p-3">
              <Phone size={26} />
            </div>
            <div>
              <p className="text-dark-blue-700 mb-0 font-semibold">
                Alternate Phone
              </p>
              {!alternatePhone ? (
                <p className="text-sm font-medium text-gray-400">
                  No record found
                </p>
              ) : (
                <p className="font-bold">{alternatePhone}</p>
              )}
            </div>
          </li>

          <li className="flex gap-2">
            <div className="text-dark-blue-700 rounded-[5px] bg-blue-100/50 p-3">
              <Mail size={26} />
            </div>
            <div>
              <p className="text-dark-blue-700 mb-0 font-semibold">Email</p>

              {!email ? (
                <p className="text-sm font-medium text-gray-400">
                  No record found
                </p>
              ) : (
                <p className="font-bold">{email}</p>
              )}
            </div>
          </li>

          <li className="flex gap-2">
            <div className="text-dark-blue-700 rounded-[5px] bg-blue-100/50 p-3">
              <BsSignpost2 size={26} />
            </div>
            <div>
              {addresses && addresses.length > 0 ? (
                <>
                  <p className="text-dark-blue-700 mb-0 font-semibold">
                    Present Address
                  </p>
                  <p className="inline-flex flex-wrap gap-x-1 text-sm font-bold">
                    <span>{addresses[0].addressLine},</span>
                    <span>Ward No: {addresses[0].wardNo},</span>
                    {addresses[0].upazila !== null && (
                      <span>{addresses[0].upazila?.name},</span>
                    )}
                    {addresses[0].cityCorporation !== null && (
                      <span>{addresses[0].cityCorporation?.name},</span>
                    )}
                    {addresses[0].unionParishad !== null && (
                      <span>{addresses[0].unionParishad?.name},</span>
                    )}
                    {addresses[0].municipality !== null && (
                      <span>{addresses[0].municipality?.name},</span>
                    )}
                    <span>{addresses[0].policeStation?.name ?? "N/A"},</span>
                    <span>
                      {addresses[0].district?.name ?? "N/A"} -{" "}
                      {addresses[0].postOffice?.postCode},
                    </span>{" "}
                    <span>{addresses[0].division?.name ?? "N/A"}.</span>
                    {/* <span>
                      {addresses[0].upazila !== null
                        ? addresses[0].upazila?.name
                        : ""}
                    </span>{" "}
                    <span>
                      {addresses[0].unionParishad !== null
                        ? addresses[0].unionParishad?.name
                        : ""}
                    </span>{" "}
                    <span>
                      {addresses[0].municipality !== null
                        ? addresses[0].municipality?.name
                        : ""}
                    </span>{" "}
                    <span>
                      {addresses[0].cityCorporation !== null
                        ? addresses[0].cityCorporation?.name
                        : ""}
                      ,
                    </span>{" "}
                    <span>
                      {addresses[0].district?.name ?? "N/A"} -{" "}
                      {addresses[0].postOffice?.postCode},
                    </span>{" "}
                    <span>{addresses[0].division?.name ?? "N/A"}.</span> */}
                  </p>
                </>
              ) : (
                <p className="text-sm font-medium text-gray-400">
                  No record found
                </p>
              )}
            </div>
          </li>

          {addresses &&
          addresses.length > 0 &&
          addresses[1].isSameAsPresent !== true ? (
            <li className="flex gap-2">
              <div className="text-dark-blue-700 rounded-[5px] bg-blue-100/50 p-3">
                <BsSignpost2 size={26} />
              </div>
              <div>
                {addresses && addresses.length > 0 ? (
                  <>
                    <p className="text-dark-blue-700 mb-0 font-semibold">
                      Permanent Address
                    </p>
                    <p className="text-sm font-bold">
                      <span>{addresses[1].addressLine},</span>{" "}
                      <span>Ward No: {addresses[1].wardNo},</span>{" "}
                      <span>
                        Post Office: {addresses[1].postOffice?.postOffice},
                      </span>{" "}
                      <span>
                        Upazial:{" "}
                        {addresses[1].upazila !== null
                          ? addresses[1].upazila?.name
                          : ""}
                        ,
                      </span>{" "}
                      <span>
                        Union:{" "}
                        {addresses[1].unionParishad !== null
                          ? addresses[1].unionParishad?.name
                          : ""}
                      </span>{" "}
                      <span>
                        Municipality{" "}
                        {addresses[1].municipality !== null
                          ? addresses[1].municipality?.name
                          : ""}
                      </span>{" "}
                      <span>
                        {addresses[1].cityCorporation !== null
                          ? addresses[1].cityCorporation?.name
                          : ""}
                        ,
                      </span>{" "}
                      <span>
                        {addresses[1].district?.name ?? "N/A"} -{" "}
                        {addresses[1].postOffice?.postCode},
                      </span>{" "}
                      <span>{addresses[1].division?.name ?? "N/A"}.</span>
                    </p>
                  </>
                ) : (
                  <p className="text-sm font-medium text-gray-400">
                    No record found
                  </p>
                )}
              </div>
            </li>
          ) : (
            ""
            // <li className="flex gap-2">
            //   <div className="text-dark-blue-700 rounded-[5px] bg-blue-100/50 p-3">
            //     <BsSignpost2 size={26} />
            //   </div>
            //   <div></div>
            //   <p className="text-dark-blue-700 font-bold">
            //     Permanent Address is same as Present Address.
            //   </p>
            // </li>
          )}
        </ul>
      </ProfileContentCard>
    </section>
  );
};

export default ContactInfoCard;
