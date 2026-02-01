"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { DownloadIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaLinkedin } from "react-icons/fa";
import { FaInstagram, FaXTwitter } from "react-icons/fa6";

const IntroCard = () => {
  useAuth();
  return (
    <section>
      <Card className="border-primary rounded-4xl border-0 border-t-5 pt-4 pb-3 shadow-[0_20px_55px_rgba(15_23_42/0.1)]">
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
          <div className="mt-26 xl:mt-1 xl:ml-36">
            <div className="flex flex-col xl:flex-row xl:items-start">
              <div className="w-full text-center xl:w-9/12 xl:text-left">
                <h1 className="text-blue-water-700 font-exo2 mb-1 text-3xl font-extrabold uppercase xl:text-[40px]">
                  Firoj Ahmed
                </h1>
                <h2 className="mb-2 text-xl font-bold xl:text-2xl">
                  Frontend Developer
                </h2>
              </div>
              <div className="mt-4 w-full text-center xl:mt-0 xl:w-3/12 xl:text-right">
                <Button className="bg-blue-water-700 rounded-xs text-lg font-semibold">
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
                        <FaFacebook size={29} className="text-blue-water-700" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href=""
                        target="_blank"
                        className="hover:text-primary mr-4"
                      >
                        <FaLinkedin size={30} className="text-blue-water-700" />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href=""
                        target="_blank"
                        className="hover:text-primary mr-4"
                      >
                        <FaInstagram
                          size={28}
                          className="text-blue-water-700"
                        />
                      </Link>
                    </li>
                    <li>
                      <Link
                        href=""
                        target="_blank"
                        className="hover:text-primary mr-4"
                      >
                        <FaXTwitter size={28} className="text-blue-water-700" />
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
