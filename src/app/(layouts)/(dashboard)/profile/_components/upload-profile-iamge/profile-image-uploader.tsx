"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, ImageUp, Loader2, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import default_image from "/public/default-avatar.jpg";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/axiosInstance";
import { cn } from "@/lib/utils";
import Image, { type StaticImageData } from "next/image";
import { toast } from "react-toastify";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const imageUploadSchema = z.object({
  name: z.string().optional(),
  image: z
    .custom<File>()
    .refine((file) => file instanceof File, "Please select an image")
    .refine(
      (file) => file instanceof File && file.size <= MAX_FILE_SIZE,
      "Image must be less than 1MB",
    )
    .refine(
      (file) =>
        file instanceof File && ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only JPG and PNG images are allowed",
    ),
});

type ImageUploadFormValues = z.infer<typeof imageUploadSchema>;

interface ProfileImageUploaderProps {
  defaultImage?: StaticImageData | string;
  onUpload?: (file: File) => Promise<void>;
  className?: string;
}

export function ProfileImageUploader({
  defaultImage = default_image,
  onUpload,
  className,
}: ProfileImageUploaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | StaticImageData>(
    defaultImage,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { user } = useAuth();
  const avatar = (user as any)?.data?.documents?.find(
    (doc: any) => doc.type === "AVATAR",
  );

  useEffect(() => {
    if (avatar) {
      setCurrentImage(`${process.env.NEXT_PUBLIC_API_URL}/${avatar.path}`);
    }
  }, [avatar, user]);

  const form = useForm<ImageUploadFormValues>({
    resolver: zodResolver(imageUploadSchema),
    defaultValues: {
      name: "avatar",
      image: undefined,
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file, { shouldValidate: true });
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    form.reset();
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleOpenModal = () => {
    setIsOpen(true);
    form.reset();
    setPreview(null);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    form.reset();
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: ImageUploadFormValues) => {
    setIsSubmitting(true);
    try {
      if (onUpload) {
        await onUpload(data.image);
      } else {
        // Default behavior: call API endpoint
        const formData = new FormData();
        formData.append("name", "avatar");
        formData.append("avatar", data.image);
        console.log(data);

        const response = await api.post("/upload/user/avatar", formData);

        console.log("Avatar Response:", response);
        toast.success("Avatar uploaded successfully!");

        if (response.status !== 200) {
          throw new Error("Upload failed");
        }
      }

      // Update the displayed image with the preview
      if (preview) {
        // const avatar = res;
        setCurrentImage(preview);
      }
      handleCloseModal();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to upload image. Please try again.");
      }
      console.error("Upload error:", error);
      form.setError("image", {
        message: "Failed to upload image. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn("relative h-47.5 w-40", className)}>
      {/* Cover Image Display */}
      <div className="relative h-47.5 w-40 rounded-lg">
        <Image
          src={currentImage || default_image}
          alt="Profile Image"
          width={160}
          height={190}
          className="border-dark-blue-100 h-47.5 w-40 rounded-sm border-2 bg-white object-cover object-top"
        />

        {/* Overlay Icon - Bottom Right */}
        <button
          type="button"
          onClick={handleOpenModal}
          className="bg-primary hover:bg-dark-blue-700 focus:ring-ring absolute -top-4 -right-4 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full shadow-md backdrop-blur-sm transition-all hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:outline-none"
          aria-label="Change cover image"
        >
          <Camera className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* Upload Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="mx-auto sm:max-w-87.5 xl:max-w-sm"
          showCloseButton={false}
        >
          <DialogHeader>
            <DialogTitle className="text-dark-blue-700 mb-2 text-center text-2xl font-semibold">
              Upload Profile Image
            </DialogTitle>

            {/* <DialogDescription>
              Select a JPG or PNG image (max 1MB)
            </DialogDescription> */}
          </DialogHeader>
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="image"
                  render={() => (
                    <FormItem>
                      <FormControl>
                        <div className="">
                          {/* Preview Area */}
                          {preview ? (
                            <div className="relative mx-auto h-auto w-50 rounded-lg">
                              <Image
                                src={preview || "/placeholder.svg"}
                                alt="Preview"
                                width={200}
                                height={255}
                                className="h-full w-full object-cover object-top"
                              />
                              <div className="px-4">
                                <Button
                                  type="button"
                                  onClick={handleRemoveImage}
                                  className="text-dark-blue-700 relative z-10 -mt-4 flex w-full items-center border border-gray-300 bg-white text-base shadow-md transition-all hover:bg-white"
                                  aria-label="Remove image"
                                >
                                  Change Image
                                  <ImageUp className="size-6" />
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div
                              className="hover:bg-muted/50 border-dark-blue flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <Upload className="text-dark-blue-700 mb-2 h-10 w-10" />
                              <p className="text-muted-foreground text-sm">
                                Click to upload an image
                              </p>
                              <p className="text-muted-foreground mt-1 text-xs">
                                JPG or PNG, max 1MB
                              </p>
                            </div>
                          )}

                          {/* Hidden File Input */}
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".jpg,.jpeg,.png"
                            onChange={handleFileSelect}
                            className="hidden"
                          />

                          {/* Upload Button (visible when no preview) */}
                          {/* {!preview && (
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full bg-transparent"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            Select Image
                          </Button>
                        )} */}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter className="mt-0 flex! flex-row gap-2 sm:justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseModal}
                    disabled={isSubmitting}
                    className="text-dark-blue-700 text-base font-semibold"
                  >
                    Close
                  </Button>
                  <Button
                    type="submit"
                    disabled={!preview || isSubmitting}
                    className="bg-dark-blue-700 text-base font-semibold"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
