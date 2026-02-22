import { cn } from "@/lib/utils";
import { TCandidateEducation } from "@/types/education-types";
import { Book, GraduationCap, LucideCalendar1, School } from "lucide-react";
import Image from "next/image";
import { PiCertificateLight } from "react-icons/pi";
import ProfileContentCard from "../../_components/profile-content-card";

interface EducationalInfoCardrops {
  educations: TCandidateEducation[] | undefined;
}

const EducationalInfoCard = ({ educations }: EducationalInfoCardrops) => {
  return (
    <section className="mt-10">
      <ProfileContentCard title="Education">
        {educations && educations.length === 0 ? (
          <p className="text-sm font-medium text-gray-400">
            No education data found
          </p>
        ) : (
          <ul className="space-y-4">
            {educations?.map((education, idx) => {
              return (
                <li
                  key={education.id}
                  className="border-dark-blue-300/50 rounded-2xl border px-4 py-4"
                >
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                    <div className="w-full xl:w-9/12">
                      <h4 className="text-dark-blue-700 item-start mb-2 flex gap-2 text-base font-bold xl:items-center xl:text-xl">
                        <GraduationCap className="size-7" />
                        {education.level.levelName === "Higher Secondary"
                          ? "Higher Secondary School Certificate (HSC)"
                          : education.level.levelName === "Secondary"
                            ? "Secondary School Certificate (SSC)"
                            : education.degree?.degreeName ||
                              education.level.levelName}
                      </h4>
                      <div className="space-y-1.5 pl-1">
                        <p className="flex items-center gap-2 text-sm font-semibold xl:text-base">
                          <Book className="text-dark-blue-700/80 size-4 xl:size-5" />
                          {education.majorGroup.groupName}
                        </p>
                        <p className="flex items-start gap-2 text-sm font-semibold xl:items-center xl:text-base">
                          <School className="text-dark-blue-700/80 size-4 xl:size-5" />
                          {education.instituteName}
                        </p>
                        <div className="flex flex-col gap-1 xl:gap-1">
                          <p className="flex items-center gap-2 text-sm font-semibold xl:text-base">
                            <LucideCalendar1 className="text-dark-blue-700/80 size-4 xl:size-5" />
                            {education.passingYear}
                          </p>
                          <p className="flex gap-1 text-sm font-semibold xl:items-center xl:text-base">
                            <PiCertificateLight className="text-dark-blue-700/80 size-4.5 xl:size-6" />
                            <span>
                              {education.level.levelName ===
                                "Higher Secondary" &&
                              education.resultType.resultType === "Grade"
                                ? "GPA:"
                                : education.level.levelName === "Secondary" &&
                                    education.resultType.resultType === "Grade"
                                  ? "GPA:"
                                  : education.resultType.resultType}
                            </span>
                            <span>
                              {education.resultType.resultType !== "Grade"
                                ? "Total Marks:"
                                : ""}
                              <span
                                className={cn(
                                  education.resultType.resultType !== "Grade"
                                    ? "ml-1"
                                    : "",
                                )}
                              >
                                {education.totalMarksCGPA}
                              </span>
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="w-full xl:w-3/12">
                      <Image
                        src={
                          education.documents && education.documents.length > 0
                            ? `${process.env.NEXT_PUBLIC_API_URL}/${education.documents[0].path}`
                            : "/certificate.jpg"
                        }
                        alt={
                          education.documents && education.documents.length > 0
                            ? (education.documents[0].name ?? "Certificate")
                            : "Certificate"
                        }
                        width={280}
                        height={180}
                        className="border-dark-blue-700/10 h-auto w-full rounded-sm border-2 object-cover p-1 xl:w-60"
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </ProfileContentCard>
    </section>
  );
};

export default EducationalInfoCard;
