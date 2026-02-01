import Image from "next/image";
import AchievementCard from "./_components/achievement-card";
import CareerObjectivCard from "./_components/career-objective-card";
import ContactInfoCard from "./_components/contact-info-card";
import EducationalInfoCard from "./_components/educational-info-card";
import ExperienceInfoCard from "./_components/experience-info-card";
import { InterestsCard } from "./_components/intertest-card";
import IntroCard from "./_components/intro-card";
import OtherDocumentsCard from "./_components/other-documets-card";
import OtherInfoCard from "./_components/others-info-card";
import PersonalInfoCard from "./_components/personal-info-card";
import ReferenceInfo from "./_components/reference-info-card";
import SkillsInfoCard from "./_components/skills-info-card";
import bg from "/public/profile-details-cover-photo.jpg";

const ProfilePage = () => {
  return (
    <>
      <div className="space-y-8">
        <div className="relative">
          <Image
            src={bg}
            alt="Background Image"
            width={1920}
            height={1080}
            className="hidden lg:block"
          />
          <div className="bg-liner-to-b absolute inset-0 left-0 z-10 h-auto w-full bg-black/50" />
        </div>
        <div className="relative z-10 mx-auto mt-14 w-full px-0 lg:-mt-14 xl:px-10">
          {/* Candidate Intro Card */}
          <IntroCard />

          <div className="flex flex-col gap-0 xl:flex-row xl:gap-14">
            <div className="w-full xl:w-8/12">
              <CareerObjectivCard />
              <ExperienceInfoCard />
              <EducationalInfoCard />
              <SkillsInfoCard />
              <AchievementCard />
              <ReferenceInfo />
              <OtherDocumentsCard />
            </div>
            <div className="w-full xl:w-4/12">
              <ContactInfoCard />
              <PersonalInfoCard />
              <OtherInfoCard />
              <InterestsCard />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
