import { cookies } from "next/headers";
import ProfileContentCard from "../_components/profile-content-card";
import ChangePasswordForm from "./_components/change-password-form";

const ChangePasswordPage = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  return (
    <div>
      <ProfileContentCard className="border-border bg-card relative rounded-lg border p-5 shadow-none md:p-6">
        <h1 className="text-dark-blue-700 mb-4 text-lg font-bold xl:text-2xl">
          Change Password
        </h1>
        <ChangePasswordForm token={token ?? {}} />
      </ProfileContentCard>
    </div>
  );
};

export default ChangePasswordPage;
