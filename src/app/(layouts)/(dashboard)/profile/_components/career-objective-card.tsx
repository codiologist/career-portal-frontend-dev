"use client";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import ProfileContentCard from "../../_components/profile-content-card";

const CareerObjectivCard = () => {
  const { user } = useAuth();
  const careerObjective = user?.data.candidatePersonal.careerObjective;
  console.log(
    "User in Career Objective:",
    user?.data.candidatePersonal.careerObjective,
  );
  return (
    <section className="mt-14">
      <ProfileContentCard title="Career Objective">
        <p
          className={cn(
            "prose max-w-none text-left text-[17px] lg:text-justify",
          )}
          dangerouslySetInnerHTML={{ __html: careerObjective ?? "" }}
        ></p>
      </ProfileContentCard>
    </section>
  );
};

export default CareerObjectivCard;
