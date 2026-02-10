import { Mars, Venus } from "lucide-react";
import ProfileContentCard from "../../_components/profile-content-card";

interface PersonalInfoCardProps {
  fatherName: string | undefined;
  motherName: string | undefined;
  spouseName?: string | undefined;
}

const PersonalInfoCard = ({
  fatherName,
  motherName,
  spouseName,
}: PersonalInfoCardProps) => {
  return (
    <section className="mt-10">
      <ProfileContentCard title="Personal Information">
        <ul className="space-y-4">
          <li className="flex gap-2">
            <div className="text-dark-blue-700 rounded-[5px] bg-blue-100/50 p-3">
              <Venus size={26} />
            </div>
            <div>
              <p className="text-dark-blue-700 mb-0 font-semibold">
                Father Name
              </p>
              <p className="font-bold">{fatherName}</p>
            </div>
          </li>
          <li className="flex gap-2">
            <div className="text-dark-blue-700 rounded-[5px] bg-blue-100/50 p-3">
              <Mars size={26} />
            </div>
            <div>
              <p className="text-dark-blue-700 mb-0 font-semibold">
                Mother Name
              </p>
              <p className="font-bold">{motherName}</p>
            </div>
          </li>
          {spouseName && (
            <li className="flex gap-2">
              <div className="text-dark-blue-700 rounded-[5px] bg-blue-100/50 p-3">
                <Mars size={26} />
              </div>
              <div>
                <p className="text-dark-blue-700 mb-0 font-semibold">
                  Spouse Name
                </p>
                <p className="font-bold">{spouseName}</p>
              </div>
            </li>
          )}
        </ul>
      </ProfileContentCard>
    </section>
  );
};

export default PersonalInfoCard;
