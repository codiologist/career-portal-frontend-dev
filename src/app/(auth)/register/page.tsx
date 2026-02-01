import Image from "next/image";
import Link from "next/link";
import RegistrationForm from "./_components/registration-form";

const RegistrationPage = () => {
  return (
    <div>
      <div className="flex w-full flex-wrap">
        <div className="flex w-full flex-col md:w-1/2 lg:w-1/3">
          <div className="my-auto flex flex-col justify-center px-6 pt-8 sm:px-24 md:justify-start md:px-8 md:pt-0 lg:px-12">
            <div>
              <Link href="/">
                <Image
                  src="/career-portal-logo.png"
                  alt="Career Portal Logo"
                  width={200}
                  height={100}
                  className="h-auto w-20"
                />
              </Link>
            </div>
            <div className="mt-6 mb-10">
              <h2 className="text-primary text-left text-4xl font-bold">
                Start journey with us
              </h2>
              <p className="mt-3 text-gray-600">
                Build a profile that stands out, connect with employers, and
                unlock tailored recommendations to accelerate your career
                journey.
              </p>
            </div>

            <RegistrationForm />

            <div className="pt-12 pb-12 text-center">
              <p className="text-sm whitespace-nowrap">
                Have an account?{" "}
                <Link href="/login" className="text-primary font-semibold">
                  Login
                </Link>
              </p>
            </div>
          </div>
          <p className="py-6 text-center">
            © 2026 Career Portal. All rights reserved.
          </p>
        </div>
        <div className="pointer-events-none hidden bg-black shadow-2xl select-none md:block md:w-1/2 lg:w-2/3">
          <Image
            className="h-screen w-full object-cover opacity-80"
            src="/register-bg.jpg"
            alt="Registration background"
            width={1920}
            height={1080}
          />
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
