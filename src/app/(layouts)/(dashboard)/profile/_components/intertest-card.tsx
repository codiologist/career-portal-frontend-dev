"use client";

import { Badge } from "@/components/ui/badge";
import { TInterest } from "@/types/profile-types";
import ProfileContentCard from "../../_components/profile-content-card";

interface InterestsCardProps {
  interests: TInterest[] | undefined;
}

export const InterestsCard = ({ interests = [] }: InterestsCardProps) => {
  return (
    <section className="mt-10">
      <ProfileContentCard title="Interest">
        {interests.length === 0 ? (
          <p className="text-sm font-medium text-gray-400">
            No interests data found
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {interests.map((interst) => (
              <Badge
                key={interst.id}
                className="bg-light-blue-900 text-dark-blue-700 px-4 text-base font-medium"
              >
                {interst.interstName}
              </Badge>
            ))}
          </div>
        )}
      </ProfileContentCard>
    </section>
  );
};
