import PersonalInformationForm from "./_components/personal-information-form";
import { ResumeUploadForm } from "./_components/resume-upload-form";
import { SignatureUploadForm } from "./_components/signature-upload-form";

const PersonalInfoPage = () => {
  return (
    <div className="space-y-8">
      <section>
        <PersonalInformationForm />
      </section>
      <section>
        <div className="xl:border-dark-blue-200 xl:bg-dark-blue-200/10 rounded-2xl p-0 xl:border xl:p-4">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <ResumeUploadForm />
            <SignatureUploadForm />
          </div>
        </div>
      </section>
    </div>
  );
};

export default PersonalInfoPage;
