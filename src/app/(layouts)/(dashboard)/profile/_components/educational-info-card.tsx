import { Book, GraduationCap, LucideCalendar1, School } from "lucide-react";
import Image from "next/image";
import { PiCertificateLight } from "react-icons/pi";
import ProfileContentCard from "../../_components/profile-content-card";

const EducationalInfoCard = () => {
  return (
    <section className="mt-10">
      <ProfileContentCard title="Education">
        <ul className="space-y-6">
          <li className="border-blue-water-300/50 flex flex-col gap-4 rounded-2xl border px-4 py-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <h4 className="text-blue-water-700 item-start mb-2 flex gap-2 text-base font-bold xl:items-center xl:text-2xl">
                <GraduationCap className="size-7" />
                Higher Secondary School Certificate (HSC)
              </h4>
              <div className="space-y-1.5 pl-1">
                <p className="flex items-center gap-2 text-sm font-semibold xl:text-base">
                  <Book className="text-blue-water-700/80 size-4 xl:size-5" />
                  Science
                </p>
                <p className="flex items-start gap-2 text-sm font-semibold xl:items-center xl:text-base">
                  <School className="text-blue-water-700/80 size-4 xl:size-5" />
                  Gazipur Cantonment Board College
                </p>
                <div className="flex gap-4">
                  <p className="flex items-center gap-2 text-sm font-semibold xl:text-base">
                    <LucideCalendar1 className="text-blue-water-700/80 size-4 xl:size-5" />
                    2004
                  </p>
                  <p className="flex items-center gap-2 text-sm font-semibold xl:text-base">
                    <PiCertificateLight className="text-blue-water-700/80 size-4.5 xl:size-6" />
                    GPA: 4.80
                  </p>
                </div>
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
          <li className="border-blue-water-300/50 flex flex-col gap-4 rounded-2xl border px-4 py-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <h4 className="text-blue-water-700 item-start mb-2 flex gap-2 text-base font-bold xl:items-center xl:text-2xl">
                <GraduationCap className="size-7" />
                Secondary School Certificate (SSC)
              </h4>
              <div className="space-y-1.5 pl-1">
                <p className="flex items-center gap-2 text-sm font-semibold xl:text-base">
                  <Book className="text-blue-water-700/80 size-4 xl:size-5" />
                  Science
                </p>
                <p className="flex items-start gap-2 text-sm font-semibold xl:items-center xl:text-base">
                  <School className="text-blue-water-700/80 size-4 xl:size-5" />
                  Gazipur Cantonment Board High School
                </p>
                <div className="flex gap-4">
                  <p className="flex items-center gap-2 text-sm font-semibold xl:text-base">
                    <LucideCalendar1 className="text-blue-water-700/80 size-4 xl:size-5" />
                    2002
                  </p>
                  <p className="flex items-center gap-2 text-sm font-semibold xl:text-base">
                    <PiCertificateLight className="text-blue-water-700/80 size-4.5 xl:size-6" />
                    GPA: 4.10
                  </p>
                </div>
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
        </ul>
      </ProfileContentCard>
    </section>
  );
};

export default EducationalInfoCard;
