import {
  BadgeCheck,
  Calendar,
  Heart,
  IdCardIcon,
  VenusAndMars,
} from "lucide-react";
import Image from "next/image";
import { MdOutlineBloodtype } from "react-icons/md";
import ProfileContentCard from "../../_components/profile-content-card";

const OtherInfoCard = () => {
  return (
    <section className="mt-10">
      <ProfileContentCard title="Other Details">
        <ul className="space-y-4">
          <li className="flex gap-2">
            <div className="text-blue-water-700 rounded-[5px] bg-blue-100/50 p-3">
              <BadgeCheck size={26} />
            </div>
            <div>
              <p className="text-blue-water-700 mb-0 font-semibold">
                Verification Status
              </p>
              <p className="font-bold">Verified</p>
            </div>
          </li>
          <li className="flex gap-2">
            <div className="text-blue-water-700 rounded-[5px] bg-blue-100/50 p-3">
              <Calendar size={26} />
            </div>
            <div>
              <p className="text-blue-water-700 mb-0 font-semibold">
                Date of Birth
              </p>
              <p className="font-bold">22th October, 1987</p>
            </div>
          </li>

          <li className="flex gap-2">
            <div className="text-blue-water-700 rounded-[5px] bg-blue-100/50 p-3">
              <Heart size={26} />
            </div>
            <div>
              <p className="text-blue-water-700 mb-0 font-semibold">
                Marital Status
              </p>
              <p className="font-bold">Married</p>
            </div>
          </li>

          <li className="flex gap-2">
            <div className="text-blue-water-700 rounded-[5px] bg-blue-100/50 p-3">
              <VenusAndMars size={26} />
            </div>
            <div>
              <p className="text-blue-water-700 mb-0 font-semibold">Gender</p>
              <p className="font-bold">Male</p>
            </div>
          </li>

          <li className="flex gap-2">
            <div className="text-blue-water-700 rounded-[5px] bg-blue-100/50 p-3">
              <IdCardIcon size={26} />
            </div>
            <div>
              <p className="text-blue-water-700 mb-0 font-semibold">
                Nationality
              </p>
              <p className="font-bold">Bangladeshi</p>
            </div>
          </li>

          <li className="flex gap-2">
            <div className="text-blue-water-700 rounded-[5px] bg-blue-100/50 p-3">
              <IdCardIcon size={26} />
            </div>
            <div>
              <p className="text-blue-water-700 mb-0 font-semibold">
                NID Number
              </p>
              <p className="font-bold">1234567890</p>
            </div>
          </li>

          <li className="flex gap-2">
            <div className="text-blue-water-700 rounded-[5px] bg-blue-100/50 p-3">
              <MdOutlineBloodtype size={26} />
            </div>
            <div>
              <p className="text-blue-water-700 mb-0 font-semibold">
                Blood Group
              </p>
              <p className="font-bold">B+ve</p>
            </div>
          </li>

          <li className="flex gap-2">
            <div className="text-blue-water-700 rounded-[5px] bg-blue-100/50 p-3">
              <Image
                src="/pray.svg"
                className="h-6.5 w-6.5"
                width={26}
                height={26}
                alt="icon"
              />
            </div>
            <div>
              <p className="text-blue-water-700 mb-0 font-semibold">Religion</p>
              <p className="font-bold">Islam</p>
            </div>
          </li>
        </ul>
      </ProfileContentCard>
    </section>
  );
};

export default OtherInfoCard;
