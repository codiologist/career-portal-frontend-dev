import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import ResetPasswordForm from "./_components/reset-password-form";
import bg from "/public/register-bg.jpg";

const ResetPassword = () => {
  return (
    <div className="relative h-screen">
      <div className="absolute inset-0 z-0 h-full w-full">
        <Image src={bg} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="absolute h-full w-full bg-black/50 backdrop-blur-lg"></div>
      <div className="relarive flex h-screen flex-col justify-center bg-gray-50">
        <div className="mx-auto w-full max-w-md p-6">
          <div className="relative z-20 mt-7 rounded-sm border-2 border-blue-300 bg-white shadow-lg">
            <div className="p-4 sm:p-7">
              <div className="text-center">
                <h1 className="text-primary block text-2xl font-bold">
                  Reset Your Password
                </h1>
              </div>

              <div className="relative z-10 mt-5">
                <Suspense fallback={<div className="text-center">Loading...</div>}>
                  <ResetPasswordForm />
                </Suspense>
              </div>

              <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                Don&apos;t reset your password? Return to{" "}
                <Link
                  href="/login"
                  className="text-primary font-medium decoration-2 hover:underline"
                >
                  Home
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
