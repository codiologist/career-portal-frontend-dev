import { Card, CardContent } from "@/components/ui/card";

const ProfilePage = () => {
    return (
        <div className="space-y-10">
            <Card className="rounded-sm shadow-md">
                <CardContent>
                    <h1 className="text-2xl font-semibold mb-4">Profile Details</h1>
                </CardContent>
            </Card>
            <Card className="rounded-sm shadow-md">
                <CardContent>
                    <h1 className="text-2xl font-semibold mb-4">Professional Details</h1>
                </CardContent>
            </Card>
            <Card className="rounded-sm shadow-md">
                <CardContent>
                    <h1 className="text-2xl font-semibold mb-4">Education </h1>
                </CardContent>
            </Card>
            <Card className="rounded-sm shadow-md">
                <CardContent>
                    <h1 className="text-2xl font-semibold mb-4">Skills </h1>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProfilePage;
