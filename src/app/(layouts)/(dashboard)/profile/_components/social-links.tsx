import { socialLinksDropdown } from "@/_data/social_links_dropdown";
import { SocialLink } from "@/types/profile.types";
import Link from "next/link";

interface SocialLinksProps {
  data: SocialLink[] | null | undefined;
}

const SocialLinks = ({ data }: SocialLinksProps) => {
  return (
    <div className="mt-3">
      <ul className="flex flex-wrap items-center justify-center gap-4 lg:justify-start xl:justify-end">
        {data?.map((link) => (
          <li key={link.id}>
            <Link
              href={link.url}
              target="_blank"
              className="hover:text-primary mr-4"
            >
              {(() => {
                const item = socialLinksDropdown.find(
                  (item) => item.value === link.label,
                );
                if (!item || !item.icon) return null;
                const Icon = item.icon;
                return <Icon size={30} className="text-dark-blue-700" />;
              })()}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SocialLinks;
