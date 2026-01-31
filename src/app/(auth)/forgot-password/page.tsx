import Image from "next/image";
import Link from "next/link";
import ForgotPasswordForm from "./_components/forgot-password-form";
import bg from "/public/register-bg.jpg";

const ForgotPassword = () => {
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
                  Forgot password?
                </h1>
              </div>

              <div className="relative z-10 mt-5">
                <ForgotPasswordForm />
              </div>
              <p className="mt-6 text-center text-sm">
                Go to{" "}
                <Link
                  href="/"
                  className="text-primary font-medium decoration-2"
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

export default ForgotPassword;
