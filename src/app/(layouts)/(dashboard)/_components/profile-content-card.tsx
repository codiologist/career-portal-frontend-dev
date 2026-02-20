import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ProfileContentCardProps = {
  title?: string;
  children: React.ReactNode;
  className?: string;
};

const ProfileContentCard = ({
  title,
  children,
  className,
}: ProfileContentCardProps) => {
  return (
    <Card
      className={cn(
        "w-full rounded-4xl border-0 p-6 pt-4 shadow-[0_20px_55px_rgba(15_23_42/0.1)]",
        className,
      )}
    >
      <CardContent className="p-0">
        {title && (
          <h1 className="text-dark-blue-700 mb-4 text-[27px] font-bold">
            {title}
          </h1>
        )}
        {children}
      </CardContent>
    </Card>
  );
};

export default ProfileContentCard;
