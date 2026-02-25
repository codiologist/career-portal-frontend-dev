// "use client";

// import { Button } from "@/components/ui/button";
// import { Form } from "@/components/ui/form";
// import { useAuth } from "@/context/AuthContext";
// import api from "@/lib/axiosInstance";
// import {
//   defaultEducation,
//   educationInfoFormSchema,
//   EducationInfoFormValues,
// } from "@/schemas/education.schema";
// import { TCandidateEducation } from "@/types/education-types";
// import { TUserData } from "@/types/profile-types";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Loader2, PlusCircle, Send } from "lucide-react";
// import { useEffect, useState } from "react";
// import { useFieldArray, useForm } from "react-hook-form";
// import { toast } from "react-toastify";
// import EducationCard from "./education-card";

// export default function EducationInfoForm() {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [existingCertificateUrls, setExistingCertificateUrls] = useState<
//     (string | undefined)[]
//   >([]);
//   const { user } = useAuth();

//   const form = useForm<EducationInfoFormValues>({
//     resolver: zodResolver(educationInfoFormSchema),
//     defaultValues: {
//       educations: [{ ...defaultEducation }],
//     },
//   });

//   const { fields, append, remove } = useFieldArray({
//     control: form.control,
//     name: "educations",
//   });

//   useEffect(() => {
//     if (!user) return;

//     const rawEducations = (user?.data as TUserData)?.candidateEducations;
//     console.log("Raw Educations:", rawEducations);

//     const educations =
//       rawEducations?.length > 0
//         ? rawEducations.map((item: TCandidateEducation) => ({
//             levelOfEducationId: item.level?.id ?? "",
//             levelName: item.level?.levelName ?? "",
//             degreeNameId: item.degree?.id ?? "",
//             educationBoardId: item.board?.id ?? "",
//             majorGroupId: item.majorGroup?.id ?? "",
//             subjectName: item.subjectName ?? "",
//             instituteName: item.instituteName ?? "",
//             resultTypeId: item.resultType?.id ?? "",
//             totalMarksCGPA: item.totalMarksCGPA ?? "",
//             yearOfPassing: item.passingYear ? String(item.passingYear) : "",
//             certificate: undefined,
//             existingCertificateUrl: item.documents?.[0]?.path ?? undefined,
//           }))
//         : [{ ...defaultEducation }];

//     setExistingCertificateUrls(
//       rawEducations?.length > 0
//         ? rawEducations.map(
//             (item: TCandidateEducation) =>
//               item.documents?.[0]?.path ?? undefined,
//           )
//         : [],
//     );
//     form.reset({ educations });
//   }, [user, form]);

//   const onSubmit = async (data: EducationInfoFormValues) => {
//     setIsSubmitting(true);

//     try {
//       const formData = new FormData();
//       function optional<T>(key: string, value?: T) {
//         return value !== undefined && value !== null && value !== ""
//           ? { [key]: value }
//           : {};
//       }
//       const educationsPayload = data.educations.map((edu, index) => ({
//         levelId: edu.levelOfEducationId,
//         degreeId: edu.degreeNameId,
//         instituteName: edu.instituteName,
//         resultTypeId: edu.resultTypeId,

//         ...optional("boardId", edu.educationBoardId),
//         ...optional("majorGroupId", edu.majorGroupId),
//         ...optional("totalMarksCGPA", edu.totalMarksCGPA),
//         ...optional("subjectName", edu.subjectName),

//         passingYear: Number(edu.yearOfPassing),
//         existingCertificateUrl: edu.existingCertificateUrl ?? null,
//         certificateIndex: index,
//       }));

//       data.educations.forEach((edu) => {
//         if (edu.certificate instanceof File) {
//           formData.append("certificate", edu.certificate);
//         }
//       });

//       formData.append("data", JSON.stringify(educationsPayload));

//       const response = await api.post("/user/profile/education", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       console.log("Server Response:", response);
//       toast.success(
//         `${user?.data?.candidateEducations.length !== 0 ? "Updated" : "Created"} education information successfully.`,
//       );
//     } catch (error) {
//       console.error("Submission error:", error);
//       toast.error("Upload failed.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="xl:border-dark-blue-200 xl:bg-dark-blue-200/10 rounded-2xl p-0 xl:border xl:p-4">
//       <Form {...form}>
//         <form
//           onSubmit={form.handleSubmit(onSubmit, (err) => {
//             console.log("Validation Errors:", err);
//           })}
//           className="space-y-6"
//         >
//           {/* Education Sections */}
//           <div className="space-y-5">
//             {fields.map((field, index) => (
//               <EducationCard
//                 key={field.id}
//                 index={index}
//                 form={form}
//                 onRemove={() => remove(index)}
//                 canRemove={fields.length > 1}
//                 existingCertificateUrl={existingCertificateUrls[index]}
//               />
//             ))}
//           </div>

//           <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//             {/* Add More Button */}
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => append({ ...defaultEducation })}
//               className="text-dark-blue-700! hover:bg-primary hover:text-primary border-dark-blue-600 gap-2 rounded-sm border-dashed text-base font-semibold"
//             >
//               <PlusCircle className="h-4 w-4" />
//               Add More Education
//             </Button>

