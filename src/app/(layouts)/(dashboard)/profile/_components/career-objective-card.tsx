"use client";
import { cn } from "@/lib/utils";
import ProfileContentCard from "../../_components/profile-content-card";

interface CareerObjectiveCardProps {
  content: string | undefined;
}

const CareerObjectivCard = ({ content }: CareerObjectiveCardProps) => {
  return (
    <section className="mt-14">
      <ProfileContentCard>
        <div>
          <h1 className="text-dark-blue-700 mb-4 text-[27px] font-bold">
            Career Objective
          </h1>
        </div>
        {!content ? (
          <p className="font-medium text-gray-400">
            No career objective found.
          </p>
        ) : (
          <p
            className={cn(
              "prose max-w-none text-left text-[17px] lg:text-justify",
            )}
            dangerouslySetInnerHTML={{ __html: content ?? "" }}
          ></p>
        )}
      </ProfileContentCard>
    </section>
  );
};

export default CareerObjectivCard;
