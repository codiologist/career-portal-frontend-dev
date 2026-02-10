"use client";
import { cn } from "@/lib/utils";
import ProfileContentCard from "../../_components/profile-content-card";

interface CareerObjectiveCardProps {
  content: string | undefined;
}

const CareerObjectivCard = ({ content }: CareerObjectiveCardProps) => {
  return (
    <section className="mt-14">
      <ProfileContentCard title="Career Objective">
        <p
          className={cn(
            "prose max-w-none text-left text-[17px] lg:text-justify",
          )}
          dangerouslySetInnerHTML={{ __html: content ?? "" }}
        ></p>
      </ProfileContentCard>
    </section>
  );
};

export default CareerObjectivCard;
