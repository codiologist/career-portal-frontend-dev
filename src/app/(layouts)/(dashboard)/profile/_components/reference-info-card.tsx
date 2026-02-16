import { CandidateReference } from "@/types/reference-types";
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
            className={`grid grid-cols-1 gap-4 ${references && references.length > 0 ? "md:grid-cols-1" : "md:grid-cols-1"}`}
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
                    <li className="font-medium">{item.designation}</li>
                    <li className="font-medium">{item.companyName}</li>
                    <li className="font-medium">{item.phone}</li>
                    <li className="font-medium">{item.emailAddress}</li>
                    <li className="font-medium">{item.relationship}</li>
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
