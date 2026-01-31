import Image from "next/image";
import CareerObjectivCard from "./_components/career-objective-card";
import ContactInfoCard from "./_components/contact-info-card";
import EducationalInfoCard from "./_components/educational-info-card";
import ExperienceInfoCard from "./_components/experience-info-card";
import IntroCard from "./_components/intro-card";
import OtherInfoCard from "./_components/others-info-card";
import PersonalInfoCard from "./_components/personal-info-card";
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

          <div className="flex flex-col gap-0 lg:flex-row xl:gap-14">
            <div className="w-full lg:w-8/12">
              <CareerObjectivCard />
              <ExperienceInfoCard />
              <EducationalInfoCard />
            </div>
            <div className="w-full lg:w-4/12">
              <ContactInfoCard />
              <PersonalInfoCard />
              <OtherInfoCard />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
