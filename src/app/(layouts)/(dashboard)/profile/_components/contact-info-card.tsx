import { Mail, Phone, PhoneCallIcon } from "lucide-react";
import { BsSignpost2 } from "react-icons/bs";
import ProfileContentCard from "./profile-content-card";

const ContactInfoCard = () => {
  return (
    <section className="mt-14">
      <ProfileContentCard title="Contact Information">
        <ul className="space-y-4">
          <li className="flex gap-2">
            <div className="text-primary rounded-[5px] bg-blue-100/50 p-3">
              <PhoneCallIcon size={26} />
            </div>
            <div>
              <p className="text-primary mb-0 font-semibold">Phone</p>
              <p className="font-bold">01876594444</p>
            </div>
          </li>

          <li className="flex gap-2">
            <div className="text-primary rounded-[5px] bg-blue-100/50 p-3">
              <Phone size={26} />
            </div>
            <div>
              <p className="text-primary mb-0 font-semibold">Alternate Phone</p>
              <p className="font-bold">017211558877</p>
            </div>
          </li>

          <li className="flex gap-2">
            <div className="text-primary rounded-[5px] bg-blue-100/50 p-3">
              <Mail size={26} />
            </div>
            <div>
              <p className="text-primary mb-0 font-semibold">Email</p>
              <p className="font-bold">robin@analyzenbd.com</p>
            </div>
          </li>
          <li className="flex gap-2">
            <div className="text-primary rounded-[5px] bg-blue-100/50 p-3">
              <BsSignpost2 size={26} />
            </div>
            <div>
              <p className="text-primary mb-0 font-semibold">Present Address</p>
              <p className="font-bold">
                123 Main St, Apt 4B, New York, NY 10001
              </p>
            </div>
          </li>

          <li className="flex gap-2">
            <div className="text-primary rounded-[5px] bg-blue-100/50 p-3">
              <BsSignpost2 size={26} />
            </div>
            <div>
              <p className="text-primary mb-0 font-semibold">
                Permanent Address
              </p>
              <p className="font-bold">
                123 Main St, Apt 4B, New York, NY 10001
              </p>
            </div>
          </li>
        </ul>
      </ProfileContentCard>
    </section>
  );
};

export default ContactInfoCard;
