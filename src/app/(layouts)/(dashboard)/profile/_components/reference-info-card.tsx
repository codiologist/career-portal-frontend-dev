import { CandidateReference } from "@/types/reference-types";
import { Building2, Handshake, IdCardLanyard, Mail } from "lucide-react";
import { FaMobileAlt } from "react-icons/fa";
import ProfileContentCard from "../../_components/profile-content-card";

interface ReferenceInfoProps {
  references: CandidateReference[] | undefined;
}

const ReferenceInfo = ({ references }: ReferenceInfoProps) => {
  return (
    <section className="mt-10">
      <ProfileContentCard title="References">
        {references && references.length === 0 ? (
          <p className="text-sm font-medium text-gray-400">
            No references data found
          </p>
        ) : (
          <div
            className={`grid grid-cols-1 gap-4 ${references && references.length > 0 ? "md:grid-cols-2" : "md:grid-cols-1"}`}
          >
            {references?.map((item) => {
              return (
                <div
                  className="rounded border border-gray-200 p-4"
                  key={item.id}
                >
                  <h4 className="text-dark-blue-700 text-lg font-bold">
                    {item.name}
                  </h4>
                  <ul className="">
                    <li className="flex items-center gap-1 font-medium">
                      <IdCardLanyard className="text-dark-blue-700/80 size-4 shrink-0" />
                      {item.designation}
                    </li>
                    <li className="flex items-center gap-1 font-medium">
                      <Building2 className="text-dark-blue-700/80 size-4 shrink-0" />
                      {item.companyName}
                    </li>
                    <li className="flex items-center gap-1 font-medium">
                      <FaMobileAlt className="text-dark-blue-700/80 size-4 shrink-0" />
                      {item.phone}
                    </li>
                    <li className="flex items-center gap-1 font-medium">
                      <Mail className="text-dark-blue-700/80 size-4 shrink-0" />
                      {item.emailAddress}
                    </li>
                    <li className="flex items-center gap-1 font-medium">
                      <Handshake className="text-dark-blue-700/80 size-4 shrink-0" />
                      {item.relationship}
                    </li>
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </ProfileContentCard>
    </section>
  );
};

export default ReferenceInfo;
