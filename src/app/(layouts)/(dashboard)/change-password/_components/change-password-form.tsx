"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import api from "@/lib/axiosInstance";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import z from "zod";
const changePasswordSchema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

const ChangePasswordForm = ({ token }: { token: object }) => {
    const [isLoading, setIsLoading] = useState(false);

    console.log("Token form", token);

    const form = useForm<ChangePasswordFormData>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            password: "",
            // confirmPassword: "",
        },
    });
    const onSubmit = async () => {
        try {
            setIsLoading(true);
            await api.post("/auth/reset-password", {
                password: form.getValues().password,
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
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                                        <Input {...field} id="password" placeholder="Enter your password" type="password" className="pl-10 rounded-sm h-12 placeholder:text-base" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" variant="success" className="rounded-sm" disabled={isLoading}>
                        {isLoading ? "Updating..." : "Update"}
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default ChangePasswordForm;
