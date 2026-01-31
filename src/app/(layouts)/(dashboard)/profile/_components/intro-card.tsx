"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { DownloadIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import insta_icon from "/public/instagram-icon.svg";

const IntroCard = () => {
  const { isAuthenticated, user } = useAuth();
  return (
    <section>
      <Card className="border-primary rounded-sm border-0 border-t-5 pt-4 pb-3 shadow-[0_20px_55px_rgba(15_23_42/0.1)]">
        <CardContent className="relative">
          <div className="absolute -top-20 left-[30%] mb-10 rounded-sm bg-white p-2 xl:left-5">
            <Image
              src="/firoj.jpg"
              alt="Profile Picture"
              width={120}
              height={120}
              className="mx-auto h-38 w-full rounded-sm object-contain"
            />
          </div>
          <div className="mt-26 xl:mt-2 xl:ml-36">
            <div className="flex flex-col xl:flex-row xl:items-start">
              <div className="w-full text-center xl:w-9/12 xl:text-left">
                <h1 className="text-primary font-exo2 mb-1 text-3xl font-extrabold uppercase xl:text-4xl">
                  Firoj Ahmed
                </h1>
                <h2 className="mb-2 text-xl font-bold xl:text-2xl">
                  Frontend Developer
                </h2>
              </div>
              <div className="mt-4 w-full text-center xl:mt-0 xl:w-3/12 xl:text-right">
                <Button className="rounded-xs text-lg font-semibold">
                  <DownloadIcon className="mr-1 size-6" />
                  Download Resume
                </Button>
                <div className="mt-6">
                  <ul className="flex flex-wrap items-center justify-center gap-4 xl:justify-end">
                    <li>
                      <Link
                        href=""
                        target="_blank"
                        className="hover:text-primary mr-4"
                      >
                        <FaFacebook size={29} className="text-[#0B66FF]" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href=""
                        target="_blank"
                        className="hover:text-primary mr-4 text-gray-600"
                      >
                        <FaLinkedin size={28} className="text-[#1666C2]" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href=""
                        target="_blank"
                        className="hover:text-primary mr-4"
                      >
                        <Image
                          src={insta_icon}
                          className="size-6.5 h-auto"
                          alt="Instagram"
                        />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href=""
                        target="_blank"
                        className="hover:text-primary mr-4"
                      >
                        <FaXTwitter size={28} className="text-black" />
                      </Link>
                    </li>
                  </ul>
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
