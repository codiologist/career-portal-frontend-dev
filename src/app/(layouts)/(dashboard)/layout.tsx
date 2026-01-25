import Sidebar from "./sidebar";
import TopNavBar from "./top-navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="flex h-screen overflow-hidden">
                <Sidebar />
                <div className="flex flex-col flex-1 overflow-hidden">
                    <TopNavBar />
                    <main className="flex-1 overflow-y-auto px-9 py-5 bg-gray-100">{children}</main>
                </div>
            </div>
        </>
    );
}
