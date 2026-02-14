import { cn } from "@/lib/utils";
import { CandidateExperiences } from "@/types/experience-types";
import { format } from "date-fns";
import {
  BriefcaseBusiness,
  Building2,
  IdCardLanyard,
  MapPin,
  Toolbox,
} from "lucide-react";
import { FaCircle } from "react-icons/fa6";
import ProfileContentCard from "../../_components/profile-content-card";

interface ExperienceInfoCardProps {
  experiences: CandidateExperiences | undefined;
}

const ExperienceInfoCard = ({ experiences }: ExperienceInfoCardProps) => {
  return (
    <section className="mt-10">
      <ProfileContentCard title="Work & Experience">
        <ul>
          {experiences?.map((experience, idx) => {
            return (
              <li
                key={experience.id}
                className="relative flex items-baseline gap-5 pb-5"
              >
                {experiences.length > 1 ? (
                  <div
                    className={cn(
                      experiences.length - 1 !== idx
                        ? "before:bg-dark-blue-700/40 before:absolute before:top-2 before:left-1.75 before:h-full before:w-0.5"
                        : "",
                    )}
                  >
                    <FaCircle className="text-dark-blue-700 size-4" />
                  </div>
                ) : (
                  <div className="text-dark-blue-700 relative top-0.5">
                    <FaCircle className="size-4" />
                  </div>
                )}

                <div>
                  <div className="flex flex-col items-start xl:flex-row xl:items-center xl:gap-4">
                    <h3 className="text-dark-blue-700 mb-0.5 text-xl font-bold">
                      {experience.designation}
                    </h3>

                    <div className="hidden rounded-full bg-blue-100/50 px-4 py-0.5 xl:block">
                      <p className="text-dark-blue-700 text-sm font-semibold">
                        {experience.startDate
                          ? format(
                              new Date(experience.startDate),
                              "do MMMM, yyyy",
                            )
                          : ""}{" "}
                        -{" "}
                        {experience.endDate
                          ? format(
                              new Date(experience.endDate),
                              "do MMMM, yyyy",
                            )
                          : "Continue"}
                      </p>
                    </div>
                  </div>
                  <ul className="mt-1.5 space-y-2.5">
                    <li className="flex items-start gap-3 xl:items-center">
                      <IdCardLanyard
                        size={16}
                        className="text-dark-blue-700/60 size-5"
                      />
                      <p className="font-medium">{experience.department}</p>
                    </li>
                    <li className="flex items-start gap-3 xl:items-center">
                      <Building2
                        size={16}
                        className="text-dark-blue-700/60 size-5"
                      />
                      <p className="font-medium">{experience.companyName}</p>
                    </li>
                    <li className="flex items-start gap-3 xl:items-center">
                      <Toolbox
                        size={16}
                        className="text-dark-blue-700/60 size-5"
                      />
                      <p className="font-medium">
                        {experience.companyBusinessType}
                      </p>
                    </li>
                    <li className="flex items-start gap-3 xl:items-center">
                      <MapPin
                        size={16}
                        className="text-dark-blue-700/60 size-9 xl:size-5"
                      />
                      <p className="font-medium">{experience.location}</p>
                    </li>
                  </ul>
                  <p className="text-dark-blue-700 mt-2 flex items-center gap-3 text-[17px] font-bold">
                    <BriefcaseBusiness
                      size={20}
                      className="text-dark-blue-700/60"
                    />
                    Responsiblities:
                  </p>

                  <p
                    className="prose job-responsibilities mt-0.5 pl-7 text-base"
                    dangerouslySetInnerHTML={{
                      __html: experience.responsibilities ?? "",
                    }}
                  ></p>
                </div>
              </li>
            );
          })}
        </ul>
      </ProfileContentCard>
    </section>
  );
};

export default ExperienceInfoCard;
