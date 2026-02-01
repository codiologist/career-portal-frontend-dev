import { Badge } from "@/components/ui/badge";
import ProfileContentCard from "../../_components/profile-content-card";

const SkillsInfoCard = () => {
  return (
    <section className="mt-10">
      <ProfileContentCard title="Skills">
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-blue-water-light-900 text-blue-water-700 px-4 text-base font-medium">
            React JS
          </Badge>
          <Badge className="bg-blue-water-light-900 text-blue-water-700 px-4 text-base font-medium">
            NEXT JS
          </Badge>
        </div>
      </ProfileContentCard>
    </section>
  );
};

export default SkillsInfoCard;
