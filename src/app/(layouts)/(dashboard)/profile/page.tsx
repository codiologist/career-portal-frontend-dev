import Image from "next/image";
import ProfileDetails from "./_components/profile-details";
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

        <ProfileDetails />
      </div>
    </>
  );
};

export default ProfilePage;
