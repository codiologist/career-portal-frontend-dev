"use client";

import { Form, FormControl } from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useAuth } from "@/context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
// import { toast } from "sonner";
import { Lock, Mail } from "lucide-react";
import { toast } from "react-toastify";
import * as z from "zod";
import GoogleBtn from "./GoogleBtn";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login, refetchUser } = useAuth();
  const router = useRouter();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormData) {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success("Login successful!");
      router.push("/profile");
      refetchUser();
    } catch (err: unknown) {
      const error = err as ErrorResponse;
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "An unexpected error occurred.",
      );
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Mail className="text-muted-foreground absolute top-2.5 left-3 h-5 w-5" />
                    <Input
                      {...field}
                      id="email"
                      placeholder="you@example.com"
                      type="email"
                      disabled={isLoading}
                      className="rounded-sm pl-10"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Lock className="text-muted-foreground absolute top-2.5 left-3 h-5 w-5" />
                    <Input
                      {...field}
                      id="password"
                      placeholder="Enter your password"
                      type="password"
                      disabled={isLoading}
                      className="rounded-sm pl-10"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </Form>
      <div className="my-6 flex items-center">
        <div className="h-px w-full bg-gray-300"></div>
        <span className="mx-4 text-sm font-semibold text-gray-500">Or</span>
        <div className="h-px w-full bg-gray-300"></div>
      </div>

      <div>
        <GoogleBtn />
      </div>
    </div>
  );
};

export default LoginForm;
