import { Card, CardContent } from "@/components/ui/card";
import { cookies } from "next/headers";
import ChangePasswordForm from "./_components/change-password-form";

const ChangePasswordPage = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    return (
        <div>
            <Card className="rounded-sm shadow-md">
                <CardContent>
                    <h1 className="text-2xl font-semibold mb-4">Change Password</h1>

                    <ChangePasswordForm token={token ?? {}} />
                </CardContent>
            </Card>
        </div>
    );
};

export default ChangePasswordPage;
