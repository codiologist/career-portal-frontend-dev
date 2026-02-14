"use client";

import { Badge } from "@/components/ui/badge";
import { TSkill } from "@/types/profile-types";
import ProfileContentCard from "../../_components/profile-content-card";

interface SkillsInfoCardProps {
  skills: TSkill[] | undefined;
}

const SkillsInfoCard = ({ skills = [] }: SkillsInfoCardProps) => {
  return (
    <section className="mt-10">
      <ProfileContentCard title="Skills">
        {skills.length === 0 ? (
          <p className="text-sm font-medium text-gray-400">
            No interests found
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge
                key={skill.id}
                className="bg-light-blue-900 text-dark-blue-700 px-4 text-base font-medium"
              >
                {skill.skillName}
              </Badge>
            ))}
          </div>
        )}
      </ProfileContentCard>
    </section>
  );
};

export default SkillsInfoCard;
