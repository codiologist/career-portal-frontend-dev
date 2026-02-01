import Image from "next/image";
import Link from "next/link";
import LoginForm from "./_components/login-form";

const LoginPage = () => {
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
                  className="mx-auto h-auto w-20"
                />
              </Link>
            </div>
            <div className="mt-4 mb-12">
              <p className="text-blue-water text-center text-3xl font-bold">
                Welcome
              </p>
              <p className="mt-2 text-center text-gray-600">
                Login to access your account.
              </p>
            </div>

            <LoginForm />

            <p className="pt-12 text-center text-sm">
              Forgot your password?{" "}
              <Link
                href="/forgot-password"
                className="text-primary font-medium decoration-2"
              >
                Click Here
              </Link>
            </p>

            <div className="pt-2 pb-12 text-center">
              <p className="text-sm whitespace-nowrap">
                Don&apos;t have an account? Please{" "}
                <Link href="/register" className="text-primary font-semibold">
                  Register.
                </Link>
              </p>
            </div>
          </div>
          <p className="py-6 text-center">
            © 2026 Career Portal. All rights reserved.
          </p>
        </div>
        <div className="pointer-events-none relative hidden bg-black shadow-2xl select-none md:block md:w-1/2 lg:w-2/3">
          <Image
            className="h-screen w-full object-cover opacity-80"
            src="/login-bg.jpg"
            alt="Login background"
            width={1920}
            height={1080}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
