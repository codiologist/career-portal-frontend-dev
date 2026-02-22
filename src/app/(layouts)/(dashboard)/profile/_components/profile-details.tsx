"use client";
import { useAuth } from "@/context/AuthContext";
import { TUserData } from "@/types/profile-types";
import { useEffect, useState } from "react";
import AchievementCard from "./achievement-card";
import CareerObjectivCard from "./career-objective-card";
import ContactInfoCard from "./contact-info-card";
import EducationalInfoCard from "./educational-info-card";
import ExperienceInfoCard from "./experience-info-card";
import { InterestsCard } from "./intertest-card";
import IntroCard from "./intro-card";
import OtherInfoCard from "./others-info-card";
import PersonalInfoCard from "./personal-info-card";
import ReferenceInfo from "./reference-info-card";
import SkillsInfoCard from "./skills-info-card";

const ProfileDetails = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<TUserData | null>(null);

  useEffect(() => {
    if (user) {
      setUserData(user.data);
    }
  }, [user]);

  console.log("Profile Details Card", user);

  return (
    <div className="relative z-10 mx-auto mt-14 w-full px-0 lg:-mt-14 xl:px-10">
      <IntroCard
        user={userData?.candidatePersonal}
        documents={userData?.documents}
      />

      <div className="flex flex-col gap-0 xl:flex-row xl:gap-14">
        <div className="w-full xl:w-8/12">
          <CareerObjectivCard
            content={user?.data?.candidatePersonal?.careerObjective}
          />
          <ExperienceInfoCard experiences={user?.data?.candidateExperiences} />
          <EducationalInfoCard educations={user?.data?.candidateEducations} />
          <SkillsInfoCard skills={user?.data?.candidatePersonal?.skills} />
          <AchievementCard achievements={user?.data?.candidateAchievements} />
          <ReferenceInfo references={user?.data?.candidateReferences} />
          {/* <OtherDocumentsCard /> */}
        </div>
        <div className="w-full xl:w-4/12">
          <ContactInfoCard
            regPhone={user?.data?.phone}
            phone={user?.data?.candidatePersonal?.mobileNo}
            alternatePhone={user?.data?.candidatePersonal?.alternatePhone}
            email={user?.data?.email}
            addresses={user?.data?.addresses}
          />
          <PersonalInfoCard
            fatherName={user?.data?.candidatePersonal?.fatherName}
            motherName={user?.data?.candidatePersonal?.motherName}
            spouseName={user?.data?.candidatePersonal?.spouseName}
          />
          <OtherInfoCard
            dob={user?.data?.candidatePersonal?.dob}
            maritalStatus={user?.data?.candidatePersonal?.maritalStatus}
            gender={user?.data?.candidatePersonal?.gender}
            nationality={user?.data?.candidatePersonal?.nationality}
            nationalId={user?.data?.candidatePersonal?.nationalId}
            bloodGroup={user?.data?.candidatePersonal?.bloodGroup?.name}
            religion={user?.data?.candidatePersonal?.religion?.name}
          />
          <InterestsCard interests={user?.data?.candidatePersonal?.interests} />
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
