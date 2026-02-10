import PersonalInformationForm from "./_components/personal-information-form";
import { ResumeUploadForm } from "./_components/resume-upload-form";
import { SignatureUploadForm } from "./_components/signature-upload-form";

const PersonalInfoPage = () => {
  return (
    <div className="space-y-8">
      <section>
        <PersonalInformationForm />
      </section>
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ResumeUploadForm />
        <SignatureUploadForm />
      </section>
    </div>
  );
};

export default PersonalInfoPage;
