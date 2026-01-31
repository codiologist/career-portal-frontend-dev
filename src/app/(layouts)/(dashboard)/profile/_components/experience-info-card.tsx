import {
  BriefcaseBusiness,
  Building2,
  Calendar1Icon,
  MapPin,
  Toolbox,
} from "lucide-react";
import { FaCircle } from "react-icons/fa";
import ProfileContentCard from "./profile-content-card";

const ExperienceInfoCard = () => {
  return (
    <section className="mt-10">
      <ProfileContentCard title="Work & Experience">
        <ul>
          <li className="relative flex items-baseline gap-5 pb-5">
            <div className="before:bg-blue-water-600/40 before:absolute before:top-2 before:left-1.75 before:h-full before:w-0.5">
              <FaCircle className="size-4 text-blue-600" />
            </div>
            {/* <div className="text-blue-water-600 relative top-0.5">
              <FaCircle className="size-4" />
            </div> */}
            <div>
              <div className="flex flex-col items-start xl:flex-row xl:items-center xl:gap-4">
                <h3 className="text-blue-water-700 mb-0.5 text-xl font-bold">
                  Senior Frontend Developer
                </h3>
                <div className="hidden rounded-full bg-blue-100/50 px-4 py-0.5 xl:block">
                  <p className="text-blue-water-700 text-sm font-semibold">
                    01 November, 2013 – Continue
                  </p>
                </div>
              </div>

              <ul className="mt-1.5 space-y-2.5">
                <li className="flex items-start gap-3 xl:items-center">
                  <Toolbox
                    size={16}
                    className="text-blue-water-700/60 size-5"
                  />
                  <p className="font-medium">Analyzen Bangladesh Ltd.</p>
                </li>
                <li className="flex items-start gap-3 xl:items-center">
                  <Building2
                    size={16}
                    className="text-blue-water-700/60 size-5"
                  />
                  <p className="font-medium">
                    Creative Tech &amp; Marketing Agency
                  </p>
                </li>
                <li className="flex items-start gap-3 xl:items-center">
                  <MapPin
                    size={16}
                    className="text-blue-water-700/60 size-9 xl:size-5"
                  />
                  <p className="font-medium">
                    Level 1, House 1A, Road 16/A, Gulshan 1 Dhaka-1212,
                    Bangladesh
                  </p>
                </li>
                <li className="flex items-start gap-3 xl:items-center">
                  <Calendar1Icon
                    size={16}
                    className="text-blue-water-700/60 size-5"
                  />
                  <p className="font-medium">01 November, 2013 – Continue</p>
                </li>
              </ul>

              <p className="text-blue-water-700 mt-2 flex items-center gap-3 text-[17px] font-bold">
                <BriefcaseBusiness
                  size={20}
                  className="text-blue-water-700/60"
                />
                Responsiblities:
              </p>
              <p className="mt-0.5 pl-7 text-base">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Maiores incidunt blanditiis dignissimos, enim earum mollitia.
              </p>
            </div>
          </li>
          <li className="relative flex items-baseline gap-5 pb-5">
            {/* <div className="before:bg-blue-water-600/40 before:absolute before:left-1.75 before:h-full before:w-0.5">
              <FaCircle className="size-4 text-blue-600" />
            </div> */}
            <div className="text-blue-water-600 relative top-0.5">
              <FaCircle className="size-4" />
            </div>
            <div>
              <div className="flex flex-col items-start xl:flex-row xl:items-center xl:gap-4">
                <h3 className="text-blue-water-700 mb-0.5 text-xl font-bold">
                  Frontend Developer
                </h3>
                <div className="hidden rounded-full bg-blue-100/50 px-4 py-0.5 xl:block">
                  <p className="text-blue-water-700 text-sm font-semibold">
                    01 November, 2013 – 01 Januwary, 2018
                  </p>
                </div>
              </div>

              <ul className="mt-1.5 space-y-2.5">
                <li className="flex items-start gap-3 xl:items-center">
                  <Building2
                    size={16}
                    className="text-blue-water-700/60 size-5"
                  />
                  <p className="font-medium">Analyzen Bangladesh Ltd.</p>
                </li>
                <li className="flex items-start gap-3 xl:items-center">
                  <Toolbox
                    size={16}
                    className="text-blue-water-700/60 size-5"
                  />
                  <p className="font-medium">
                    Creative Tech &amp; Marketing Agency
                  </p>
                </li>
                <li className="flex items-start gap-3 xl:items-center">
                  <MapPin
                    size={16}
                    className="text-blue-water-700/60 size-9 xl:size-5"
                  />
                  <p className="font-medium">
                    Level 1, House 1A, Road 16/A, Gulshan 1 Dhaka-1212,
                    Bangladesh
                  </p>
                </li>
                <li className="flex items-start gap-3 xl:items-center">
                  <Calendar1Icon
                    size={16}
                    className="text-blue-water-700/60 size-5"
                  />
                  <p className="font-medium">01 November, 2013 – Continue</p>
                </li>
              </ul>

              <p className="text-blue-water-700 mt-2 flex items-center gap-3 text-[17px] font-bold">
                <BriefcaseBusiness
                  size={20}
                  className="text-blue-water-700/60"
                />
                Responsiblities:
              </p>
              <p className="mt-0.5 pl-8 text-base">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Maiores incidunt blanditiis dignissimos, enim earum mollitia.
              </p>
            </div>
          </li>
        </ul>
      </ProfileContentCard>
    </section>
  );
};

export default ExperienceInfoCard;
