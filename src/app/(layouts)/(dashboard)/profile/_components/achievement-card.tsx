import { CandidateAchievement } from "@/types/achievement-types";
import { Globe, LucideCalendar1, School } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { LiaCertificateSolid } from "react-icons/lia";
import { PiCertificateLight } from "react-icons/pi";
import ProfileContentCard from "../../_components/profile-content-card";

interface AchievementCardProps {
  achievements: CandidateAchievement[] | undefined;
}

const AchievementCard = ({ achievements }: AchievementCardProps) => {
  return (
    <section className="mt-10">
      <ProfileContentCard title="Award &amp; Achievements">
        {achievements && achievements.length === 0 ? (
          <p className="text-sm font-medium text-gray-400">
            No experience data found
          </p>
        ) : (
          <ul className="space-y-6">
            {achievements?.map((achievement, idx) => (
              <li
                key={achievement.id}
                className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between"
              >
                <div>
                  <p className="text-dark-blue-700 mb-2 ml-1 flex items-center gap-2 text-base font-semibold xl:text-lg">
                    Achievement - {achievements.length}
                  </p>
                  <h4 className="text-dark-blue-700 item-start mb-1 flex gap-2 text-base font-bold xl:items-center xl:text-xl">
                    <LiaCertificateSolid className="size-7" />
                    {achievement.title}
                  </h4>
                  <div className="mt-1 ml-1 flex flex-col flex-wrap gap-4 xl:flex-row xl:items-center">
                    <p className="flex items-start gap-2 text-sm font-semibold xl:items-center xl:text-base">
                      <School className="text-dark-blue-700/80 size-4.5 xl:size-5" />
                      {achievement.organizationName}
                    </p>
                    <div className="flex gap-4">
                      <p className="flex items-center gap-2 text-sm font-semibold xl:text-base">
                        <LucideCalendar1 className="text-dark-blue-700/80 size-4 xl:size-5" />
                        {achievement.year}
                      </p>
                      <p className="flex items-center gap-2 text-sm font-semibold xl:text-base">
                        <PiCertificateLight className="text-dark-blue-700/80 size-4.5 xl:size-6" />
                        {achievement.location}
                      </p>
                      <Link
                        href={achievement.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-semibold xl:text-base"
                      >
                        <Globe className="text-dark-blue-700/80 size-4.5" />
                        Website
                      </Link>
                    </div>
                  </div>
                  <div className="mt-4 ml-1">
                    <p className="text-dark-blue-700 font-bold">Details</p>
                    <p className="flex items-center gap-2 text-sm font-medium xl:text-base">
                      {achievement.description}
                    </p>
                  </div>
                </div>
                <div className="rounded-sm border p-1">
                  <Image
                    src="/certificate.jpg"
                    alt="University of Example"
                    width={280}
                    height={180}
                    className="h-auto w-full rounded-sm object-cover xl:w-50"
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </ProfileContentCard>
    </section>
  );
};

export default AchievementCard;
