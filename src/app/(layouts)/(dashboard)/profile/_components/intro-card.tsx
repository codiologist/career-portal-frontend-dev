"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TUserDocument } from "@/types/document-types";
import { TUserProfile } from "@/types/profile-types";
import { DownloadIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import SocialLinks from "./social-links";
import { ProfileImageUploader } from "./upload-profile-iamge/profile-image-uploader";

interface IntroCardProps {
  user: TUserProfile | undefined;
  documents?: TUserDocument[]; // Adjust the type as needed based on your document structure
}

const IntroCard = ({ user, documents }: IntroCardProps) => {
  const [resumeURL, setResumeURL] = useState<string | null>(null);

  const resume = documents?.find((doc: TUserDocument) => doc.type === "RESUME");

  useEffect(() => {
    if (resume) {
      setResumeURL(`${process.env.NEXT_PUBLIC_API_URL}/${resume.path}`);
    }
  }, [resume]);

  return (
    <section>
      <Card className="border-primary rounded-4xl border-0 border-t-5 pt-4 pb-3 shadow-[0_20px_55px_rgba(15_23_42/0.1)]">
        <CardContent className="relative">
          <div className="lg:item-start flex flex-col items-center gap-0 lg:flex-row lg:gap-7">
            <div className="mt-0 xl:-mt-20">
              <ProfileImageUploader />
            </div>
            <div className="mt-6 flex-1">
              <div className="flex flex-col items-start xl:flex-row">
                <div className="w-full text-center lg:text-left xl:w-8/12 2xl:w-9/12">
                  <h1 className="text-dark-blue-700 font-exo2 mb-1 text-3xl font-extrabold uppercase xl:text-[40px]">
                    {user?.fullName}
                  </h1>
                  <h2 className="mb-2 text-xl font-bold xl:text-2xl">
                    {user?.careerTitle}
                  </h2>
                </div>
                <div className="mt-3 w-full text-left xl:mt-0 xl:w-4/12 xl:text-right 2xl:w-3/12">
                  <Link href={resumeURL ? `${resumeURL}` : "#"} target="_blank">
                    <Button className="bg-dark-blue-700 rounded-xs text-lg font-semibold">
                      <DownloadIcon className="mr-1 size-6" />
                      Download Resume
                    </Button>
                  </Link>
                  <SocialLinks data={user?.socialLink} />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default IntroCard;
