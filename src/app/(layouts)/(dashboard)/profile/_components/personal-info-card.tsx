import { Mars, Venus } from "lucide-react";
import ProfileContentCard from "./profile-content-card";

const PersonalInfoCard = () => {
  return (
    <section className="mt-10">
      <ProfileContentCard title="Personal Information">
        <ul className="space-y-4">
          <li className="flex gap-2">
            <div className="text-primary rounded-[5px] bg-blue-100/50 p-3">
              <Venus size={26} />
            </div>
            <div>
              <p className="text-primary mb-0 font-semibold">Father Name</p>
              <p className="font-bold">Delwar Ahmed</p>
            </div>
          </li>
          <li className="flex gap-2">
            <div className="text-primary rounded-[5px] bg-blue-100/50 p-3">
              <Mars size={26} />
            </div>
            <div>
              <p className="text-primary mb-0 font-semibold">Mother Name</p>
              <p className="font-bold">Firoja Begum</p>
            </div>
          </li>

          <li className="flex gap-2">
            <div className="text-primary rounded-[5px] bg-blue-100/50 p-3">
              <Mars size={26} />
            </div>
            <div>
              <p className="text-primary mb-0 font-semibold">Spouse Name</p>
              <p className="font-bold">Mahmuda Sumi</p>
            </div>
          </li>
        </ul>
      </ProfileContentCard>
    </section>
  );
};

export default PersonalInfoCard;
