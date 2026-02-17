"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import api from "@/lib/axiosInstance";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import z from "zod";
import { TextInput } from "../../update-profile/_components/form-inputs";
const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "Current password must be at least 6 characters"),
    password: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

const ChangePasswordForm = ({ token }: { token: object }) => {
  const [isLoading, setIsLoading] = useState(false);

  console.log("Token form", token);

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
  });
  const onSubmit = async () => {
    try {
      setIsLoading(true);
      await api.post("/auth/change-password", {
        currentPassword: form.getValues().currentPassword,
        newPassword: form.getValues().password,
        token: token, // token is a string | undefined
      });
      toast.success("Password updated successfully!");
    } catch (error) {
      console.error("Error changing password:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      {" "}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <TextInput
            form={form}
            label="Current Password"
            name="currentPassword"
            placeholder="Enter your current password"
            required
          />

          <TextInput
            form={form}
            label="New Password"
            name="password"
            placeholder="Enter your new password"
            required
          />
          <TextInput
            form={form}
            label="Confirm New Password"
            name="confirmPassword"
            placeholder="Confirm your new password"
            required
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isLoading}
              className="gap-2 rounded-sm text-base font-semibold"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {isLoading ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ChangePasswordForm;