//             {/* Submit Button */}
//             <Button
//               type="submit"
//               disabled={isSubmitting}
//               className="gap-2 rounded-sm text-base font-semibold"
//             >
//               {isSubmitting ? (
//                 <Loader2 className="h-4 w-4 animate-spin" />
//               ) : (
//                 <Send className="h-4 w-4" />
//               )}
//               {isSubmitting ? "Submitting…" : "Submit"}
//             </Button>
//           </div>
//         </form>
//       </Form>
//     </div>
//   );
// }

"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axiosInstance";
import {
  defaultEducation,
  educationInfoFormSchema,
  EducationInfoFormValues,
} from "@/schemas/education.schema";
import { TCandidateEducation } from "@/types/education-types";
import { TUserData } from "@/types/profile-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PlusCircle, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import EducationCard from "./education-card";

export default function EducationInfoForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingCertificateUrls, setExistingCertificateUrls] = useState<
    (string | undefined)[]
  >([]);
  const { user } = useAuth();

  const form = useForm<EducationInfoFormValues>({
    resolver: zodResolver(educationInfoFormSchema),
    defaultValues: {
      educations: [{ ...defaultEducation }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "educations",
  });

  useEffect(() => {
    if (!user) return;

    const rawEducations = (user?.data as TUserData)?.candidateEducations;
    console.log("Raw Educations:", rawEducations);

    const educations =
      rawEducations?.length > 0
        ? rawEducations.map((item: TCandidateEducation) => ({
            // ✅ educationId carry করো যাতে update/delete কাজ করে
            educationId: item.id ?? "",
            levelOfEducationId: item.level?.id ?? "",
            levelName: item.level?.levelName ?? "",
            degreeNameId: item.degree?.id ?? "",
            educationBoardId: item.board?.id ?? "",
            majorGroupId: item.majorGroup?.id ?? "",
            subjectName: item.subjectName ?? "",
            instituteName: item.instituteName ?? "",
            resultTypeId: item.resultType?.id ?? "",
            totalMarksCGPA: item.totalMarksCGPA ?? "",
            yearOfPassing: item.passingYear ? String(item.passingYear) : "",
            certificate: undefined,
            existingCertificateUrl: item.documents?.[0]?.path ?? undefined,
          }))
        : [{ ...defaultEducation }];

    setExistingCertificateUrls(
      rawEducations?.length > 0
        ? rawEducations.map(
            (item: TCandidateEducation) =>
              item.documents?.[0]?.path ?? undefined,
          )
        : [],
    );
    form.reset({ educations });
  }, [user, form]);

  const onSubmit = async (data: EducationInfoFormValues) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      function optional<T>(key: string, value?: T) {
        return value !== undefined && value !== null && value !== ""
          ? { [key]: value }
          : {};
      }

      const educationsPayload = data.educations.map((edu) => ({
        // ✅ educationId পাঠাও — non-empty = update, empty = create
        educationId: edu.educationId ?? "",
        levelId: edu.levelOfEducationId,
        degreeId: edu.degreeNameId,
        instituteName: edu.instituteName,
        resultTypeId: edu.resultTypeId,
        ...optional("boardId", edu.educationBoardId),
        ...optional("majorGroupId", edu.majorGroupId),
        ...optional("totalMarksCGPA", edu.totalMarksCGPA),
        ...optional("subjectName", edu.subjectName),
        passingYear: Number(edu.yearOfPassing),
        existingCertificateUrl: edu.existingCertificateUrl ?? null,
      }));

      // ✅ Index mismatch fix: নতুন file না থাকলে empty blob পাঠাও
      // যাতে backend-এ files[i] সঠিক achievement-এর সাথে match করে
      data.educations.forEach((edu) => {
        if (edu.certificate instanceof File) {
          formData.append("certificate", edu.certificate);
        } else {
          formData.append("certificate", new Blob([]), "");
        }
      });

      formData.append("data", JSON.stringify(educationsPayload));

      const response = await api.post("/user/profile/education", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Server Response:", response);

      const isUpdate = data.educations.some((e) => !!e.educationId);
      toast.success(
        `Education information ${isUpdate ? "updated" : "created"} successfully.`,
      );
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Upload failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="xl:border-dark-blue-200 xl:bg-dark-blue-200/10 rounded-2xl p-0 xl:border xl:p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (err) => {
            console.log("Validation Errors:", err);
          })}
          className="space-y-6"
        >
          {/* Education Sections */}
          <div className="space-y-5">
            {fields.map((field, index) => (
              <EducationCard
                key={field.id}
                index={index}
                form={form}
                onRemove={() => remove(index)}
                canRemove={fields.length > 1}
                existingCertificateUrl={existingCertificateUrls[index]}
              />
            ))}
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Add More Button */}
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ ...defaultEducation })}
              className="text-dark-blue-700! hover:bg-primary hover:text-primary border-dark-blue-600 gap-2 rounded-sm border-dashed text-base font-semibold"
            >
              <PlusCircle className="h-4 w-4" />
              Add More Education
            </Button>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="gap-2 rounded-sm text-base font-semibold"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {isSubmitting ? "Submitting…" : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
