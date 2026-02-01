"use client";
import { Mail, Phone, User } from "lucide-react";
import GoogleBtn from "../../login/_components/GoogleBtn";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { useAuth } from "@/context/AuthContext";
import { SignupInput, signupSchema } from "@/schemas/auth.schema";
import { useState } from "react";
import { toast } from "react-toastify";

const RegistrationForm = () => {
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      // name: "Firoj Ahmed",
      // email: "robin.promoteur@gmail.com",
      // password: "123456",
      // confirmPassword: "123456",
      // terms: true,
      name: "",
      email: "",
      password: "",
      phone: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const onSubmit = async (data: SignupInput) => {
    try {
      setLoading(true);

      console.log("Registration data:", data);

      const res = await signup(
        data.name,
        data.email,
        data.phone,
        data.password,
      );

      console.log(res);
      if (res.status) {
        toast.success(
          "Account created successfully! Please verify your email.",
        );
        setLoading(false);
      }
    } catch {
      // Error is handled in AuthContext
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Full Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <User className="text-muted-foreground absolute top-2.5 left-3 h-5 w-5" />
                    <Input
                      {...field}
                      className="rounded-sm pl-10"
                      placeholder="Enter your full name"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                      className="rounded-sm pl-10"
                      placeholder="email@mail.com"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Mobile Number */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Phone className="text-muted-foreground absolute top-2.5 left-3 h-5 w-5" />
                    <Input
                      {...field}
                      className="rounded-sm pl-10"
                      placeholder="Enter your mobile number"
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
                      type="password"
                      className="rounded-sm pl-10"
                      placeholder="Enter your password"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Lock className="text-muted-foreground absolute top-2.5 left-3 h-5 w-5" />
                    <Input
                      {...field}
                      type="password"
                      className="rounded-sm pl-10"
                      placeholder="Confirm your password"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Terms */}
          <FormField
            control={form.control}
            name="terms"
            render={({ field }) => (
              <FormItem className="flex items-start gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal">
                  I agree to the{" "}
                  <Link href="#" className="text-primary">
                    Terms
                  </Link>{" "}
                  &
                  <Link href="#" className="text-primary">
                    {" "}
                    Privacy
                  </Link>
                </FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={loading} className="mt-4 w-full">
            {loading ? "Creating..." : "Create Account"}
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

export default RegistrationForm;
