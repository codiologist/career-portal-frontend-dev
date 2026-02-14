import { Mail, Phone, PhoneCallIcon } from "lucide-react";
import ProfileContentCard from "../../_components/profile-content-card";

interface ContactInfoCardProps {
  regPhone?: string;
  phone?: string;
  alternatePhone?: string;
  email?: string;
  presentAddress?: string;
  permanentAddress?: string;
}

const ContactInfoCard = ({
  regPhone,
  phone,
  alternatePhone,
  email,
  // presentAddress,
  // permanentAddress,
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

          {/* <li className="flex gap-2">
            <div className="text-dark-blue-700 rounded-[5px] bg-blue-100/50 p-3">
              <BsSignpost2 size={26} />
            </div>
            <div>
              <p className="text-dark-blue-700 mb-0 font-semibold">
                Present Address
              </p>
              <p className="font-bold">
                123 Main St, Apt 4B, New York, NY 10001
              </p>
            </div>
          </li>

          <li className="flex gap-2">
            <div className="text-dark-blue-700 rounded-[5px] bg-blue-100/50 p-3">
              <BsSignpost2 size={26} />
            </div>
            <div>
              <p className="text-dark-blue-700 mb-0 font-semibold">
                Permanent Address
              </p>
              <p className="font-bold">
                123 Main St, Apt 4B, New York, NY 10001
              </p>
            </div>
          </li> */}
        </ul>
      </ProfileContentCard>
    </section>
  );
};

export default ContactInfoCard;
